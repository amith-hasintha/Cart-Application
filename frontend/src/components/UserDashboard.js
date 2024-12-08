import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { CartContext } from '../context/CartContext';
import Header from './Header';
import './styles/UserDashboard.css';
import './styles/Header.css';

function UserDashboard() {
  const [products, setProducts] = useState([]); 
  const [allProducts, setAllProducts] = useState([]); 
  const [searchQuery, setSearchQuery] = useState('');
  const { cart, addToCart } = useContext(CartContext);

  // State to track individual product quantities
  const [tempQuantities, setTempQuantities] = useState({});

  // Fetch products from backend on app load
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/products');
        setProducts(response.data);
        setAllProducts(response.data);

        // Initialize tempQuantities with 1 for every product
        const initialQuantities = {};
        response.data.forEach(product => {
          initialQuantities[product._id] = 1; // Default starting quantity is 1
        });
        setTempQuantities(initialQuantities);
      } catch (error) {
        console.error('Error fetching products:', error);
      }
    };

    fetchProducts();
  }, []);

  useEffect(() => {
    if (searchQuery === '') {
      setProducts(allProducts);
    } else {
      const filteredProducts = allProducts.filter(product =>
        product.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setProducts(filteredProducts);
    }
  }, [searchQuery, allProducts]);

  const handleIncreaseQuantity = (productId) => {
    setTempQuantities(prev => ({
      ...prev,
      [productId]: prev[productId] + 1,
    }));
  };

  const handleDecreaseQuantity = (productId) => {
    setTempQuantities(prev => ({
      ...prev,
      [productId]: Math.max(prev[productId] - 1, 1), // Prevent going below 1
    }));
  };

  const handleAddToCart = (product) => {
    addToCart({ ...product, quantity: tempQuantities[product._id] });
    alert(`${product.name} with quantity ${tempQuantities[product._id]} added to cart`);
  };

  const calculateCartSummary = () => {
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    const totalAmount = cart.reduce((sum, item) => sum + item.quantity * item.price, 0);
    return { totalItems, totalAmount };
  };

  const { totalItems } = calculateCartSummary();

  return (
    <div className="App">
      <Header totalItems={totalItems} />

      <div className="search-bar">
        <input
          type="text"
          placeholder="Search products by name..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>
      
      <div className="product-grid">
        {products.length > 0 ? (
          products.map((product) => (
            <div className="product-card" key={product._id}>
              <img
                src={`http://localhost:5000${product.image}`}
                alt={product.name}
              />
              <h3>{product.name}</h3>
              <p>{product.description}</p>
              <p className="price">${product.price}</p>
              <div className="quantity-controls">
                <button
                  style={{ backgroundColor: 'black', color: 'white' }}
                  onClick={() => handleDecreaseQuantity(product._id)}
                >
                  -
                </button>
                <span>{tempQuantities[product._id] || 1}</span>
                <button
                  style={{ backgroundColor: 'black', color: 'white' }}
                  onClick={() => handleIncreaseQuantity(product._id)}
                >
                  +
                </button>
              </div>
              <button onClick={() => handleAddToCart(product)}>Add to Cart</button>
            </div>
          ))
        ) : (
          <p>No products found</p>
        )}
      </div>
    </div>
  );
}

export default UserDashboard;
