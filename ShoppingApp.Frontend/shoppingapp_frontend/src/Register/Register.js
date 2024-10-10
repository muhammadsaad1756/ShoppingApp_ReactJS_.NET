import React, { useState, useEffect } from "react";
import axios from "axios";
import "./Register.css";

const Register = ({ existingUser }) => {
  const [userDetails, setUserDetails] = useState({
    username: "",
    password: "",
    email: "",
  });

  useEffect(() => {
    // If user details are passed, populate the form
    if (existingUser) {
      setUserDetails({
        username: existingUser.username,
        password: existingUser.password,
        email: existingUser.email,
      });
    }
  }, [existingUser]);

  const handleChange = (e) => {
    setUserDetails({
      ...userDetails,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // API call to register or update user
      const response = await axios.post("/account/userdetails", userDetails);
      alert(response.data.message);
    } catch (error) {
      console.error("Error submitting form", error);
      alert("Failed to submit form. Please try again.");
    }
  };

  return (
    <div className="register-container">
      <h2>{existingUser ? "Edit User Details" : "Register New User"}</h2>
      <form onSubmit={handleSubmit} className="register-form">
        <label>
          Username:
          <input
            type="text"
            name="username"
            value={userDetails.username}
            onChange={handleChange}
            required
            readOnly={!!existingUser} // Disable username input for editing
          />
        </label>
        <label>
          Password:
          <input
            type="password"
            name="password"
            value={userDetails.password}
            onChange={handleChange}
            required
          />
        </label>
        <label>
          Email:
          <input
            type="email"
            name="email"
            value={userDetails.email}
            onChange={handleChange}
            required
          />
        </label>
        <button type="submit" className="submit-btn">
          {existingUser ? "Update Details" : "Register"}
        </button>
      </form>
    </div>
  );
};

export default Register;
