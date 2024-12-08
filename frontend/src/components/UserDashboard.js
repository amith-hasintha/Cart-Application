import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { CartContext } from '../context/CartContext';
import { Link } from 'react-router-dom';

function UserDashboard() {
  const [products, setProducts] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [category, setCategory] = useState('');
  const [quantities, setQuantities] = useState({}); // Track quantities for each product
  const { addToCart } = useContext(CartContext);
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState(searchQuery);

  // Debounce searchQuery to reduce API calls
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearchQuery(searchQuery);
    }, 300); // Adjust debounce delay as needed

    return () => {
      clearTimeout(handler);
    };
  }, [searchQuery]);

  // Fetch products whenever debouncedSearchQuery or category changes
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/products', {
          params: {
            search: debouncedSearchQuery,
            category: category,
          },
        });
        setProducts(response.data);
      } catch (error) {
        console.error('Error fetching products:', error);
      }
    };
    fetchProducts();
  }, [debouncedSearchQuery, category]);

  const handleQuantityChange = (productId, quantity) => {
    setQuantities((prev) => ({
      ...prev,
      [productId]: quantity,
    }));
  };

  const handleAddToCart = (product) => {
    const quantity = quantities[product._id] || 1; // Default to 1 if no selection
    addToCart({ ...product, quantity });
    alert(`${product.name} (Quantity: ${quantity}) added to cart`);
  };

  return (
    <div className="App">
      <Link to={'/cart'}>
        <button>Cart</button>
      </Link>
      <h1>Product Dashboard</h1>

      {/* Search & Filter UI */}
      <div>
        <input
          type="text"
          placeholder="Search products"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <select onChange={(e) => setCategory(e.target.value)} value={category}>
          <option value="">Select Category</option>
          <option value="electronics">Electronics</option>
          <option value="furniture">Furniture</option>
          <option value="clothing">Clothing</option>
        </select>
      </div>

      {/* Product List */}
      <div style={{ display: 'flex', flexWrap: 'wrap' }}>
        {products.length > 0 ? (
          products.map((product) => (
            <div
              key={product._id}
              style={{
                margin: '10px',
                border: '1px solid #ddd',
                padding: '10px',
                textAlign: 'center',
                width: '200px',
              }}
            >
              <img
                src={`http://localhost:5000${product.image}`}
                alt={product.name}
                style={{ width: '100px', height: '100px', objectFit: 'cover' }}
              />
              <h3>{product.name}</h3>
              <p>{product.description}</p>
              <p>${product.price}</p>
              {/* Quantity Selector */}
              <input
                type="number"
                min="1"
                value={quantities[product._id] || 1}
                onChange={(e) =>
                  handleQuantityChange(product._id, parseInt(e.target.value, 10))
                }
                style={{ marginBottom: '10px', width: '100%' }}
              />
              <button
                onClick={() => handleAddToCart(product)}
                style={{
                  backgroundColor: '#28a745',
                  color: '#fff',
                  padding: '5px 10px',
                }}
              >
                Add to Cart
              </button>
            </div>
          ))
        ) : (
          <p>No products found matching your criteria</p>
        )}
      </div>
    </div>
  );
}

export default UserDashboard;
