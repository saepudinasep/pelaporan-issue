import { useState, useEffect } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import ResetPassword from "./pages/ResetPassword";
import ForgotPassword from "./pages/ForgotPassword";
import Dashboard from "./pages/Dashboard";
import MainLayout from "./layouts/MainLayout";
import ProtectedRoute from "./components/ProtectedRoute";

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);

  // Ambil data login dari localStorage setelah komponen mount
  useEffect(() => {
    const loggedIn = localStorage.getItem("loggedIn") === "true";
    const storedUser = JSON.parse(localStorage.getItem("userData"));
    if (loggedIn && storedUser) {
      setIsLoggedIn(true);
      setUserData(storedUser);
    }
    setLoading(false);
  }, []);

  // Sinkronisasi kembali ke localStorage jika user berubah
  useEffect(() => {
    if (isLoggedIn) {
      localStorage.setItem("loggedIn", "true");
      if (userData) localStorage.setItem("userData", JSON.stringify(userData));
    } else {
      localStorage.removeItem("loggedIn");
      localStorage.removeItem("userData");
    }
  }, [isLoggedIn, userData]);

  // Saat loading, jangan render apapun dulu (hindari redirect tiba-tiba)
  if (loading) return <div className="text-center mt-10">Loading...</div>;

  return (
    <Routes>
      {/* <Route
        path="/"
        element={
          isLoggedIn ? <Navigate to="/dashboard" /> : <Navigate to="/login" />
        }
      /> */}
      <Route
        path="/"
        element={
          isLoggedIn ? <Navigate to="/dashboard/ticket" /> : <Navigate to="/login" />
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
