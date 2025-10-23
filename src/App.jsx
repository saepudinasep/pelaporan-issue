import { useState, useEffect } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import ResetPassword from "./pages/ResetPassword";
import ForgotPassword from "./pages/ForgotPassword";
import Dashboard from "./pages/Dashboard";
import MainLayout from "./layouts/MainLayout";
import ProtectedRoute from "./components/ProtectedRoute";

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(
    localStorage.getItem("loggedIn") === "true"
  );
  const [userData, setUserData] = useState(
    JSON.parse(localStorage.getItem("userData")) || null
  );

  // Pastikan state sinkron dengan localStorage
  useEffect(() => {
    if (isLoggedIn) {
      localStorage.setItem("loggedIn", "true");
      if (userData) localStorage.setItem("userData", JSON.stringify(userData));
    } else {
      localStorage.removeItem("loggedIn");
      localStorage.removeItem("userData");
    }
  }, [isLoggedIn, userData]);

  return (
    <Routes>
      <Route
        path="/"
        element={
          isLoggedIn ? <Navigate to="/dashboard" /> : <Navigate to="/login" />
        }
      />

      <Route
        path="/login"
        element={<Login setIsLoggedIn={setIsLoggedIn} setUserData={setUserData} />}
      />

      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password" element={<ResetPassword />} />

      <Route
        path="/dashboard/*"
        element={
          <ProtectedRoute>
            <MainLayout
              userData={userData}
              setIsLoggedIn={setIsLoggedIn}
              setUserData={setUserData}
            />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}
