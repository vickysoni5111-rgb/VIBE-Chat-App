import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./home";
import Register from "./Register";
import Login from "./Login";
import Chat from "./Chat"; // 1. Chat ko import karein
import Account from "./Account";


function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        
        {/* 2. Ye line zaroor add karein */}
        <Route path="/chat" element={<Chat />} /> 
  
<Route path="/account" element={<Account />} />
      </Routes>
    </Router>
  );
}

export default App;