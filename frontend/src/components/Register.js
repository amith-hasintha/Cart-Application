import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './styles/Register.css'; 

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const [error, setError] = useState('');
  const [passwordVisible, setPasswordVisible] = useState(false);
  const navigate = useNavigate();

  const { name, email, password, confirmPassword } = formData;

  

  // Form change handler
  const onChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  // Password validation logic
  const isPasswordStrong = (password) => {
    const strongPasswordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#])[A-Za-z\d@$!%*?&#]{8,}$/;
    return strongPasswordRegex.test(password);
  };

  // Form submission handler
  const onSubmit = async (e) => {
    e.preventDefault();

    // Check password strength
    if (!isPasswordStrong(password)) {
      return setError(
        'Password must be at least 8 characters long, include uppercase, lowercase, a number, and a special character.'
      );
    }

    // Check if passwords match
    if (password !== confirmPassword) {
      return setError('Passwords do not match.');
    }

    try {
      const res = await axios.post('http://localhost:5000/api/auth/register', { name, email, password });

      if (res && res.data && res.data.token) {
        localStorage.setItem('token', res.data.token); // Save JWT token
        navigate('/'); // Redirect on success
      } else {
        throw new Error('Unexpected response from server');
      }
    } catch (err) {
      console.error(err); // Log the error
      setError(err.response?.data?.msg || 'An error occurred during registration.');
    }
  };

  return (
    <div className="dv-reg">
      <div className="form-container">
      <div className="form">
        <h2>Sign Up</h2>
        {error && <p style={{ color: 'red' }}>{error}</p>}
        <form onSubmit={onSubmit}>
          <input
            style={{borderRadius: '15px'}}
            type="text"
            name="name"
            placeholder="Name"
            value={name}
            onChange={onChange}
            required
          />
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={email}
            onChange={onChange}
            required
          />
          <div className="password-field">
            <input
              type={passwordVisible ? 'text' : 'password'}
              name="password"
              placeholder="Password"
              value={password}
              onChange={onChange}
              required
            />
          </div>
          <input
            type={passwordVisible ? 'text' : 'password'}
            name="confirmPassword"
            placeholder="Confirm Password"
            value={confirmPassword}
            onChange={onChange}
            required
          />
          <button type="submit">Sign Up</button>
        </form>
        Already have an account? <Link to={'/login'}>Login</Link>
      </div>
    </div>
    </div>
  );
};

export default Register;
