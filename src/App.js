import { ChatEngine } from "react-chat-engine";
import "./App.css";
import ChatFeed from "./Components/ChatFeed";
import Modal from "./Components/LoginForm";
import Signup from "./Components/Signup";
import { Route, Routes } from "react-router-dom";

const App = () => {
  const projectID = "c92885c1-8205-4d27-af69-9d1e2066e33d"; //process.env.REACT_APP_PROJECTID;
  return (
    <>
      <Routes>
       <Route path="/" element={<Modal />}></Route>
        <Route
          path="/chat"
          element={
            <ChatEngine
              height="100vh"
              projectID={projectID}
              userName={sessionStorage.getItem("username")}
              userSecret={sessionStorage.getItem("password")}
              renderChatFeed={(chatAppProps) => <ChatFeed {...chatAppProps} />}
              onNewMessage={() =>
                new Audio(
                  "https://chat-engine-assets.s3.amazonaws.com/click.mp3"
                ).play()
              }
            />
          }
        ></Route>
        <Route path="/signup" element={<Signup />}></Route>
      </Routes>
    </>
  );
};

export default App;
