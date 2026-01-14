import React, { useState, useEffect, useRef } from "react";
import { io } from "socket.io-client";
import axios from "axios";

const ChatBox = ({ currentUser, receiverId }) => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [arrivalMessage, setArrivalMessage] = useState(null);
  const socket = useRef();

  useEffect(() => {
    socket.current = io("ws://localhost:5000");
    socket.current.on("getMessage", (data) => {
      setArrivalMessage({
        sender: data.senderId,
        text: data.text,
        createdAt: Date.now(),
      });
    });
  }, []);

  useEffect(() => {
    arrivalMessage && setMessages((prev) => [...prev, arrivalMessage]);
  }, [arrivalMessage]);

  const handleSend = async (e) => {
    e.preventDefault();
    const message = {
      senderId: currentUser._id,
      receiverId: receiverId,
      text: newMessage,
    };

    socket.current.emit("sendMessage", message);
    // API call karke DB mein save karein
    // await axios.post("/api/messages", message);
    setMessages([...messages, { sender: currentUser._id, text: newMessage }]);
    setNewMessage("");
  };

  return (
    <div className="chat-window">
      <div className="messages-list">
        {messages.map((m) => (
          <div className={m.sender === currentUser._id ? "msg own" : "msg"}>
            {m.text}
          </div>
        ))}
      </div>
      <form onSubmit={handleSend} className="chat-input">
        <input 
          value={newMessage} 
          onChange={(e) => setNewMessage(e.target.value)} 
          placeholder="Type a message..." 
        />
        <button type="submit">Send</button>
      </form>
    </div>
  );
};

export default ChatBox;