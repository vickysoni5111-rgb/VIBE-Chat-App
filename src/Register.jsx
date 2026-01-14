import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom"; // useNavigate add kiya
import axios from "axios"; // axios import kiya
import "./Register.css";

const Register = () => {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    phoneNumber: "", // Backend key 'phoneNumber' hai
    password: "",
  });

  const navigate = useNavigate(); // Navigation ke liye

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Backend ko data bhej rahe hain
      const res = await axios.post("http://localhost:5000/api/auth/register", formData);
      
      if (res.status === 200) {
        // Success Message
        alert("Your registration is successful!");
        // Direct Login page par bhejna
        navigate("/login");
      }
    } catch (err) {
      // Error message dikhana (jaise user already exists)
      alert(err.response?.data?.message || "Registration failed!");
    }
  };

  return (
    <div className="register-page">
      <div className="register-box">
        <h2>Create Account</h2>

        <form onSubmit={handleSubmit}>
          <label>Username</label>
          <input
            type="text"
            name="username"
            placeholder="Enter username"
            onChange={handleChange}
            required
          />

          <label>Email</label>
          <input
            type="email"
            name="email"
            placeholder="Enter email"
            onChange={handleChange}
            required
          />

          <label>Phone</label>
          <input
            type="text"
            name="phoneNumber" // Name backend model ke hisaab se
            placeholder="Enter phone number"
            onChange={handleChange}
            required
          />

          <label>Password</label>
          <input
            type="password"
            name="password"
            placeholder="Enter password"
            onChange={handleChange}
            required
          />

          <button type="submit">Register</button>
        </form>

        <p>
          Already have an account? <Link to="/login">Login</Link>
        </p>
      </div>
    </div>
  );
};

export default Register;