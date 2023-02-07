import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { getChat } from "../services";

const projectID = "c92885c1-8205-4d27-af69-9d1e2066e33d"; //process.env.REACT_APP_PROJECTID;

const Modal = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const authObject = {
      "Project-ID": projectID,
      "User-Name": username,
      "User-Secret": password,
    };

    try {
      const res = await getChat(authObject);

      sessionStorage.setItem("username", username);
      sessionStorage.setItem("password", password);

      navigate('/chat');
      setError("");
    } catch (err) {
      setError("Oops, incorrect credentials.");
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
            placeholder="Username"
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
          <div align="center">
            <button type="submit" className="button">
              <span>Start chatting</span>
            </button>
          </div>
          <div align="center">
            <button onClick={handleSignup} className="button">
              <span>SignUp</span>
            </button>
          </div>
        </form>
        <h1>{error}</h1>
      </div>
    </div>
  );
};

export default Modal;
