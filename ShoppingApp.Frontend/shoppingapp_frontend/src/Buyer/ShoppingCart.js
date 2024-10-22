import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom"; // Import useNavigate
import axios from "axios";
import "./ShoppingCart.css";

const ShoppingCart = () => {
  const [cartItems, setCartItems] = useState([]);
  const navigate = useNavigate(); // Initialize useNavigate

  useEffect(() => {
    const fetchCartItems = async () => {
      const response = await axios.get(
        "http://localhost:5111/api/Buyer/shopping-cart"
      );
      setCartItems(response.data);
    };
    fetchCartItems();
  }, []);

  // Calculate total price
  const totalPrice = cartItems.reduce(
    (total, item) => total + item.totalPrice,
    0
  );

  return (
    <div className="cart-container">
      <button
        className="back-button"
        onClick={() => navigate("/all-items")} // Navigate back to All Items Report page
      >
        Back to Shopping
      </button>

      <h2>Your Shopping Cart</h2>
      <table className="cart-table">
        <thead>
          <tr>
            <th>Item Name</th>
            <th>Price</th>
            <th>Quantity</th>
            <th>Total Price</th>
          </tr>
        </thead>
        <tbody>
          {cartItems.length > 0 ? (
            cartItems.map((item) => (
              <tr className="cart-item" key={item.id}>
                <td>{item.item.name}</td>
                <td>${item.item.price.toFixed(2)}</td>
                <td>{item.quantity}</td>
                <td>${item.totalPrice.toFixed(2)}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="4" className="empty-cart">
                Your cart is empty.
              </td>
            </tr>
          )}
        </tbody>
      </table>

      <div className="total-price-container">
        <h3>Total Price: ${totalPrice.toFixed(2)}</h3>
        <div className="button-container">
          <button
            className="checkout-button"
            onClick={() => navigate("/checkout")} // Navigate to Checkout page
          >
            Proceed To Checkout
          </button>
        </div>
      </div>
    </div>
  );
};

export default ShoppingCart;
