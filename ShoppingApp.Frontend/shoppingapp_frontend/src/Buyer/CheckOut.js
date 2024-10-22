import React from "react";
import { useNavigate } from "react-router-dom";

const CheckOut = () => {
  const navigate = useNavigate(); // Initialize the navigate function

  const styles = {
    container: {
      display: "flex",
      flexDirection: "column",
      //justifyContent: "center",
      alignItems: "center",
      height: "100vh",
      backgroundColor: "#f9f9f9",
      fontFamily: "Arial, sans-serif",
      color: "#343a40",
      fontSize: "1.5rem",
      fontWeight: "bold",
      marginTop: "40px",
    },
    button: {
      backgroundColor: "#007bff",
      color: "white",
      border: "none",
      borderRadius: "5px",
      padding: "10px 20px",
      fontSize: "1rem",
      cursor: "pointer",
      marginTop: "20px",
      display: "flex",
      alignItems: "center",
      width: "26%",
      marginright: "684px",
    },
    backArrow: {
      marginRight: "8px",
    },
  };

  return (
    <div style={styles.container}>
      <button
        style={styles.button}
        onClick={() => navigate("/shopping-cart")} // Navigate back to ShoppingCart
      >
        <span style={styles.backArrow}>←</span> {/* Back arrow icon */}
        Back to Shopping Cart
      </button>
      <span>CheckOut Functionality Not implemented yet!</span>
    </div>
  );
};

export default CheckOut;
