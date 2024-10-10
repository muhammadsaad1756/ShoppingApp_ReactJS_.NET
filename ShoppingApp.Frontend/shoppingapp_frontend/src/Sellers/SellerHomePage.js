import React, { useState, useEffect } from "react";
import axios from "axios";
import "./SellerHomePage.css";
import "bootstrap/dist/css/bootstrap.min.css";
import { Link, useNavigate } from "react-router-dom";

const SellerHomePage = () => {
  const [items, setItems] = useState([]);
  const navigate = useNavigate();

  const fetchItems = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        alert("You are not logged in. Redirecting to login.");
        window.location.href = "/login";
        return;
      }

      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      const response = await axios.get(
        "http://localhost:5111/api/SellersPage/user-homepage"
      );
      setItems(response.data);
    } catch (error) {
      console.error(
        "Error fetching items:",
        error.response?.data || error.message
      );
      alert(
        "Error fetching items: " +
          (error.response?.data?.message || error.message)
      );
    }
  };

  useEffect(() => {
    fetchItems(); // Fetch the items initially
  }, []);

  const handleLogout = async () => {
    delete axios.defaults.headers.common["Authorization"];
    localStorage.removeItem("token");
    try {
      await axios.post("http://localhost:5111/api/Account/logout");
      window.location.href = "/login";
    } catch (error) {
      console.log("Logout failed: ", error);
    }
  };

  const handleEdit = (item) => {
    navigate("/add-edit-item", { state: { item } });
  };

  return (
    <div className="container seller-home-container">
      <div className="hero-section text-center p-4">
        <h2>Welcome, Seller!</h2>
        <p>Manage your items below</p>
      </div>
      <button onClick={handleLogout} className="btn btn-danger logout-button">
        Logout
      </button>
      <h3>Items For Sale</h3>

      {items.length ? (
        <div className="row mt-4">
          {items.map((item) => (
            <div className="col-lg-4 col-md-6 mb-4" key={item.id}>
              <div className="card h-100">
                <div className="card-body">
                  <div className="d-flex justify-content-between align-items-center">
                    <h4 className="card-title">{item.name}</h4>
                    <button
                      className="btn btn-edit"
                      onClick={() => handleEdit(item)}
                    >
                      Edit
                    </button>
                  </div>
                  <p> {item.description}</p>
                  <span className="price">${item.price}</span>
                  <p>Quantity Available: {item.quantityAvailable}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p>No items available.</p>
      )}

      <div className="mt-5 text-center">
        <Link to="/add-edit-item">
          <button className="btn btn-primary">Add New Item</button>
        </Link>
      </div>
    </div>
  );
};

export default SellerHomePage;
