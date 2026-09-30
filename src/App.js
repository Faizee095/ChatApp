import { useEffect, useState } from "react";
import "./App.css";
import Modal from "./Components/LoginForm";
import Signup from "./Components/Signup";
import ChatFeed from "./Components/ChatFeed";
import Profile from "./Components/Profile";
import ResetPassword from "./Components/ResetPassword";
import { onAuthStateChanged } from "firebase/auth";
import { Navigate, Route, Routes } from "react-router-dom";
import { auth, isFirebaseConfigured } from "./firebase";

const App = () => {
  const [user, setUser] = useState(null);
  const [authReady, setAuthReady] = useState(false);

  useEffect(() => {
    if (!isFirebaseConfigured) return undefined;
    return onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setAuthReady(true);
    });
  }, []);

  if (!isFirebaseConfigured) {
    return <div className="setup-message"><h1>Connect Firebase</h1><p>Add your Firebase web app settings to a <code>.env</code> file. See <code>.env.example</code> and the README for setup steps.</p></div>;
  }

  if (!authReady) return <div className="setup-message">Loading...</div>;

  return (
    <>
      <Routes>
        <Route path="/" element={user ? <Navigate to="/chat" replace /> : <Modal />} />
        <Route path="/chat" element={user ? <ChatFeed user={user} /> : <Navigate to="/" replace />} />
        <Route path="/signup" element={user ? <Navigate to="/chat" replace /> : <Signup />} />
        <Route path="/profile" element={user ? <Profile user={user} /> : <Navigate to="/" replace />} />
        <Route path="/reset-password" element={user ? <Navigate to="/profile" replace /> : <ResetPassword />} />
      </Routes>
    </>
  );
};

export default App;
