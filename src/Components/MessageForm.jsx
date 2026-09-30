import { useState } from "react";
import { SendOutlined } from "@ant-design/icons";

const MessageForm = ({ onSend }) => {
  const [value, setValue] = useState("");
  const handleSubmit = async (event) => {
    event.preventDefault();
    const text = value.trim();
    if (!text) return;
    setValue("");
    await onSend(text);
  };

  return (
    <form className="message-form" onSubmit={handleSubmit}>
      <input className="message-input" placeholder="Send a message..." value={value} onChange={(event) => setValue(event.target.value)} />
      <button type="submit" className="send-button" aria-label="Send message"><SendOutlined className="send-icon" /></button>
    </form>
  );
};

export default MessageForm;
