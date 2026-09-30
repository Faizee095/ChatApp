import { useState } from "react";
import { sendPasswordResetEmail } from "firebase/auth";
import { Link } from "react-router-dom";
import { auth } from "../firebase";

const ResetPassword = () => {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    try {
      await sendPasswordResetEmail(auth, email.trim());
      setSent(true);
    } catch (err) {
      setError(err.code === "auth/user-not-found" ? "No account was found for that email." : "Could not send the reset email. Check the address and Firebase email settings.");
    }
  };

  return (
    <main className="auth-page">
      <section className="auth-card">
        <Link className="brand-mark" to="/">T<span>A</span></Link>
        <p className="eyebrow">ACCOUNT RECOVERY</p>
        <h1>Reset your password</h1>
        <p className="auth-description">Enter the email linked to your account. We will send you a secure reset link.</p>
        {sent ? <p className="success-message">If an account exists for that email, a reset link is on its way.</p> : (
          <form onSubmit={handleSubmit} className="auth-form">
            <label>Email address<input type="email" value={email} onChange={(event) => setEmail(event.target.value)} autoComplete="email" required /></label>
            {error && <p className="form-error">{error}</p>}
            <button className="button primary-button" type="submit">Send reset link</button>
          </form>
        )}
        <p className="auth-footnote"><Link to="/">Back to sign in</Link></p>
      </section>
    </main>
  );
};

export default ResetPassword;
