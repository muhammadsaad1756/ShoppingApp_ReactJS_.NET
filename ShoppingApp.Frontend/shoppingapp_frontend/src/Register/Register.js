import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom"; // Import useNavigate for navigation
import "./Register.css";

const Register = ({ existingUser }) => {
  const [userDetails, setUserDetails] = useState({
    UserName: "", // Matches backend field
    PasswordHash: "", // Matches backend field
    Name: "",
    Age: "", // Optional field
    ProfilePictureUrl: "",
    Role: "buyer", // Default role, should match the backend ("buyer" or "seller")
  });

  const navigate = useNavigate(); // Initialize useNavigate for redirecting

  useEffect(() => {
    // If user details are passed, populate the form for editing
    if (existingUser) {
      setUserDetails({
        UserName: existingUser.userName,
        PasswordHash: "", // Keep password empty for security
        Name: existingUser.name,
        Age: existingUser.age,
        ProfilePictureUrl: existingUser.profilePictureUrl,
        Role: existingUser.role.toLowerCase(), // Ensure role is in lowercase
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
      const response = await axios.post(
        "http://localhost:5111/api/Account/UserDetails",
        {
          userName: userDetails.UserName, // Ensure this is a string
          passwordHash: userDetails.PasswordHash, // Ensure this is a string
          name: userDetails.Name,
          age: userDetails.Age ? parseInt(userDetails.Age) : null, // Ensure this is an integer or null
          profilePictureUrl: userDetails.ProfilePictureUrl,
          role: userDetails.Role.toLowerCase(), // Ensure this matches "buyer" or "seller"
        }
      );
      alert(response.data.message);
      navigate("/login"); // Redirect to the login page after successful registration
    } catch (error) {
      console.error("Error submitting form", error.response?.data.errors); // Log validation errors
      alert("Failed to submit form. Please check your input.");
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
            name="UserName" // Ensure this matches the backend field
            value={userDetails.UserName}
            onChange={handleChange}
            required
          />
        </label>
        <label>
          Password:
          <input
            type="password"
            name="PasswordHash" // Ensure this matches the backend field
            value={userDetails.PasswordHash}
            onChange={handleChange}
            required
            autoComplete="current-password" // Fix autocomplete warning
          />
        </label>
        <label>
          Name:
          <input
            type="text"
            name="Name"
            value={userDetails.Name}
            onChange={handleChange}
            required
          />
        </label>
        <label>
          Age:
          <input
            type="number"
            name="Age"
            value={userDetails.Age}
            onChange={handleChange}
          />
        </label>
        <label>
          Profile Picture URL:
          <input
            type="text"
            name="ProfilePictureUrl"
            value={userDetails.ProfilePictureUrl}
            onChange={handleChange}
          />
        </label>
        <label>
          Role:
          <select
            name="Role"
            value={userDetails.Role}
            onChange={handleChange}
            required
          >
            <option value="buyer">Buyer</option>
            <option value="seller">Seller</option>
          </select>
        </label>
        <button type="submit" className="submit-btn">
          {existingUser ? "Update Details" : "Register"}
        </button>
      </form>
    </div>
  );
};

export default Register;
