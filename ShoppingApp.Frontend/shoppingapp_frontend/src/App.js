import React from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import Login from "./Logins/Login";
import Register from "./Register/Register";
import AllItemsReport from "./Buyer/AllItemsReport";
import ViewItem from "./Buyer/ViewItem";
import CheckOut from "./Buyer/CheckOut";
import ShoppingCart from "./Buyer/ShoppingCart";
import SellerHomePage from "./Sellers/SellerHomePage";
import AddEditItem from "./Sellers/AddEditItem";
import { useAuth } from "./Context/AuthContext";

// PrivateRoute Component to protect certain routes
const PrivateRoute = ({ children }) => {
  const token = localStorage.getItem("token");
  return token ? children : <Navigate to="/login" />;
};

const App = () => {
  const { user } = useAuth();

  return (
    <Router>
      <Routes>
        {/* Public routes for Login and Register */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/edit-user" element={<Register existingUser={user} />} />

        {/* Protected routes for Sellers */}
        <Route
          path="/sellers-dashboard"
          element={
            <PrivateRoute>
              <SellerHomePage />
            </PrivateRoute>
          }
        />
        <Route
          path="/add-edit-item"
          element={
            <PrivateRoute>
              <AddEditItem />
            </PrivateRoute>
          }
        />

        {/* Protected routes for Buyers */}
        <Route
          path="/all-items"
          element={
            <PrivateRoute>
              <AllItemsReport />
            </PrivateRoute>
          }
        />
        <Route path="/checkout" element={<CheckOut />} />
        <Route
          path="/view-item/:id"
          element={
            <PrivateRoute>
              <ViewItem />
            </PrivateRoute>
          }
        />
        <Route
          path="/shopping-cart"
          element={
            <PrivateRoute>
              <ShoppingCart />
            </PrivateRoute>
          }
        />

        {/* Default route, redirect to All Items Report or Login */}
        <Route
          path="/"
          element={user ? <AllItemsReport /> : <Navigate to="/login" />}
        />
      </Routes>
    </Router>
  );
};

export default App;
