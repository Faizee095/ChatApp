import {
  addDoc,
  collection,
  doc,
  getDoc,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  setDoc,
} from "firebase/firestore";
import { db } from "../firebase";

export const saveUserProfile = (user, profile) =>
  Promise.all([
    setDoc(
    doc(db, "users", user.uid),
    { username: profile.username, email: profile.email, firstName: profile.firstName, lastName: profile.lastName },
    { merge: true }
    ),
    setDoc(doc(db, "publicUsers", user.uid), { username: profile.username }, { merge: true }),
  ]);

export const getUserProfile = async (user) => {
  const snapshot = await getDoc(doc(db, "users", user.uid));
  const emailName = user.email?.split("@")[0];
  const fallbackName = user.displayName && user.displayName !== "User" ? user.displayName : emailName || "Member";
  const profile = snapshot.exists() ? snapshot.data() : {};
  const resolvedProfile = {
    ...profile,
    username: profile.username && profile.username !== "User" ? profile.username : fallbackName,
  };
  await setDoc(doc(db, "publicUsers", user.uid), { username: resolvedProfile.username }, { merge: true }).catch(() => {});
  return resolvedProfile;
};

export const getPublicUsername = async (userId) => {
  const snapshot = await getDoc(doc(db, "publicUsers", userId));
  return snapshot.exists() ? snapshot.data().username : null;
};

export const subscribeToRooms = (onRooms, onError) =>
  onSnapshot(query(collection(db, "rooms"), orderBy("createdAt", "asc")), (snapshot) => {
    onRooms(snapshot.docs.map((room) => ({ id: room.id, ...room.data() })));
  }, onError);

export const createRoom = (name, user) =>
  addDoc(collection(db, "rooms"), {
    name: name.trim(),
    createdBy: user.uid,
    createdAt: serverTimestamp(),
  });

export const subscribeToMessages = (roomId, onMessages, onError) =>
  onSnapshot(
    query(collection(db, "rooms", roomId, "messages"), orderBy("createdAt", "asc")),
    (snapshot) => onMessages(snapshot.docs.map((message) => ({ id: message.id, ...message.data() }))),
    onError
  );

export const sendChatMessage = (roomId, user, username, text) =>
  addDoc(collection(db, "rooms", roomId, "messages"), {
    text,
    uid: user.uid,
    username,
    createdAt: serverTimestamp(),
  });
