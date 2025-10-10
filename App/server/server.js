// Import required packages
import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import bookRoutes from './routes/bookRoutes.js';

// Load environment variables from .env file
dotenv.config();

// Initialize Express application
const app = express();

// Get port from environment variable or use default 5000
const PORT = process.env.PORT || 5000;

// Middleware: Enable CORS to allow frontend to communicate with backend
app.use(cors());

// Middleware: Parse incoming JSON requests
app.use(express.json());

// Connect to MongoDB database
mongoose.connect(process.env.MONGODB_URI)
  .then(() => {
    console.log('✅ Successfully connected to MongoDB');
  })
  .catch((error) => {
    console.error('❌ MongoDB connection error:', error.message);
  });

// Use book routes for all API endpoints
app.use('/api', bookRoutes);

// Root endpoint - simple health check
app.get('/', (req, res) => {
  res.json({ message: 'Book Tracker API is running!' });
});

// Start the server and listen on specified port
app.listen(PORT, () => {
  console.log(`🚀 Server is running on http://localhost:${PORT}`);
});
