const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const publicRoutes = require('./routes/publicRoutes'); // <-- Double check this path!

const app = express();
app.use(cors());
app.use(express.json());

// Cloud DB Connection
const dbURI = 'mongodb+srv://thenameissayeed:IneedAllah%401@college-db.3ftxso9.mongodb.net/college_db?retryWrites=true&w=majority';
mongoose.connect(dbURI)
  .then(() => console.log("MongoDB Connected ✅"))
  .catch(err => console.log("DB Error: ", err));

// THE FIX: Ensure this is exactly as follows
app.use('/api/public', publicRoutes);

// Add a test route directly in server.js to see if the server is alive
app.get('/test', (req, res) => res.send("Server is alive at root!"));

const PORT = 5000;
app.listen(PORT, () => console.log(`Backend running on http://localhost:${PORT}`));