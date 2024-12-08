import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './styles/AddProduct.css';

function AddProduct() {
  const navigate = useNavigate();
  const [product, setProduct] = useState({
    name: '',
    price: '',
    description: '',
  });

  const [image, setImage] = useState(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProduct((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    setImage(e.target.files[0]); // Update the image state with the selected file
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    // Validate form fields
    if (!product.name || !product.price || !product.description || !image) {
      setError('All fields are required.');
      return;
    }

    const formData = new FormData();
    formData.append('name', product.name);
    formData.append('price', product.price);
    formData.append('description', product.description);
    formData.append('image', image); // Attach the image file

    try {
      const response = await axios.post('http://localhost:5000/api/products/add', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (response.status === 200) {
        setSuccess('Product added successfully!');
        setProduct({ name: '', price: '', description: '' });
        setImage(null);
        navigate('/admin-dashboard');
      } else {
        throw new Error('Unexpected response from server.');
      }
    } catch (error) {
      console.error('Error adding product:', error);
      setError('Failed to add product. Please try again later.');
    }
  };

  return (
    <div className="add-product-container">
      <h2 className="add-product-title">Admin - Add Product</h2>
      {error && <p className="error-message">{error}</p>}
      {success && <p className="success-message">{success}</p>}
      <form className="add-product-form" onSubmit={handleSubmit}>
        <input
          type="text"
          name="name"
          value={product.name}
          placeholder="Product Name"
          onChange={handleChange}
          className="add-product-input"
          required
        />
        <input
          type="number"
          name="price"
          value={product.price}
          placeholder="Price"
          onChange={handleChange}
          className="add-product-input"
          required
        />
        <textarea
          name="description"
          value={product.description}
          placeholder="Description"
          onChange={handleChange}
          className="add-product-textarea"
          required
        />
        <input
          type="file"
          accept="image/*"
          onChange={handleImageChange}
          className="add-product-input"
          required
        />
        <button type="submit" className="add-product-button">Add Product</button>
      </form>
    </div>
  );
}

export default AddProduct;
