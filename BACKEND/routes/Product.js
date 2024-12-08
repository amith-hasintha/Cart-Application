const express = require('express');
const multer = require('multer');
const path = require('path');
const ProductController = require('../controllers/ProductController.js');

const router = express.Router();

// Configure multer
const storage = multer.diskStorage({
  destination: function (_, __, cb) {
    cb(null, 'uploads/'); // Directory where files will be stored
  },
  filename: function (_, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname)); // Unique filename
  },
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB file size limit
  fileFilter: function (_, file, cb) {
    const fileTypes = /jpeg|webp|jpg|png|gif/;
    const extName = fileTypes.test(path.extname(file.originalname).toLowerCase());
    const mimeType = fileTypes.test(file.mimetype);
    if (extName && mimeType) {
      cb(null, true);
    } else {
      cb(new Error('Only images are allowed!'));
    }
  },
});

// Define routes
router.get('/', ProductController.getProducts);
router.get('/:id', ProductController.getProductById);
router.post('/add', upload.single('image'), ProductController.createProduct);
router.put('/update/:id', ProductController.updateProduct);
router.delete('/delete/:id', ProductController.deleteProduct);

module.exports = router;
