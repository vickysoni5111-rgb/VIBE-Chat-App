



import React, { useEffect, useState, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { io } from "socket.io-client";
import axios from "axios";

const Chat = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const queryParams = new URLSearchParams(location.search);
  const receiverId = queryParams.get("receiverId");
  const receiverNameFromUrl = queryParams.get("name") || "User";

  const [message, setMessage] = useState("");
  const [file, setFile] = useState(null);
  const [messages, setMessages] = useState([]);
  const [conversations, setConversations] = useState([]);
  const [isTyping, setIsTyping] = useState(false);
  const socket = useRef();
  const scrollRef = useRef();
  const currentUser = JSON.parse(localStorage.getItem("user"));

  // --- Logic (No Changes) ---
  useEffect(() => {
    socket.current = io("http://localhost:5000");
    socket.current.on("getMessage", (data) => {
      if (data.senderId === receiverId) {
        setMessages((prev) => [...prev, data]);
      }
      getConversations();
    });
    socket.current.on("displayTyping", (data) => { if (data.senderId === receiverId) setIsTyping(true); });
    socket.current.on("hideTyping", () => setIsTyping(false));
    return () => socket.current.disconnect();
  }, [receiverId]);

  useEffect(() => {
    if (currentUser?._id) {
      socket.current.emit("addUser", currentUser._id);
      getConversations();
    }
  }, [currentUser]);

  useEffect(() => {
    const fetchMessages = async () => {
      if (receiverId && currentUser?._id) {
        try {
          const convId = [currentUser._id, receiverId].sort().join("-");
          const res = await axios.get(`http://localhost:5000/api/messages/${convId}`);
          setMessages(res.data);
        } catch (err) { console.log(err); }
      }
    };
    fetchMessages();
  }, [receiverId]);

  const getConversations = async () => {
    try {
      const res = await axios.get(`http://localhost:5000/api/conversations/${currentUser._id}`);
      const unique = [];
      const map = new Map();
      res.data.forEach(c => {
        const otherId = c.members.find(m => m !== currentUser._id);
        if(!map.has(otherId)){ map.set(otherId, true); unique.push(c); }
      });
      setConversations(unique);
    } catch (err) { }
  };

  const handleTyping = (e) => {
    setMessage(e.target.value);
    if (e.target.value.length > 0) socket.current.emit("typing", { senderId: currentUser._id, receiverId });
    else socket.current.emit("stopTyping", { senderId: currentUser._id, receiverId });
  };

  const handleSend = async (e) => {
    e.preventDefault();
    if ((message.trim() || file) && receiverId) {
      let fileName = null;
      let fileType = "text";
      if (file) {
        const data = new FormData();
        const filename = Date.now() + file.name;
        data.append("name", filename);
        data.append("file", file);
        fileType = file.type.split("/")[0];
        try {
          const res = await axios.post("http://localhost:5000/api/upload", data);
          fileName = res.data;
        } catch (err) { console.log(err) }
      }
      try {
        await axios.post("http://localhost:5000/api/conversations", {
          senderId: currentUser._id,
          receiverId: receiverId,
        });
        getConversations();
      } catch (err) { }

      const msgData = {
        conversationId: [currentUser._id, receiverId].sort().join("-"),
        senderId: currentUser._id,
        sender: currentUser._id,
        receiverId: receiverId,
        text: message,
        fileType: fileType,
        fileName: fileName,
        createdAt: new Date()
      };

      socket.current.emit("stopTyping", { senderId: currentUser._id, receiverId });
      socket.current.emit("sendMessage", msgData);

      try {
        const res = await axios.post("http://localhost:5000/api/messages", msgData);
        setMessages((prev) => [...prev, res.data]);
      } catch (err) { }

      setMessage("");
      setFile(null);
    }
  };

  useEffect(() => { scrollRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages, isTyping]);

  return (
    <div style={{ display: "flex", height: "100vh", backgroundColor: "#f0f2f5", fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif" }}>
      
      {/* --- Sidebar (Conversations) --- */}
      <div style={{ width: "400px", borderRight: "1px solid #d1d7db", background: "#fff", display: "flex", flexDirection: "column" }}>
        <header style={{ padding: "15px 20px", background: "#f0f2f5", borderBottom: "1px solid #ddd", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div style={{ width: "40px", height: "40px", borderRadius: "50%", background: "#ccc", display: "flex", justifyContent: "center", alignItems: "center", fontWeight: "bold" }}>
            {currentUser?.username?.charAt(0).toUpperCase()}
          </div>
          <h3 style={{ margin: 0, fontSize: "18px" }}>Chats</h3>
        </header>
        <div style={{ flex: 1, overflowY: "auto" }}>
          {conversations.map((c) => (
            <ConversationItem 
              key={c._id} conversation={c} currentUser={currentUser} 
              active={receiverId === c.members.find(m => m !== currentUser._id)}
              onClick={(id, name) => navigate(`/chat?receiverId=${id}&name=${name}`)}
            />
          ))}
        </div>
      </div>

      {/* --- Chat Window --- */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", background: "#e5ddd5 url('https://user-images.githubusercontent.com/15075759/28719144-86dc0f70-73b1-11e7-911d-60d70fcded21.png')" }}>
        
        {/* Chat Header */}
        <header style={{ padding: "10px 20px", background: "#f0f2f5", borderBottom: "1px solid #ddd", display: "flex", alignItems: "center", gap: "15px", zIndex: 10 }}>
          <div style={{ width: "45px", height: "45px", borderRadius: "50%", background: "#0095f6", color: "#fff", display: "flex", justifyContent: "center", alignItems: "center", fontWeight: "bold", fontSize: "18px" }}>
            {receiverNameFromUrl.charAt(0).toUpperCase()}
          </div>
          <div>
            <h3 style={{ margin: 0, fontSize: "16px" }}>{receiverNameFromUrl}</h3>
            {isTyping ? <small style={{ color: "#25d366", fontWeight: "600" }}>typing...</small> : <small style={{ color: "#667781" }}>online</small>}
          </div>
        </header>

        {/* Message Window */}
        <div style={{ flex: 1, overflowY: "auto", padding: "20px 40px", display: "flex", flexDirection: "column", gap: "5px" }}>
          {messages.map((m, i) => {
            const isOwn = (m.senderId === currentUser._id || m.sender === currentUser._id);
            return (
              <div key={i} style={{ alignSelf: isOwn ? "flex-end" : "flex-start", maxWidth: "60%", marginBottom: "5px", display: "flex", flexDirection: "column" }}>
                <div style={{ 
                  padding: m.fileType === "image" ? "5px" : "8px 12px", 
                  borderRadius: "10px", 
                  backgroundColor: isOwn ? "#dcf8c6" : "#ffffff", 
                  boxShadow: "0 1px 1px rgba(0,0,0,0.1)",
                  position: "relative"
                }}>
                  {/* Image/Video Container */}
                  {m.fileType === "image" && (
                    <img src={`http://localhost:5000/images/${m.fileName}`} alt="" style={{ maxWidth: "100%", borderRadius: "8px", display: "block" }} />
                  )}
                  {m.fileType === "video" && (
                    <video controls style={{ maxWidth: "100%", borderRadius: "8px" }}>
                      <source src={`http://localhost:5000/images/${m.fileName}`} />
                    </video>
                  )}

                  {/* Text Message */}
                  {m.text && <div style={{ padding: m.fileType === "image" ? "5px 8px" : "0", fontSize: "14.5px", color: "#111" }}>{m.text}</div>}
                  
                  {/* Time Stamp */}
                  <div style={{ textAlign: "right", fontSize: "10px", color: "#667781", marginTop: "2px" }}>
                    {new Date(m.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </div>
                </div>
              </div>
            );
          })}
          <div ref={scrollRef} />
        </div>

        {/* --- Image Preview Section (Attractive Method) --- */}
        {file && (
          <div style={{ padding: "10px 20px", background: "#f0f2f5", borderTop: "1px solid #ddd", display: "flex", alignItems: "center", gap: "15px" }}>
             <div style={{ position: "relative" }}>
                {file.type.startsWith("image") ? (
                   <img src={URL.createObjectURL(file)} alt="preview" style={{ width: "60px", height: "60px", borderRadius: "8px", objectFit: "cover" }} />
                ) : (
                   <div style={{ width: "60px", height: "60px", background: "#0095f6", color: "#fff", borderRadius: "8px", display: "flex", justifyContent: "center", alignItems: "center", fontSize: "10px" }}>Video</div>
                )}
                <span onClick={() => setFile(null)} style={{ position: "absolute", top: "-10px", right: "-10px", background: "red", color: "white", borderRadius: "50%", width: "20px", height: "20px", display: "flex", justifyContent: "center", alignItems: "center", fontSize: "12px", cursor: "pointer" }}>×</span>
             </div>
             <div style={{ fontSize: "14px", color: "#666" }}>Ready to send: {file.name}</div>
          </div>
        )}

        {/* Message Input Footer */}
        <form onSubmit={handleSend} style={{ padding: "10px 15px", display: "flex", alignItems: "center", background: "#f0f2f5", gap: "12px" }}>
          <label htmlFor="file" style={{ cursor: "pointer", padding: "8px" }}>
             <span style={{ fontSize: "24px", color: "#54656f" }}>📎</span>
          </label>
          <input type="file" id="file" style={{ display: "none" }} onChange={(e) => setFile(e.target.files[0])} />
          
          <input 
            style={{ flex: 1, padding: "12px 15px", borderRadius: "8px", border: "none", outline: "none", fontSize: "15px" }} 
            type="text" 
            value={message} 
            onChange={handleTyping} 
            placeholder="Type a message..." 
          />
          
          <button type="submit" style={{ border: "none", background: "transparent", cursor: "pointer", padding: "5px" }}>
            <div style={{ background: "#00a884", color: "#fff", width: "40px", height: "40px", borderRadius: "50%", display: "flex", justifyContent: "center", alignItems: "center", fontSize: "20px" }}>
               ➤
            </div>
          </button>
        </form>
      </div>
    </div>
  );
};

// --- ConversationItem Component ---
const ConversationItem = ({ conversation, currentUser, onClick, active }) => {
  const [user, setUser] = useState(null);
  const otherId = conversation.members.find(m => m !== currentUser._id);
  useEffect(() => {
    const getUser = async () => {
      try { const res = await axios.get(`http://localhost:5000/api/auth/user/${otherId}`); setUser(res.data); } catch (err) { }
    };
    if(otherId) getUser();
  }, [otherId]);

  return (
    <div onClick={() => onClick(otherId, user?.username)} style={{ padding: "12px 15px", cursor: "pointer", background: active ? "#f0f2f5" : "transparent", display: "flex", alignItems: "center", transition: "0.2s" }}>
      <div style={{ width: "50px", height: "50px", borderRadius: "50%", background: "#0095f6", color: "white", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: "bold", fontSize: "20px", marginRight: "15px" }}>
        {user?.username?.charAt(0).toUpperCase()}
      </div>
      <div style={{ flex: 1, borderBottom: "1px solid #f0f2f5", paddingBottom: "10px" }}>
        <div style={{ display: "flex", justifyContent: "space-between" }}>
           <span style={{ fontWeight: "600", color: "#111" }}>{user?.username || "Loading..."}</span>
           <span style={{ fontSize: "12px", color: "#667781" }}>9:32 PM</span>
        </div>
        <div style={{ fontSize: "13px", color: "#667781", marginTop: "2px" }}>Click to start chat</div>
      </div>
    </div>
  );
};

export default Chat;