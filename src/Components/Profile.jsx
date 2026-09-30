import { useEffect, useState } from "react";
import { sendPasswordResetEmail, signOut, updateEmail, updateProfile } from "firebase/auth";
import { Link, useNavigate } from "react-router-dom";
import { auth } from "../firebase";
import { getUserProfile, saveUserProfile } from "../services";

const Profile = ({ user }) => {
  const [form, setForm] = useState({ username: user.displayName || "", firstName: "", lastName: "", email: user.email || "" });
  const [notice, setNotice] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    getUserProfile(user).then((profile) => setForm((current) => ({ ...current, ...profile, email: user.email || profile.email || "" })));
  }, [user]);

  const change = (event) => setForm({ ...form, [event.target.name]: event.target.value });

  const handleSave = async (event) => {
    event.preventDefault();
    setError("");
    setNotice("");
    try {
      if (form.email.trim() !== user.email) await updateEmail(user, form.email.trim());
      await updateProfile(user, { displayName: form.username.trim() });
      await saveUserProfile(user, { username: form.username.trim(), email: form.email.trim(), firstName: form.firstName.trim(), lastName: form.lastName.trim() });
      setNotice("Your profile has been saved.");
    } catch (err) {
      setError(err.code === "auth/requires-recent-login" ? "For security, sign out and back in before changing your email." : "Could not save your profile. Please try again.");
    }
  };

  const handlePasswordReset = async () => {
    setError("");
    setNotice("");
    try {
      await sendPasswordResetEmail(auth, user.email);
      setNotice(`Password reset link sent to ${user.email}.`);
    } catch {
      setError("Could not send a reset email. Check the email address and Firebase email settings.");
    }
  };

  return (
    <main className="auth-page profile-page">
      <section className="profile-card">
        <header className="profile-heading">
          <Link className="brand-mark" to="/chat">T<span>A</span></Link>
          <Link className="back-link" to="/chat">Back to chat</Link>
        </header>
        <div className="profile-avatar">{(form.username || "U").charAt(0).toUpperCase()}</div>
        <p className="eyebrow">YOUR ACCOUNT</p>
        <h1>Profile settings</h1>
        <form onSubmit={handleSave} className="auth-form profile-form">
          <label>Username<input name="username" value={form.username || ""} onChange={change} pattern="[A-Za-z0-9_.-]{3,30}" required /></label>
          <div className="profile-name-fields">
            <label>First name<input name="firstName" value={form.firstName || ""} onChange={change} /></label>
            <label>Last name<input name="lastName" value={form.lastName || ""} onChange={change} /></label>
          </div>
          <label>Email address<input name="email" type="email" value={form.email || ""} onChange={change} required /></label>
          <button className="button primary-button" type="submit">Save profile</button>
        </form>
        <div className="password-panel">
          <div><h2>Password</h2><p>We will email you a link to choose a new password.</p></div>
          <button className="button secondary-button" onClick={handlePasswordReset}>Send reset link</button>
        </div>
        {notice && <p className="success-message">{notice}</p>}
        {error && <p className="form-error">{error}</p>}
        <button type="button" className="text-button profile-signout" onClick={async () => { await signOut(auth); navigate("/"); }}>Sign out</button>
      </section>
    </main>
  );
};

export default Profile;
