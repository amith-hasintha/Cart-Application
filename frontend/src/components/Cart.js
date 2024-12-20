import React, { useContext } from 'react';
import { CartContext } from '../context/CartContext';
import { useNavigate } from 'react-router';
import Header from './Header';
import './styles/Cart.css';

function Cart() {
  const { cart, setCart, removeFromCart } = useContext(CartContext);
  const navigate = useNavigate();

  const updateQuantity = (id, amount) => {
    setCart((prevCart) =>
      prevCart.map((item) =>
        item._id === id
          ? { ...item, quantity: Math.max(item.quantity + amount, 1) }
          : item
      )
    );
  };

  const calculateTotal = () => {
    return cart.reduce((total, item) => total + item.price * item.quantity, 0);
  };

  return (
    <div className="cart-container">
      <Header />
      <h1 className="cart-header">Your Shopping Cart</h1>
      {cart.length > 0 ? (
        <>
          {cart.map((item) => (
            <div className="cart-item" key={item._id}>
              <img
                src={`http://localhost:5000${item.image}`}
                alt={item.name}
              />
              <div className="cart-item-details">
                <div className="cart-item-title">{item.name}</div>
                <div className="cart-item-price">Price: ${item.price}</div>
                <div className="quantity-controls">
                  <button onClick={() => updateQuantity(item._id, -1)}>-</button>
                  <span>{item.quantity}</span>
                  <button onClick={() => updateQuantity(item._id, 1)}>+</button>
                </div>
                <div className="cart-item-subtotal">
                  Subtotal: ${item.price * item.quantity}
                </div>
              </div>
              <button
                className="cart-item-remove"
                onClick={() => removeFromCart(item._id)}
              >
                Remove
              </button>
            </div>
          ))}
          <div className="cart-total">Total: ${calculateTotal().toFixed(2)}</div>
          <div className="cart-actions">
            <button style={{backgroundColor:'blue',color:'white'}} onClick={() => navigate('/user-dashboard')}>Continue Shopping</button>
            <button style={{backgroundColor:'red', color:'white'}} onClick={() => setCart([])}>Clear Cart</button>
            <button style={{backgroundColor:'green',color:'white'}} onClick={() => navigate('/checkout')}>Checkout</button>
          </div>
        </>
      ) : (
        <p>Your cart is empty.</p>
      )}
    </div>
  );
}

export default Cart;
