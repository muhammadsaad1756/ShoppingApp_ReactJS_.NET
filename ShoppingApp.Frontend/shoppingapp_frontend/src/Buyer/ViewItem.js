import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom"; // Import useNavigate
import axios from "axios";
import "./ViewItem.css";

const ViewItem = () => {
  const { id } = useParams();
  const navigate = useNavigate(); // Initialize useNavigate
  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true); // Loading state
  const [selectedQuantity, setSelectedQuantity] = useState(1); // Quantity state
  const [message, setMessage] = useState(""); // Message state

  useEffect(() => {
    // Fetch the item details by ID from the backend
    axios
      .get(`http://localhost:5111/api/Buyer/view-item/${id}`)
      .then((response) => {
        setItem(response.data);
        setLoading(false); // Set loading to false once the data is fetched
      })
      .catch((error) => {
        console.log(error);
        setLoading(false); // Even if there's an error, stop loading
      });
  }, [id]);

  if (loading) {
    return <div className="loading">Loading...</div>; // Show loading indicator while fetching data
  }

  if (!item) {
    return <div className="error-message">Item not found</div>; // Show error if no item found
  }

  const handleAddToCart = () => {
    // Send a POST request to add the item to the cart
    axios
      .post("http://localhost:5111/api/Buyer/add-to-cart", {
        itemId: item.id,
        quantity: selectedQuantity,
      })
      .then((response) => {
        setMessage("Item added to cart successfully!"); // Set success message
        setTimeout(() => {
          // Redirect to shopping cart after 2 seconds
          navigate("/shopping-cart"); // Use navigate instead of history.push
        }, 1000);
      })
      .catch((error) => {
        console.error("Error adding to cart:", error);
      });
  };

  return (
    <div className="view-item-container">
      <h2 className="page-title">{item.name}</h2>
      <div className="item-details">
        <p>
          <strong>Price:</strong> ${item.price.toFixed(2)}
        </p>
        <p>
          <strong>Description:</strong> {item.description}
        </p>
        <p>
          <strong>Available Quantity:</strong> {item.quantityAvailable}
        </p>
      </div>
      <div className="quantity-selector">
        <label htmlFor="quantity">Select Quantity: </label>
        <select
          id="quantity"
          value={selectedQuantity}
          onChange={(e) => setSelectedQuantity(e.target.value)}
        >
          {[...Array(item.quantityAvailable)].map((_, index) => (
            <option key={index + 1} value={index + 1}>
              {index + 1}
            </option>
          ))}
        </select>
      </div>
      <button className="add-to-cart-button" onClick={handleAddToCart}>
        Add to Cart
      </button>
      {message && <div className="success-message">{message}</div>}{" "}
      {/* Display success message */}
    </div>
  );
};

export default ViewItem;
