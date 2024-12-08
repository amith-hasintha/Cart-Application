import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './styles/Header.css';
import cartImage from './styles/cart-removebg-preview.png';

const Header = ({ totalItems = 0 }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    // Add logout functionality
    alert('Logged out successfully!');
    navigate('/login');
  };

  return (
    <header className="header">
      <h1 style={{color:'white'}}>Shopping App</h1>
      <div className="header-right">
        <Link to="/cart" className="cart-button">
          <img src={cartImage} alt="Cart" />
          <span>({totalItems})</span>
        </Link>
        <button onClick={handleLogout}>Logout</button>
      </div>
    </header>
  );
};

export default Header;
