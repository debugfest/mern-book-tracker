// Import mongoose for MongoDB schema and model creation
import mongoose from 'mongoose';

// Define the Book schema with validation rules
const bookSchema = new mongoose.Schema({
  // Title of the book - required field
  title: {
    type: String,
    required: true,
    trim: true
  },
  // Author name - required field
  author: {
    type: String,
    required: true,
    trim: true
  },
  // Genre or category of the book
  genre: {
    type: String,
    required: true,
    trim: true
  },
  // Year the book was published
  year: {
    type: Number,
    required: true
  },
  // Reading status - read, reading, or to-read
  status: {
    type: String,
    enum: ['read', 'reading', 'to-read'],
    default: 'to-read'
  }
}, {
  // Automatically add createdAt and updatedAt timestamps
  timestamps: true
});

// Create and export the Book model based on the schema
const Book = mongoose.model('Book', bookSchema);

export default Book;
