


import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash, faCloudArrowUp, faUserCircle, faSignOutAlt } from "@fortawesome/free-solid-svg-icons";

const Account = () => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));
  const [file, setFile] = useState(null);
  const [myPosts, setMyPosts] = useState([]);

  const fetchMyPosts = async () => {
    const res = await fetch("http://localhost:5000/api/posts/all");
    if (res.ok) {
      const data = await res.json();
      setMyPosts(data.filter((p) => p.userId === user?._id));
    }
  };

  useEffect(() => { if (user) fetchMyPosts(); }, [user]);

  const handleDelete = async (postId) => {
    if (window.confirm("Delete permanently?")) {
      await fetch(`http://localhost:5000/api/posts/${postId}`, { method: "DELETE" });
      fetchMyPosts();
    }
  };

  const handleUpload = async () => {
    if (!file) return;
    const data = new FormData();
    data.append("file", file);
    const uploadRes = await fetch("http://localhost:5000/api/upload", { method: "POST", body: data });
    const fileName = await uploadRes.json();
    
    await fetch("http://localhost:5000/api/posts/create", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        user: user.username,
        userId: user._id,
        img: `http://localhost:5000/images/${fileName}`,
        caption: prompt("Caption:"),
      }),
    });
    fetchMyPosts();
    setFile(null);
  };

  return (
    <div style={{ backgroundColor: "#f8fafd", minHeight: "100vh", paddingBottom: "40px", fontFamily: "'Inter', sans-serif" }}>
      {/* Profile Header */}
      <div style={{ backgroundColor: "#fff", padding: "40px 20px", textAlign: "center", borderBottom: "1px solid #edf2f7" }}>
        <div style={{ position: "relative", display: "inline-block" }}>
          <div style={{ width: "110px", height: "110px", borderRadius: "35px", background: "linear-gradient(135deg, #007bff, #00d4ff)", color: "white", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "40px", margin: "auto", boxShadow: "0 10px 20px rgba(0,123,255,0.2)" }}>
            {user?.username?.charAt(0).toUpperCase()}
          </div>
        </div>
        
        <h2 style={{ marginTop: "15px", marginBottom: "5px", fontWeight: "800" }}>{user?.username}</h2>
        <p style={{ color: "#718096", fontSize: "14px" }}>{user?.email}</p>
        
        <button onClick={() => {localStorage.clear(); window.location.href="/login"}} style={{ marginTop: "15px", background: "#fff", color: "#e74c3c", border: "1px solid #ffcfcf", padding: "8px 25px", borderRadius: "12px", cursor: "pointer", fontWeight: "700", display: "inline-flex", alignItems: "center", gap: "8px" }}>
          <FontAwesomeIcon icon={faSignOutAlt} /> Logout
        </button>
      </div>

      <div style={{ maxWidth: "600px", margin: "auto", padding: "20px" }}>
        {/* Upload Section */}
        <div style={{ background: "#fff", padding: "20px", borderRadius: "20px", border: "1px solid #f0f3f6", marginBottom: "30px", boxShadow: "0 4px 15px rgba(0,0,0,0.02)" }}>
           <h4 style={{ margin: "0 0 15px 0", fontSize: "16px" }}>Create New Post</h4>
           <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
             <input type="file" onChange={(e) => setFile(e.target.files[0])} style={{ fontSize: "12px" }} />
             <button onClick={handleUpload} style={{ background: "#007bff", color: "white", border: "none", padding: "10px 20px", borderRadius: "12px", fontWeight: "700", cursor: "pointer", display: "flex", alignItems: "center", gap: "8px" }}>
               <FontAwesomeIcon icon={faCloudArrowUp} /> Post
             </button>
           </div>
        </div>

        {/* My Posts Grid-style */}
        <h3 style={{ fontSize: "18px", marginBottom: "20px", fontWeight: "800", color: "#2d3748" }}>My Vibes ({myPosts.length})</h3>
        <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: "25px" }}>
          {myPosts.map((post) => (
            <div key={post._id} style={{ background: "#fff", borderRadius: "20px", overflow: "hidden", border: "1px solid #f0f3f6", boxShadow: "0 10px 25px rgba(0,0,0,0.03)" }}>
              <div style={{ padding: "15px 20px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ fontWeight: "700", color: "#4a5568" }}>{new Date().toLocaleDateString()}</span>
                <FontAwesomeIcon icon={faTrash} onClick={() => handleDelete(post._id)} style={{ cursor: "pointer", color: "#e74c3c", fontSize: "18px" }} />
              </div>
              <img src={post.img} alt="" style={{ width: "100%", maxHeight: "400px", objectFit: "cover" }} />
              <div style={{ padding: "15px 20px" }}>
                <div style={{ display: "flex", gap: "15px", marginBottom: "10px", fontWeight: "700", color: "#718096", fontSize: "14px" }}>
                  <span>❤️ {post.likes?.length} likes</span>
                  <span>💬 {post.comments?.length} comments</span>
                </div>
                <p style={{ margin: 0, color: "#2d3748", lineHeight: "1.5" }}>{post.caption}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
export default Account;