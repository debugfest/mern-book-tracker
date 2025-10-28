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
  },
  // ISBN for book identification
  isbn: {
    type: String,
    trim: true
  },
  // Total page count
  pageCount: {
    type: Number,
    min: 0
  },
  // Current page for books being read
  currentPage: {
    type: Number,
    min: 0,
    default: 0
  },
  // Book description
  description: {
    type: String,
    trim: true
  },
  // User rating (1-5 stars)
  rating: {
    type: Number,
    min: 1,
    max: 5
  },
  // Book cover image URL
  coverImage: {
    type: String,
    trim: true
  },
  // Reading start date
  startDate: {
    type: Date
  },
  // Reading finish date
  finishDate: {
    type: Date
  },
  // Publication date (more specific than year)
  publicationDate: {
    type: Date
  }
}, {
  // Automatically add createdAt and updatedAt timestamps
  timestamps: true
});

// Create and export the Book model based on the schema
const Book = mongoose.model('Book', bookSchema);

export default Book;
