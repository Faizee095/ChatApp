import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase";

const loginEmail = (value) => value.trim().includes("@") ? value.trim() : `${value.trim().toLowerCase()}@talkall.local`;

const Modal = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await signInWithEmailAndPassword(auth, loginEmail(username), password);
      navigate("/chat");
      setError("");
    } catch (err) {
      setError(err.code === "auth/too-many-requests" ? "Too many attempts. Try again later." : "Username or password is incorrect.");
    }
  };

  const handleSignup = () => {
    navigate('/signup');
  };

  return (
    <div className="wrapper">
      <div className="form">
        <h1 className="title">TALK ALL</h1>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="input"
            placeholder="Email address or username"
            required
          />
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="input"
            placeholder="Password"
            required
          />
          <div className="auth-actions">
            <button type="submit" className="button primary-button">
              <span>Start chatting</span>
            </button>
          </div>
          <div className="auth-links">
            <button type="button" className="text-button" onClick={() => navigate("/reset-password")}>Forgot password?</button>
            <span>New here? <button type="button" className="text-button" onClick={handleSignup}>Create an account</button></span>
          </div>
        </form>
        {error && <p className="form-error">{error}</p>}
      </div>
    </div>
  );
};

export default Modal;
