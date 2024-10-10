import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import "./AllItemsReport.css";
import "bootstrap/dist/css/bootstrap.min.css"; // Bootstrap added here

const AllItemsReport = () => {
  const [items, setItems] = useState([]);

  useEffect(() => {
    axios
      .get("http://localhost:5111/api/Buyer/all-items-report")
      .then((response) => setItems(response.data))
      .catch((error) => console.log("Error fetching items: ", error));
  }, []);

  const handleLogout = () => {
    axios
      .post("http://localhost:5111/api/Account/logout")
      .then((response) => {
        console.log(response.data);
        window.location.href = "/login";
      })
      .catch((error) => console.log("Logout failed: ", error));
  };

  return (
    <div className="all-items-report-container">
      <div className="hero-section text-center p-4">
        <h2>Welcome For Shopping!</h2>
      </div>
      <button onClick={handleLogout} className="btn btn-danger logout-button">
        Logout
      </button>
      <header>
        <h2 className="page-title">All Items Report</h2>
      </header>
      <div className="items-grid">
        {items.map((item) => (
          <div key={item.id} className="item-card">
            <h3>{item.name}</h3>
            <p className="price">Price: ${item.price}</p>
            <Link to={`/view-item/${item.id}`}>
              <button className="view-item-button">View Item</button>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AllItemsReport;
