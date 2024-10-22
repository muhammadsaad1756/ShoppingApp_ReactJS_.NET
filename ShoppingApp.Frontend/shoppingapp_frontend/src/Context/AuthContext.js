import React, { createContext, useContext, useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode";
import axios from "axios";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  const isTokenExpired = (token) => {
    if (!token) return true;
    const decodedToken = jwtDecode(token);
    return decodedToken.exp * 1000 < Date.now();
  };

  const getUserFromToken = (token) => {
    const decodedToken = jwtDecode(token);
    const role =
      decodedToken.role ||
      decodedToken[
        "http://schemas.microsoft.com/ws/2008/06/identity/claims/role"
      ];
    return { username: decodedToken.unique_name, role };
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token && !isTokenExpired(token)) {
      const userData = getUserFromToken(token);
      setUser(userData);
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    } else {
      logout();
    }
  }, []);

  const login = (userData) => {
    const { token } = userData;
    const userFromToken = getUserFromToken(token);

    localStorage.setItem("token", token);
    axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    setUser(userFromToken);
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("token");
    delete axios.defaults.headers.common["Authorization"];
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};
