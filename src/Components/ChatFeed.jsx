import { useEffect, useRef, useState } from "react";
import { signOut } from "firebase/auth";
import { Link, useNavigate } from "react-router-dom";
import { auth } from "../firebase";
import { createRoom, getPublicUsername, getUserProfile, sendChatMessage, subscribeToMessages, subscribeToRooms } from "../services";
import MessageForm from "./MessageForm";

const ChatFeed = ({ user }) => {
  const fallbackUsername = user.displayName && user.displayName !== "User"
    ? user.displayName
    : user.email?.split("@")[0] || "Member";
  const [rooms, setRooms] = useState([]);
  const [activeRoomId, setActiveRoomId] = useState("");
  const [messages, setMessages] = useState([]);
  const [senderNames, setSenderNames] = useState({});
  const [username, setUsername] = useState(fallbackUsername);
  const [roomName, setRoomName] = useState("");
  const [error, setError] = useState("");
  const seededDefaultRoom = useRef(false);
  const messagesEndRef = useRef(null);
  const navigate = useNavigate();
  const activeRoom = rooms.find((room) => room.id === activeRoomId);

  useEffect(() => {
    getUserProfile(user).then((profile) => setUsername(profile.username || fallbackUsername)).catch(() => setUsername(fallbackUsername));
    return subscribeToRooms((nextRooms) => {
      setRooms(nextRooms);
      if (nextRooms.length) setActiveRoomId((current) => current || nextRooms[0].id);
      if (!nextRooms.length && !seededDefaultRoom.current) {
        seededDefaultRoom.current = true;
        createRoom("General", user).catch(() => setError("Could not create the first chat room. Check Firestore rules."));
      }
    }, () => setError("Could not load chat rooms. Check your Firestore setup and rules."));
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, fallbackUsername]);

  useEffect(() => {
    if (!activeRoomId) return undefined;
    setMessages([]);
    return subscribeToMessages(activeRoomId, setMessages, () => setError("Could not load messages."));
  }, [activeRoomId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    const missingNames = [...new Set(messages
      .filter((message) => !message.username || message.username === "User" || message.username === "Member")
      .map((message) => message.uid)
      .filter((uid) => uid && !senderNames[uid]))];
    missingNames.forEach((uid) => {
      getPublicUsername(uid).then((name) => {
        if (name) setSenderNames((current) => ({ ...current, [uid]: name }));
      }).catch(() => {});
    });
  }, [messages, senderNames]);

  const handleCreateRoom = async (event) => {
    event.preventDefault();
    if (!roomName.trim()) return;
    try {
      const room = await createRoom(roomName, user);
      setActiveRoomId(room.id);
      setRoomName("");
      setError("");
    } catch {
      setError("Could not create the room. Check your Firestore rules.");
    }
  };

  const handleSignOut = async () => {
    await signOut(auth);
    navigate("/");
  };

  const handleSend = async (text) => {
    if (!activeRoomId) return;
    try {
      await sendChatMessage(activeRoomId, user, username, text);
    } catch {
      setError("Message could not be sent. Check your Firestore rules.");
    }
  };

  return (
    <main className="firebase-chat">
      <aside className="room-sidebar">
        <Link className="chat-brand" to="/chat"><span className="brand-icon">T</span><span>talkall<small>YOUR COMMUNITY</small></span></Link>
        <div className="sidebar-section-heading"><h2>Channels</h2><span>{rooms.length}</span></div>
        <div className="room-list">
          {rooms.map((room) => (
            <button key={room.id} className={`room-button ${room.id === activeRoomId ? "selected" : ""}`} onClick={() => setActiveRoomId(room.id)}>
              <span>#</span>{room.name}
            </button>
          ))}
        </div>
        <form className="new-room-form" onSubmit={handleCreateRoom}>
          <input aria-label="New channel name" value={roomName} onChange={(event) => setRoomName(event.target.value)} placeholder="Create a channel" />
          <button type="submit" aria-label="Create channel">+</button>
        </form>
        <div className="sidebar-account">
          <div className="account-avatar">{username.charAt(0).toUpperCase()}</div>
          <div className="account-identity"><strong>{username}</strong><span>Available</span></div>
          <Link to="/profile" className="account-settings" aria-label="Profile settings" title="Profile settings">⚙</Link>
          <button className="account-signout" onClick={handleSignOut} title="Sign out" aria-label="Sign out">↗</button>
        </div>
      </aside>
      <section className="room-content">
        <header className="room-header"><div><span className="room-hash">#</span><h2>{activeRoom?.name || "Choose a channel"}</h2></div><p>A place for the conversation.</p></header>
        {error && <p className="chat-error">{error}</p>}
        <div className="firebase-message-list">
          {messages.map((message) => {
            const isMine = message.uid === user.uid;
            const senderName = message.username && message.username !== "User"
              && message.username !== "Member"
              ? message.username
              : senderNames[message.uid] || (message.uid === user.uid ? username : "Member");
            const sentAt = message.createdAt?.toDate ? message.createdAt.toDate().toLocaleTimeString([], { hour: "numeric", minute: "2-digit" }) : "sending";
            return (
              <article key={message.id} className={`message-item ${isMine ? "from-me" : "from-them"}`}>
                <div className={`message-avatar ${isMine ? "avatar-mine" : "avatar-them"}`}>{senderName.charAt(0).toUpperCase()}</div>
                <div className="message-body"><div className="message-meta"><strong>{isMine ? `${senderName} (you)` : senderName}</strong><time>{sentAt}</time></div><p>{message.text}</p></div>
              </article>
            );
          })}
          {!messages.length && <div className="empty-chat"><span className="empty-chat-icon">✳</span><h3>Welcome to #{activeRoom?.name || "Talk All"}</h3><p>This is the start of this channel. Say hello and get the conversation going.</p></div>}
          <div ref={messagesEndRef} />
        </div>
        <div className="composer-wrap"><MessageForm onSend={handleSend} /></div>
      </section>
    </main>
  );
};

export default ChatFeed;
