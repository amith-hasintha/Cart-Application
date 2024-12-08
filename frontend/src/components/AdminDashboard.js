import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./styles/AdminDashboard.css";

const AllProducts = () => {
  const [products, setProducts] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const BASE_URL = "http://localhost:5000";

  const navigate = useNavigate(); // Hook to navigate to another route

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/api/products/`);
      setProducts(response.data);
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };

  const deleteProduct = async (id) => {
    try {
      console.log("Deleting product with id:", id);
      await axios.delete(`${BASE_URL}/api/products/delete/${id}`);
      alert("Product deleted successfully");
      fetchProducts();
    } catch (error) {
      console.error("Error deleting product:", error);
      alert("Failed to delete product");
    }
  };

  const handleLogout = () => {
    // Clear JWT token from localStorage
    localStorage.removeItem("token");
    alert("Logged out successfully.");
    navigate("/login"); // Redirect user to the login page
  };

  const filteredProducts = products.filter((product) =>
    product.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <>
      <h1 className="h1">Products</h1>

      {/* Logout Button */}
      <div className="logout-container">
        <button className="btn logoutbtn" onClick={handleLogout}>
          Logout
        </button>
      </div>

      <div className="add-product">
        <button
          className="btn addproductbtn"
          onClick={() => navigate("/add-product")}
        >
          Add New Product
        </button>
      </div>
      <div className="search-container">
        <input
          type="text"
          placeholder="Search by Name..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      <div className="table-wrapper">
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Price</th>
              <th>Description</th>
              <th>Image</th>
              <th>Delete</th>
            </tr>
          </thead>
          <tbody>
            {filteredProducts.map((product) => (
              <tr key={product._id}>
                <td>{product.name}</td>
                <td>{product.price}</td>
                <td>{product.description}</td>
                <td>
                  {product.image && (
                    <img
                      src={`${BASE_URL}${product.image}`}
                      alt={product.name}
                      width="50"
                    />
                  )}
                </td>
                <td>
                  <button
                    className="btn deletebuttn"
                    onClick={() => deleteProduct(product._id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
};

export default AllProducts;
