const Product = require('../models/Product');
const fs = require('fs');
const path = require('path');

const products = [];
exports.getProducts = async (req, res) => {
    try {
        const products = await Product.find();
        res.json(products);
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: 'Server error' });
    }
};

exports.getProductById = async (req, res) => {
    const { id } = req.params;

    try {
        const product = await Product.findById(id);
        if (!product) {
            return res.status(404).json({ msg: 'Product not found' });
        }

        res.json(product);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ msg: 'Server error' });
    }
};

exports.createProduct = async (req, res) => {
    const { name, price, description, image } = req.body;

    if (!name || !price || !description || !req.file) {
        return res.status(400).json({ message: 'All fields are required.' });
    }

    const imagePath = `/uploads/${req.file.filename}`; 

    try {
        const product = new Product({ name, price, description, image: imagePath });
        await product.save();
        res.status(200).json(product);
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: 'Server error' });
    }
};


exports.updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = {};

    // Update fields only if they are provided
    if (req.body.name) updateData.name = req.body.name;
    if (req.body.price) updateData.price = req.body.price;
    if (req.body.description) updateData.description = req.body.description;

    // Handle image upload if provided
    if (req.file) {
      updateData.image = `/uploads/${req.file.filename}`; // Assuming multer is used for image upload
    }

    const updatedProduct = await Product.findByIdAndUpdate(id, updateData, {
      new: true, // Return the updated document
      runValidators: true, // Ensure validation rules are applied
    });

    if (!updatedProduct) {
      return res.status(404).json({ message: 'Product not found' });
    }

    res.status(200).json(updatedProduct);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to update product', error: err });
  }
};


exports.deleteProduct = async (req, res) => {
    const { id } = req.params;

    try {
        const product = await Product.findByIdAndDelete(id);
        if (!product) {
            return res.status(404).json({ msg: 'Product not found' });
        }

        
        res.json({ msg: 'Product removed' });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ msg: 'Server error' });
    }
}
