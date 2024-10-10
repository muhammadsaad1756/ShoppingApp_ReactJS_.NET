import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import "./ViewItem.css";

const ViewItem = ({ addToCart }) => {
  const { id } = useParams();
  const [item, setItem] = useState(null);

  useEffect(() => {
    // Fetch the item details by ID from the backend
    axios
      .get(`/api/items/${id}`)
      .then((response) => setItem(response.data))
      .catch((error) => console.log(error));
  }, [id]);

  if (!item) {
    return <div>Loading...</div>;
  }

  return (
    <div className="view-item-container">
      <h2 className="page-title">{item.name}</h2>
      <div className="item-details">
        <p>
          <strong>Price:</strong> ${item.price}
        </p>
        <p>
          <strong>Description:</strong> {item.description}
        </p>
        <p>
          <strong>Quantity:</strong> {item.quantity}
        </p>
      </div>
      <button className="add-to-cart-button" onClick={() => addToCart(item)}>
        Add to Cart
      </button>
    </div>
  );
};

export default ViewItem;
