import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import "./AllItemsReport.css";
import "bootstrap/dist/css/bootstrap.min.css";

const AllItemsReport = () => {
  const [items, setItems] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    // Fetch all items initially
    fetchItems();
  }, []);

  const fetchItems = (searchTerm = "") => {
    axios
      .get(
        `http://localhost:5111/api/Buyer/all-items-report?searchTerm=${searchTerm}`
      )
      .then((response) => setItems(response.data))
      .catch((error) => console.log("Error fetching items: ", error));
  };

  // Search form submit handler
  const handleSearch = (e) => {
    e.preventDefault(); // Prevent form from reloading the page
    fetchItems(searchTerm); // Fetch items based on the search term
  };

  // Clear search functionality
  const handleClearSearch = () => {
    setSearchTerm(""); // Clear the search term input
    fetchItems(); // Fetch all items again
  };

  const handleLogout = () => {
    if (window.confirm("Do you want to logout?")) {
      localStorage.removeItem("token"); // Remove token from localStorage
      window.location.href = "/login"; // Redirect to login page
    }
  };

  return (
    <div className="all-items-report-container">
      <div className="hero-section text-center p-4">
        <h2>Welcome For Shopping!</h2>
      </div>
      <button onClick={handleLogout} className="btn btn-danger logout-button">
        Logout
      </button>
      <div className="header-section">
        <h3>Items For Sale</h3>
        <form className="search-form" onSubmit={handleSearch}>
          <input
            type="text"
            placeholder="   Search..."
            className="form-control"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <button type="submit" className="btn search-button">
            Search
          </button>
          <button
            type="button"
            className="btn clear-button"
            onClick={handleClearSearch}
          >
            Clear Search
          </button>
        </form>
      </div>
      <div className="items-grid">
        {items.length > 0 ? (
          items.map((item) => (
            <div key={item.id} className="item-card">
              <h3>{item.name}</h3>
              <p className="price">Price: ${item.price}</p>
              <Link to={`/view-item/${item.id}`}>
                <button className="view-item-button">View Item</button>
              </Link>
            </div>
          ))
        ) : (
          <p className="mt-5 text-center">No items found</p>
        )}
      </div>
    </div>
  );
};

export default AllItemsReport;
