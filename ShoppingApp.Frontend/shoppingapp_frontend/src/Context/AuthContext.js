import React, { createContext, useContext, useState, useEffect } from "react";

// Create the Auth context
const AuthContext = createContext();

// Provider component
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null); // State for the user

  // Mock function to simulate fetching user data (replace with real API call)
  const fetchUserData = async () => {
    const userData = JSON.parse(localStorage.getItem("user")); // For demo purposes
    setUser(userData);
  };

  useEffect(() => {
    fetchUserData(); // Fetch user data on mount
  }, []);

  const login = (userData) => {
    setUser(userData);
    localStorage.setItem("user", JSON.stringify(userData)); // Store user in localStorage
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("user"); // Clear user data on logout
  };

  const editUserDetails = (updatedUser) => {
    setUser(updatedUser);
    localStorage.setItem("user", JSON.stringify(updatedUser)); // Update user in localStorage
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, editUserDetails }}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use the Auth context
export const useAuth = () => {
  return useContext(AuthContext);
};
