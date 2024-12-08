import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { CartProvider } from "./context/CartContext";
import Login from "./components/Login";
import Register from "./components/Register";
import UserDashboard from "./components/UserDashboard";
import AddProduct from "./components/AddProduct";
import AdminDashboard from "./components/AdminDashboard";
import Cart from "./components/Cart";
import Checkout from "./components/Checkout";

// JWT Utility function to check authentication status
const getToken = () => localStorage.getItem("token");

const isAdmin = (token) => {
  if (!token) return false;
  const payload = JSON.parse(atob(token.split(".")[1]));
  return payload?.role === "admin";
};

const isUser = (token) => {
  if (!token) return false;
  const payload = JSON.parse(atob(token.split(".")[1]));
  return payload?.role === "user";
};

const ProtectedRoute = ({ children, adminOnly }) => {
  const token = getToken();

  if (!token) {
    return <Navigate to="/login" />;
  }

  if (adminOnly && !isAdmin(token)) {
    return <Navigate to="/login" />;
  }

  if (!adminOnly && !isUser(token)) {
    return <Navigate to="/login" />;
  }

  return children;
};

const App = () => {
  const [isAuth, setIsAuth] = useState(!!getToken());

  useEffect(() => {
    const token = getToken();
    if (!token) {
      setIsAuth(false);
    } else {
      setIsAuth(true);
    }
  }, []);

  return (
    <div>
      <CartProvider>
        <Router>
          <Routes>
            
            <Route path="/" element={<Navigate to="/login" />} />

            
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            
            <Route
              path="/user-dashboard"
              element={
                <ProtectedRoute>
                  <UserDashboard />
                </ProtectedRoute>
              }
            />

            <Route
              path="/checkout"
              element={
                <ProtectedRoute>
                  <Checkout />
                </ProtectedRoute>
              }
            />

            <Route
              path="/admin-dashboard"
              element={
                <ProtectedRoute adminOnly={true}>
                  <AdminDashboard />
                </ProtectedRoute>
              }
            />

            <Route
              path="/add-product"
              element={
                <ProtectedRoute adminOnly={true}>
                  <AddProduct />
                </ProtectedRoute>
              }
            />

            <Route
              path="/cart"
              element={
                <ProtectedRoute>
                  <Cart />
                </ProtectedRoute>
              }
            />
          </Routes>
        </Router>
      </CartProvider>
    </div>
  );
};

export default App;
