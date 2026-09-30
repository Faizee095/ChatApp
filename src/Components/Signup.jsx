import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { auth } from "../firebase";
import { saveUserProfile } from "../services";

const Signup = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastname, setLastname] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
        const credential = await createUserWithEmailAndPassword(auth, email.trim(), password);
        await updateProfile(credential.user, { displayName: username.trim() });
        await saveUserProfile(credential.user, { username: username.trim(), email: email.trim(), firstName: firstName.trim(), lastName: lastname.trim() });
        navigate("/chat");
      setError("");
    } catch (err) {
      setError(err.code === "auth/email-already-in-use" ? "An account already uses that email." : err.code === "auth/weak-password" ? "Password must be at least 6 characters." : err.code === "auth/operation-not-allowed" ? "Enable Email/Password sign-in in Firebase Authentication." : "Could not create account. Check your Firebase setup and try again.");
    }
  };
  return (
    <div className="wrapper">
      <div className="form">
        <h1 className="title">Sign Up To Chat</h1>
        <form onSubmit={handleSubmit}>
          <div className="signup">
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="input"
              placeholder="Username"
              pattern="[A-Za-z0-9_.-]{3,30}"
              title="Use 3 to 30 letters, numbers, dots, underscores, or hyphens."
              required
            />
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="input" placeholder="Email address" autoComplete="email" required />
            <input
              type="text"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              className="input"
              placeholder="FirstName"
              required
            />
            <input
              type="text"
              value={lastname}
              onChange={(e) => setLastname(e.target.value)}
              className="input"
              placeholder="Lastname"
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
          </div>
          <div className="auth-actions">
            <button type="submit" className="button primary-button">
              <span>Sign Up</span>
            </button>
          </div>
        </form>
        <p className="auth-footnote"><button type="button" className="text-button" onClick={() => navigate("/")}>Back to sign in</button></p>
        {error && <p className="form-error">{error}</p>}
      </div>
    </div>
  );
};

export default Signup;
