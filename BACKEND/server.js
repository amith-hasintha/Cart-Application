const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const path = require("path");
const cors = require("cors");

const app = express();
require("dotenv").config();


const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(bodyParser.json());

const URL = process.env.MONGODB_URL;

mongoose.connect(URL, {
    // useCreateIndex: true,
    // useNewUrlParser: true,
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

const connection = mongoose.connection;
connection.once('open', () => {
    console.log('MongoDB Connection Success!');
});


const authRoutes = require('./routes/authRoutes'); // Import the auth routes

// Use the auth routes
app.use('/api/auth', authRoutes); // All auth routes will now start with /api/auth

app.use('/api/products', require('./routes/Product'));

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));


app.listen(PORT, () => {
    console.log(`Server is up and running on port number: ${PORT}`);
});




