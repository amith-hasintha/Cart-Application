import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import {jwtDecode} from 'jwt-decode';  // Ensure correct import for jwtDecode
import './styles/Register.css';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const { email, password } = formData;

  const onChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post('http://localhost:5000/api/auth/login', { email, password });

      // Check if the response contains the token
      if (res && res.data && res.data.token) {
        localStorage.setItem('token', res.data.token);

        // Decode the JWT to get user role
        const decoded = jwtDecode(res.data.token);
        console.log('Decoded Token:', decoded);  

        const userRole = decoded?.role;  // Ensure you're safely accessing the role

        if (userRole) {
          console.log('User Role:', userRole);
          // Redirect user based on their role
          if (userRole === 'admin') {
            navigate('/admin-dashboard'); // Redirect admin to admin dashboard
          } else {
            navigate('/user-dashboard'); // Redirect normal user to user dashboard
          }
        } else {
          setError('Role not found in token');
        }
      } else {
        throw new Error('Unexpected response from server');
      }
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.msg || 'Invalid credentials, please try again.');
    }
  };

  return (
    <><div className='dv-reg'>
      <div className="form-container">
      <div className="form-image"></div>
      <div className="form">
        <h2>Login</h2>
        <p>Welcome back!</p>
        {error && <p style={{ color: 'red' }}>{error}</p>}
        <form onSubmit={onSubmit}>
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={email}
            onChange={onChange}
            required />
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={password}
            onChange={onChange}
            required />
          <button type="submit">Login</button>
        </form>
        <br />
        Don't have an account? <Link to="/register">Sign Up</Link>
      </div>
    </div>
    </div>
    </>
  );
};

export default Login;
