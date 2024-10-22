import React, { useState, useEffect } from "react";
import axios from "axios";
import "./SellerHomePage.css";
import "bootstrap/dist/css/bootstrap.min.css";
import { Link, useNavigate } from "react-router-dom";

// Error Boundary Component
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error("Error boundary caught an error", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return <h1>Something went wrong while loading the seller homepage.</h1>;
    }
    return this.props.children;
  }
}

const SellerHomePage = () => {
  const [items, setItems] = useState([]);
  const [searchTerm, setSearchTerm] = useState(""); // Add state for search term
  const navigate = useNavigate();

  const fetchItems = async (searchString = null) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        alert("You are not logged in. Redirecting to login.");
        window.location.href = "/login";
        return;
      }

      const response = await axios.get(
        `http://localhost:5111/api/SellersPage/user-homepage?searchString=${
          searchString || ""
        }`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-type": "application/json",
            Accept: "application/json",
          },
        }
      );
      console.log("Received data:", response.data);
      setItems(response.data);
    } catch (error) {
      console.error("Error fetching items:", error);
    }
  };

  useEffect(() => {
    fetchItems(); // Fetch all items initially
  }, []);

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

  const handleAddItem = async (item) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        alert("You are not logged in. Redirecting to login.");
        window.location.href = "/login";
        return;
      }

      const response = await axios.post(
        "http://localhost:5111/api/SellersPage/AddEditItem",
        item,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-type": "application/json",
            Accept: "application/json",
          },
        }
      );

      console.log("Item added:", response.data);
      fetchItems(); // Fetch items after adding a new one
    } catch (error) {
      console.error(
        "Error adding item:",
        error.response?.data || error.message
      );
      alert(
        "Error adding item: " + (error.response?.data?.message || error.message)
      );
    }
  };

  const handleLogout = async () => {
    if (window.confirm("Do You want to Logout?")) {
      delete axios.defaults.headers.common["Authorization"];
      localStorage.removeItem("token");
      try {
        await axios.post("http://localhost:5111/api/Account/logout");
        window.location.href = "/login";
      } catch (error) {
        console.log("Logout failed: ", error);
      }
    }
  };

  const handleEdit = (item) => {
    navigate("/add-edit-item", { state: { item } });
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this item?")) {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          alert("You are not logged in. Redirecting to login.");
          window.location.href = "/login";
          return;
        }

        const response = await axios.delete(
          `http://localhost:5111/api/SellersPage/delete-item/${id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        console.log(response.data);
        setItems(items.filter((item) => item.id !== id));
        alert("Item deleted successfully.");
      } catch (error) {
        console.error(
          "Error deleting item:",
          error.response?.data || error.message
        );
        alert(
          "Error deleting item: " +
            (error.response?.data?.message || error.message)
        );
      }
    }
  };

  return (
    <ErrorBoundary>
      <div className="container seller-home-container">
        <div className="hero-section text-center p-4">
          <h2>Welcome, Seller!</h2>
          <p>Manage your items below</p>
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

        {Array.isArray(items) && items.length > 0 ? (
          <div className="row mt-4">
            {items.map((item) => (
              <div className="col-lg-4 col-md-6 mb-4" key={item.id}>
                <div className="card h-100">
                  <div className="card-body">
                    <div className="d-flex justify-content-between align-items-center">
                      <h4 className="card-title">{item.name}</h4>
                      <div>
                        <button
                          className="btn btn-edit me-2"
                          onClick={() => handleEdit(item)}
                        >
                          Edit
                        </button>

                        <button
                          className="btn btn-delete me-2"
                          onClick={() => handleDelete(item.id)}
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                    <p>{item.description}</p>
                    <span className="sellerprice">${item.price}</span>
                    <p>Quantity Available: {item.quantityAvailable}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="mt-5 text-center">No items available.</p>
        )}

        <div className="mt-5 text-center">
          <Link to="/add-edit-item">
            <button className="btn btn-primary">Add New Item</button>
          </Link>
        </div>
      </div>
    </ErrorBoundary>
  );
};

export default SellerHomePage;
