import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Home from "./pages/Home";
import Category from "./pages/Category";
import Navbar from "./components/Navbar";
import "./App.css";

// 🔐 Auth guard
const ProtectedRoute = ({ children }) => {
  const user = localStorage.getItem("netfix_user"); // ✅ FIXED
  return user ? children : <Navigate to="/login" />;
};

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* Login route */}
        <Route path="/login" element={<Login />} />

        {/* Home */}
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Navbar />
              <Home />
            </ProtectedRoute>
          }
        />

        {/* Category */}
        <Route
          path="/category/:type"
          element={
            <ProtectedRoute>
              <Navbar />
              <Category />
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
};

export default App;