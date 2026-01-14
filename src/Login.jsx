

  import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';

const Login = () => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("http://localhost:5000/api/auth/login", {
        email: formData.email,
        password: formData.password
      });
      if (res.status === 200) {
        localStorage.setItem("user", JSON.stringify(res.data));
        navigate("/");
      }
    } catch (err) {
      alert(err.response?.data?.message || "Login Failed");
    }
  };

  return (
    <div style={{ height: "100vh", display: "flex", justifyContent: "center", alignItems: "center", background: "#f8fafd", fontFamily: "'Inter', sans-serif" }}>
      <div style={{ width: "100%", maxWidth: "400px", padding: "40px", background: "#fff", borderRadius: "30px", boxShadow: "0 15px 35px rgba(0,0,0,0.05)", textAlign: "center", border: "1px solid #f0f3f6" }}>
        <div style={{ background: "#007bff", width: "60px", height: "60px", borderRadius: "20px", display: "flex", justifyContent: "center", alignItems: "center", color: "#fff", margin: "0 auto 20px" }}>
          <span style={{fontSize: "30px", fontWeight: "900"}}>V</span>
        </div>
        <h1 style={{ fontWeight: "900", marginBottom: "10px", fontSize: "28px" }}>Welcome Back</h1>
        <p style={{ color: "#a0aec0", marginBottom: "30px" }}>Sign in to continue the VIBE</p>

        <form onSubmit={handleLogin} style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
          <input 
            style={{ padding: "15px 20px", borderRadius: "15px", border: "1px solid #edf2f7", outline: "none", background: "#f8fafd" }}
            type="email" name="email" placeholder="Email address" 
            value={formData.email} onChange={handleChange} required 
          />
          <input 
            style={{ padding: "15px 20px", borderRadius: "15px", border: "1px solid #edf2f7", outline: "none", background: "#f8fafd" }}
            type="password" name="password" placeholder="Password" 
            value={formData.password} onChange={handleChange} required 
          />
          <button type="submit" style={{ padding: "15px", borderRadius: "15px", border: "none", background: "#007bff", color: "#fff", fontWeight: "800", cursor: "pointer", boxShadow: "0 10px 20px rgba(0,123,255,0.2)", marginTop: "10px" }}>
            Log In
          </button>
        </form>

        <p style={{ marginTop: "30px", fontSize: "14px", color: "#718096" }}>
          Don't have an account? <Link to="/register" style={{ color: "#007bff", fontWeight: "700", textDecoration: "none" }}>Sign up</Link>
        </p>
      </div>
    </div>
  );
};
export default Login;