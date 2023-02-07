import { ChatEngine } from "react-chat-engine";
import './App.css';
import ChatFeed from "./Components/ChatFeed";


const App = () => {
    return (
        <ChatEngine
        height="100vh"
        projectID="c92885c1-8205-4d27-af69-9d1e2066e33d"
        userName="mdfaiyaz"
        userSecret="Test@123"
        renderChatFeed={(chatAppProps) => <ChatFeed {...chatAppProps} /> }
        />
    )
}

export default App;