

import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { 
  faHouse, faMessage, faUser, faThumbsUp, 
  faComment, faRightToBracket, faUserPlus, faRightFromBracket 
} from "@fortawesome/free-solid-svg-icons";

const Home = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const user = JSON.parse(localStorage.getItem("user"));
  const [dbPosts, setDbPosts] = useState([]);
  const [commentInput, setCommentInput] = useState({});

  // --- APKA ORIGINAL WORKING LOGIC ---
  const fetchPosts = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/posts/all");
      if (res.ok) setDbPosts(await res.json());
    } catch (err) { console.log(err); }
  };

  useEffect(() => { fetchPosts(); }, []);

  const handleLike = async (postId, postOwner) => {
    if (!user) return alert("Please Login!");
    try {
      const res = await fetch(`http://localhost:5000/api/posts/${postId}/like`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: user._id }),
      });
      if (res.ok) { fetchPosts(); }
    } catch (err) { console.log(err); }
  };

  const handleComment = async (postId, postOwner) => {
    if (!commentInput[postId] || !user) return;
    try {
      const res = await fetch(`http://localhost:5000/api/posts/${postId}/comment`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: user.username, text: commentInput[postId] }),
      });
      if (res.ok) {
        setCommentInput({ ...commentInput, [postId]: "" });
        fetchPosts();
      }
    } catch (err) { console.log(err); }
  };

  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/login");
  };

  // Modern Nav Item Style (For scannable look)
  const navItemStyle = (path) => ({
    display: "flex", flexDirection: "column", alignItems: "center", cursor: "pointer",
    padding: "8px 15px", color: location.pathname === path ? "#007bff" : "#555",
    borderBottom: location.pathname === path ? "4px solid #007bff" : "4px solid transparent",
    transition: "0.3s all ease", fontSize: "12px", fontWeight: "700", gap: "4px"
  });

  return (
    <div style={{ backgroundColor: "#f8fafd", minHeight: "100vh", fontFamily: "'Inter', sans-serif" }}>
      
      {/* --- VIBE TOP NAVBAR (Jaisa pehle diya tha) --- */}
      <header style={{ 
        height: "90px", backgroundColor: "#fff", display: "flex", alignItems: "center", 
        justifyContent: "space-between", padding: "0 6%", position: "sticky", top: 0, 
        zIndex: 1000, boxShadow: "0 2px 15px rgba(0,0,0,0.05)" 
      }}>
        <div onClick={() => navigate("/")} style={{ cursor: "pointer", display: "flex", alignItems: "center", gap: "12px" }}>
          <div style={{ background: "linear-gradient(135deg, #007bff, #0056b3)", width: "45px", height: "45px", borderRadius: "12px", display: "flex", justifyContent: "center", alignItems: "center", color: "#fff" }}>
            <FontAwesomeIcon icon={faMessage} size="lg" />
          </div>
          <h1 style={{ fontSize: "26px", margin: 0, fontWeight: "900", color: "#333", letterSpacing: "-1px" }}>VIBE</h1>
        </div>

        <nav style={{ display: "flex", gap: "5px", alignItems: "center" }}>
          <div onClick={() => navigate("/")} style={navItemStyle("/")}>
            <FontAwesomeIcon icon={faHouse} size="lg" />
            <span>Home</span>
          </div>
          
          <div onClick={() => navigate("/chat")} style={navItemStyle("/chat")}>
            <FontAwesomeIcon icon={faMessage} size="lg" />
            <span>Chat</span>
          </div>

          {!user ? (
            <>
              <div onClick={() => navigate("/login")} style={navItemStyle("/login")}>
                <FontAwesomeIcon icon={faRightToBracket} size="lg" />
                <span>Login</span>
              </div>
              <div onClick={() => navigate("/register")} style={navItemStyle("/register")}>
                <FontAwesomeIcon icon={faUserPlus} size="lg" />
                <span>Join</span>
              </div>
            </>
          ) : (
            <>
              <div onClick={() => navigate("/account")} style={navItemStyle("/account")}>
                <FontAwesomeIcon icon={faUser} size="lg" />
                <span>{user.username}</span>
              </div>
              <div onClick={handleLogout} style={navItemStyle("/logout")}>
                <FontAwesomeIcon icon={faRightFromBracket} size="lg" style={{color: "#e74c3c"}} />
                <span style={{color: "#e74c3c"}}>Exit</span>
              </div>
            </>
          )}
        </nav>
      </header>

      {/* --- CONTENT AREA (Aapki Image_8e7f7f jaisa look) --- */}
      <main style={{ padding: "30px 15px", display: "flex", justifyContent: "center" }}>
        <div style={{ width: "100%", maxWidth: "520px" }}>
          
          {dbPosts.map((post) => (
            <div key={post._id} style={{ 
              backgroundColor: "#fff", borderRadius: "20px", marginBottom: "30px", 
              border: "1px solid #f0f3f6", boxShadow: "0 10px 30px rgba(0,0,0,0.03)", overflow: "hidden" 
            }}>
              
              {/* Post Header */}
              <div style={{ padding: "15px 20px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                  <div style={{ width: "38px", height: "38px", borderRadius: "10px", background: "#edf2f7", display: "flex", justifyContent: "center", alignItems: "center", fontWeight: "800", color: "#007bff" }}>
                    {post.user?.charAt(0).toUpperCase()}
                  </div>
                  <span style={{ fontWeight: "700", fontSize: "15px" }}>{post.user}</span>
                </div>
                <button 
                  onClick={() => navigate(`/chat?receiverId=${post.userId}&name=${post.user}`)}
                  style={{ background: "#007bff", color: "#fff", border: "none", padding: "7px 15px", borderRadius: "10px", fontSize: "12px", fontWeight: "700", cursor: "pointer" }}
                >
                  Message
                </button>
              </div>

              {/* Image */}
              <img src={post.img} alt="" style={{ width: "100%", maxHeight: "500px", objectFit: "cover" }} />

              {/* Interaction Bar */}
              <div style={{ padding: "15px 20px 10px", display: "flex", gap: "20px" }}>
                <div onClick={() => handleLike(post._id, post.user)} style={{ cursor: "pointer", display: "flex", alignItems: "center", gap: "6px", color: post.likes?.includes(user?._id) ? "#007bff" : "#718096" }}>
                  <FontAwesomeIcon icon={faThumbsUp} size="lg" />
                  <span style={{ fontWeight: "700" }}>{post.likes?.length || 0}</span>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: "6px", color: "#718096" }}>
                  <FontAwesomeIcon icon={faComment} size="lg" />
                  <span style={{ fontWeight: "700" }}>{post.comments?.length || 0}</span>
                </div>
              </div>

              {/* Caption & Comments */}
              <div style={{ padding: "0 20px 20px" }}>
                <p style={{ margin: "5px 0 15px", fontSize: "14px" }}>
                  <span style={{ fontWeight: "800", marginRight: "8px" }}>{post.user}</span> {post.caption}
                </p>
                
                <div style={{ background: "#fcfdfe", borderRadius: "12px", padding: "10px" }}>
                  {post.comments?.map((c, i) => (
                    <p key={i} style={{ fontSize: "13px", margin: "4px 0" }}>
                      <span style={{ fontWeight: "700" }}>{c.username}</span> {c.text}
                    </p>
                  ))}
                  
                  <div style={{ display: "flex", marginTop: "10px", gap: "10px" }}>
                    <input 
                      type="text" placeholder="Add a comment..." 
                      value={commentInput[post._id] || ""}
                      onChange={(e) => setCommentInput({...commentInput, [post._id]: e.target.value})}
                      style={{ flex: 1, border: "1px solid #edf2f7", borderRadius: "8px", padding: "8px 12px", outline: "none", fontSize: "13px" }}
                    />
                    <button onClick={() => handleComment(post._id, post.user)} style={{ border: "none", background: "none", color: "#007bff", fontWeight: "800", cursor: "pointer" }}>Post</button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
};

export default Home;