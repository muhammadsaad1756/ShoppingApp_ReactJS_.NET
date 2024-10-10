import React, { useState, useEffect } from "react";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";
import "./AddEditItem.css";

const AddEditItem = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const item = location.state?.item;

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [quantity, setQuantity] = useState("");

  useEffect(() => {
    if (item) {
      setName(item.name);
      setDescription(item.description);
      setPrice(item.price);
      setQuantity(item.quantityAvailable);
    }
  }, [item]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = { name, description, price, quantityAvailable: quantity };

    try {
      if (item) {
        // Update existing item
        await axios.post("http://localhost:5111/api/SellersPage/AddEditItem", {
          ...data,
          id: item.id,
        });
        alert("Item updated successfully!");
      } else {
        // Add new item
        await axios.post(
          "http://localhost:5111/api/SellersPage/AddEditItem",
          data
        );
        alert("Item added successfully!");
      }
      // Navigate back to SellerHomePage after adding or updating the item
      navigate("/sellers-dashboard");
    } catch (error) {
      console.error(
        "Error adding/updating item:",
        error.response?.data || error.message
      );
      alert("Error: " + (error.response?.data?.message || error.message));
    }
  };

  return (
    <div className="add-edit-item-container">
      <form onSubmit={handleSubmit}>
        <h2>{item ? "Edit Item" : "Add New Item"}</h2>
        <input
          type="text"
          placeholder="Item Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          maxLength="100"
          required
        />
        <textarea
          placeholder="Item Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          maxLength="500"
          required
        />
        <input
          type="number"
          placeholder="Price"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          min="0.01"
          step="0.01"
          required
        />
        <input
          type="number"
          placeholder="Quantity Available"
          value={quantity}
          onChange={(e) => setQuantity(e.target.value)}
          min="1"
          required
        />
        <button type="submit">{item ? "Update" : "Add"}</button>
      </form>
    </div>
  );
};

export default AddEditItem;
