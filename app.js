const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const connectDB = require('./db');
const bodyParser = require('body-parser');
require('dotenv').config();
const app = express();
const path = require("path");
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

connectDB();

/* Import routes */
const authRoutes = require('./routes/authRoutes');
app.use('/api/auth', authRoutes);
const postRoutes = require('./routes/postRoutes');
app.use('/api/posts', postRoutes);

//view uploaded file from upload folder
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));



/* Start the server on port */
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});