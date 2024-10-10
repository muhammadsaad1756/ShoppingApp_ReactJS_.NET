import React, { useState, useEffect } from "react";
import axios from "axios";
import "./ShoppingCart.css";

const ShoppingCart = () => {
  const [cartItems, setCartItems] = useState([]);

  useEffect(() => {
    const fetchCartItems = async () => {
      const response = await axios.get(
        "http://localhost:5111/api/Buyer/shopping-cart"
      );
      setCartItems(response.data);
    };
    fetchCartItems();
  }, []);

  return (
    <div className="cart-container">
      <h2>Your Cart</h2>
      <div className="cart-items">
        {cartItems.map((item) => (
          <div className="cart-item" key={item.id}>
            <h3>{item.itemName}</h3>
            <p>Quantity: {item.quantity}</p>
            <p>Total Price: ${item.totalPrice}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ShoppingCart;
