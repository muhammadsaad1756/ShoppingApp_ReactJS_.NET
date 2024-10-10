import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Login from "./Logins/Login"; // Adjust the path if necessary
import Register from "./Register/Register"; // Import the registration/editing component
import AllItemsReport from "./Buyer/AllItemsReport"; // Import the All Items Report component
import ViewItem from "./Buyer/ViewItem"; // Import the View Item component
import ShoppingCart from "./Buyer/ShoppingCart"; // Import the Shopping Cart component
import SellerHomePage from "./Sellers/SellerHomePage"; // Import Seller dashboard
import AddEditItem from "./Sellers/AddEditItem";
import { useAuth } from "./Context/AuthContext"; // Assuming you have an auth context to manage user state

const App = () => {
  const { user } = useAuth(); // Get user data from Auth context

  return (
    <Router>
      <Routes>
        {/* Login and Register routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Route for editing user profile */}
        <Route path="/edit-user" element={<Register existingUser={user} />} />

        {/* Seller's related routes  */}
        <Route path="/sellers-dashboard" element={<SellerHomePage />} />
        <Route path="/add-edit-item" element={<AddEditItem />} />

        {/* Buyer-related routes */}
        <Route path="/all-items" element={<AllItemsReport />} />
        <Route path="/view-item/:id" element={<ViewItem />} />
        <Route path="/shopping-cart" element={<ShoppingCart />} />

        {/* Redirect to All Items Report if logged in, else to Login */}
        <Route path="/" element={user ? <AllItemsReport /> : <Login />} />
      </Routes>
    </Router>
  );
};

export default App;
