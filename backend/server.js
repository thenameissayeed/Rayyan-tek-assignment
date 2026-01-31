require('dotenv').config(); // Load environment variables
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const publicRoutes = require('./routes/publicRoutes');

const app = express();
app.use(cors());
app.use(express.json());

// 1. USE ENVIRONMENT VARIABLE FOR DB
// Do not hardcode your password in GitHub!
const dbURI = process.env.MONGO_URI;

mongoose.connect(dbURI)
  .then(() => console.log("MongoDB Connected ✅"))
  .catch(err => console.log("DB Error: ", err));

app.use('/api/public', publicRoutes);

// Health check route
app.get('/', (req, res) => res.send("Nadwa Server is alive!"));

// 2. DYNAMIC PORT BINDING
// Render will assign a port automatically via process.env.PORT
const PORT = process.env.PORT || 5000;
app.listen(PORT, '0.0.0.0', () => {
    console.log(`Backend running on port ${PORT}`);
});
