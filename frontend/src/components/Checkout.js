import React, { useState, useContext } from 'react';
import { CartContext } from '../context/CartContext';
import './styles/Checkout.css';
import { useNavigate } from 'react-router';

function Checkout() {
    const navigate = useNavigate();
  const { cart } = useContext(CartContext);
  const [paymentDetails, setPaymentDetails] = useState({
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    cardHolderName: '',
  });
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState('');

  // Calculate total fee
  const calculateTotal = () => {
    return cart.reduce((total, item) => total + item.price * item.quantity, 0);
  };

  

  // Handle form submission
  const handlePayment = (e) => {
    e.preventDefault();
    setError('');

  

    // Simulate payment processing
    setIsProcessing(true);
    setTimeout(() => {
      alert('Payment Successful!');
      setIsProcessing(false);
      navigate('/user-dashboard');
    }, 2000);
  };

  // Handle input change
  const handleInputChange = (e) => {
    const { name, value } = e.target;

    // Restrict card number to numeric and 16 digits
    if (name === 'cardNumber' && (isNaN(value) || value.length > 16)) {
      return;
    }

    // Restrict CVV to numeric and 3 digits
    if (name === 'cvv' && (isNaN(value) || value.length > 3)) {
      return;
    }

    setPaymentDetails((prevDetails) => ({
      ...prevDetails,
      [name]: value,
    }));
  };

  return (
    <div className="checkout-container">
      <h1>Checkout</h1>
      <div className="total-fee">
        <p>Total Fee: <strong>${calculateTotal().toFixed(2)}</strong></p>
      </div>

      <form className="payment-form" onSubmit={handlePayment}>
        <h2>Payment Details</h2>
        {error && <div className="error-message">{error}</div>}
        <div className="form-group">
          <label htmlFor="cardHolderName">Card Holder Name</label>
          <input
            type="text"
            id="cardHolderName"
            name="cardHolderName"
            value={paymentDetails.cardHolderName}
            onChange={handleInputChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="cardNumber">Card Number</label>
          <input
            type="text"
            id="cardNumber"
            name="cardNumber"
            maxLength="16"
            value={paymentDetails.cardNumber}
            onChange={handleInputChange}
            required
          />
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="expiryDate">Expiry Date</label>
            <input
              type="text"
              id="expiryDate"
              name="expiryDate"
              placeholder="MM/YY"
              maxLength="5"
              value={paymentDetails.expiryDate}
              onChange={handleInputChange}
              pattern="^(0[1-9]|1[0-2])\/?([0-9]{2})$"
              title="Enter expiry date in MM/YY format"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="cvv">CVV</label>
            <input
              type="text"
              id="cvv"
              name="cvv"
              maxLength="3"
              value={paymentDetails.cvv}
              onChange={handleInputChange}
              required
            />
          </div>
        </div>

        <button type="submit" className="submit-button" disabled={isProcessing}>
          {isProcessing ? 'Processing...' : 'Pay Now'}
        </button>
      </form>
    </div>
  );
}

export default Checkout;
