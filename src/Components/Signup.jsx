import React from "react";
import { useState } from "react";
import { createUser } from "../services";
import { useNavigate } from "react-router-dom";

const Signup = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastname, setLastname] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
        const payload = {
            username: username,
            secret: password,
            first_name: firstName,
            last_name: lastname,
          };

        const res =  await createUser(payload);
        console.log(res)
        if(res){
            navigate('/');
        }

      setError("");
    } catch (err) {
      setError(err.response.data.message);
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
              required
            />
            <input
              type="text"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              className="input"
              placeholder="FirstName"
              required
            />
            <input
              type="LastName"
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
          <div align="center">
            <button type="submit" className="button">
              <span>Sign Up</span>
            </button>
          </div>
        </form>
        <h1>{error}</h1>
      </div>
    </div>
  );
};

export default Signup;
