import React, { useState } from "react";
import axios from "axios";
import { useAuth } from "../Context/AuthContext";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode"; // Corrected import

import "./Login.css";

const Login = () => {
  const { login } = useAuth();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(
        "http://localhost:5111/api/Account/login",
        {
          userName: username,
          password: password,
        },
        {
          headers: {
            "Content-type": "application/json",
            Accept: "application/json",
          },
        }
      );
      console.log(response.data);

      const token = response.data.token;
      const decodedToken = jwtDecode(token);

      const userData = {
        username,
        token,
        role:
          decodedToken.role ||
          decodedToken[
            "http://schemas.microsoft.com/ws/2008/06/identity/claims/role"
          ],
      };

      login(userData);
      localStorage.setItem("token", token); // Store token in localStorage
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`; // Set default Authorization header

      // Redirect based on user role
      if (userData.role.toLowerCase() === "seller") {
        navigate("/sellers-dashboard");
      } else if (userData.role.toLowerCase() === "buyer") {
        navigate("/all-items");
      } else {
        alert("Invalid role.");
      }
    } catch (error) {
      if (error.response && error.response.status === 400) {
        alert("Bad request. Check your input.");
      } else if (error.response && error.response.status === 401) {
        alert("Invalid login credentials.");
      } else {
        alert("An error occurred. Please try again.");
      }
    }
  };

  return (
    <div className="login-container">
      <div className="login-form">
        <h2>Login</h2>
        <form onSubmit={handleLogin}>
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button type="submit">Login</button>
        </form>
        <p>Don’t have an account?</p>
        <a href="/register" className="register-link">
          Register
        </a>
      </div>
    </div>
  );
};

export default Login;
