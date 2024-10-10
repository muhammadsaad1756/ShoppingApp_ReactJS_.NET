import React, { useState } from "react";
import axios from "axios";
import { useAuth } from "../Context/AuthContext";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode"; // Correct import for jwt-decode

import "./Login.css";

const Login = () => {
  const { login } = useAuth();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    console.log({ username, password });

    try {
      // Step 1: Make a POST request to the login endpoint with user credentials
      const response = await axios.post(
        "http://localhost:5111/api/Account/login",
        {
          userName: username,
          password: password,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      // Step 2: Get the token from the response and decode it to extract role
      const token = response.data.token;
      const decodedToken = jwtDecode(token);

      // Debugging: Check what the decoded token contains
      console.log("Decoded Token: ", decodedToken);

      // Step 3: Extract role from the decoded token
      const userData = {
        username,
        token,
        role:
          decodedToken.role ||
          decodedToken[
            "http://schemas.microsoft.com/ws/2008/06/identity/claims/role"
          ], // Fallback to common role claim
      };

      console.log("Role = ", userData.role);

      // Step 4: Login the user and store token and role
      login(userData);
      localStorage.setItem("token", token); // Store token in localStorage

      // Step 5: Set Authorization token globally for Axios
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;

      // Step 6: Redirect based on the user role
      if (userData.role.toLowerCase() === "seller") {
        navigate("/sellers-dashboard");
      } else if (userData.role.toLowerCase() === "buyer") {
        navigate("/all-items");
      } else {
        alert("Invalid role. Please contact support.");
      }
    } catch (error) {
      if (error.response && error.response.status === 400) {
        alert("Bad request. Check your input.");
      } else if (error.response && error.response.status === 401) {
        alert("Invalid login credentials.");
      } else {
        alert("An error occurred. Please try again.");
      }
      console.error("Login error: ", error);
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
