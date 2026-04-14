import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  // 🔐 Login handler
  const handleLogin = (e) => {
    e.preventDefault();

    // simple validation (optional but good)
    if (!email.trim()) {
      alert("Please enter email");
      return;
    }

    // ✅ FIXED KEY (IMPORTANT)
    localStorage.setItem("netfix_user", email.trim());

    navigate("/");
  };

  // 👤 Guest login
  const handleGuest = () => {
    localStorage.setItem("netfix_user", "guest");
    navigate("/");
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#000",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backgroundImage:
          "url(https://assets.nflxext.com/ffe/siteui/vlv3imgselect/ba8be7a1-f521-4a2c-9b63-e5fdb3edb3f3/IN-en-20231009-popsignuptwoweeks-perspective_alpha_website_large.jpg)",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      {/* Dark overlay */}
      <div
        style={{
          position: "fixed",
          inset: 0,
          background: "rgba(0,0,0,0.65)",
        }}
      />

      {/* Logo */}
      <div
        style={{
          position: "fixed",
          top: "24px",
          left: "40px",
          color: "#E50914",
          fontSize: "36px",
          fontWeight: "900",
          zIndex: 10,
        }}
      >
        NETFIX
      </div>

      {/* Login Card */}
      <div
        style={{
          position: "relative",
          background: "rgba(0,0,0,0.85)",
          borderRadius: "8px",
          padding: "48px",
          width: "380px",
          backdropFilter: "blur(10px)",
        }}
      >
        <h2
          style={{
            color: "#fff",
            fontSize: "28px",
            fontWeight: "700",
            marginBottom: "28px",
          }}
        >
          Sign In
        </h2>

        <form onSubmit={handleLogin}>
          <input
            type="email"
            placeholder="Email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={inputStyle}
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={{ ...inputStyle, marginTop: "16px" }}
          />

          <button type="submit" style={btnRed}>
            Sign In
          </button>
        </form>

        {/* Divider */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            margin: "20px 0",
            gap: "10px",
          }}
        >
          <div style={{ flex: 1, height: "1px", background: "#444" }} />
          <span style={{ color: "#888", fontSize: "13px" }}>OR</span>
          <div style={{ flex: 1, height: "1px", background: "#444" }} />
        </div>

        <button onClick={handleGuest} style={btnGray}>
          Continue as Guest
        </button>

        <p
          style={{
            color: "#888",
            fontSize: "12px",
            marginTop: "24px",
            textAlign: "center",
          }}
        >
          No account needed — just explore!
        </p>
      </div>
    </div>
  );
};

// 🎨 Styles
const inputStyle = {
  width: "100%",
  padding: "14px 16px",
  background: "#333",
  border: "none",
  borderRadius: "4px",
  color: "#fff",
  fontSize: "15px",
  outline: "none",
  boxSizing: "border-box",
};

const btnRed = {
  width: "100%",
  padding: "14px",
  background: "#E50914",
  color: "#fff",
  border: "none",
  borderRadius: "4px",
  fontSize: "16px",
  fontWeight: "700",
  cursor: "pointer",
  marginTop: "24px",
};

const btnGray = {
  width: "100%",
  padding: "14px",
  background: "rgba(255,255,255,0.1)",
  color: "#fff",
  border: "1px solid #555",
  borderRadius: "4px",
  fontSize: "16px",
  cursor: "pointer",
};

export default Login;