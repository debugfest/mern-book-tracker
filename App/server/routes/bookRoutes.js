// Import Express Router and Book model
import express from 'express';
import Book from '../models/Book.js';

const router = express.Router();

// GET /books - Retrieve all books from database
router.get('/books', async (req, res) => {
  try {
    // Find all books and sort by creation date (newest first)
    const books = await Book.find().sort({ createdAt: -1 });

    // Send books array as JSON response
    res.json(books);
  } catch (error) {
    // Send error response if database query fails
    res.status(500).json({ message: 'Error fetching books', error: error.message });
  }
});

// POST /books - Create a new book
router.post('/books', async (req, res) => {
  try {
    // Extract book data from request body
    const { title, author, genre, year, status } = req.body;

    // Create new book instance with provided data
    const newBook = new Book({
      title,
      author,
      genre,
      year,
      status
    });

    // Save the new book to database
    const savedBook = await newBook.save();

    // Send created book back with 201 status
    res.status(201).json(savedBook);
  } catch (error) {
    // Send error response if book creation fails
    res.status(400).json({ message: 'Error creating book', error: error.message });
  }
});

// PUT /books/:id - Update an existing book by ID
router.put('/books/:id', async (req, res) => {
  try {
    // Extract book ID from URL parameters
    const { id } = req.params;

    // Extract updated data from request body
    const { title, author, genre, year, status } = req.body;

    // Find book by ID and update with new data
    // { new: true } returns the updated document
    const updatedBook = await Book.findByIdAndUpdate(
      id,
      { title, author, genre, year, status },
      { new: true, runValidators: true }
    );

    // If book not found, send 404 error
    if (!updatedBook) {
      return res.status(404).json({ message: 'Book not found' });
    }

    // Send updated book as response
    res.json(updatedBook);
  } catch (error) {
    // Send error response if update fails
    res.status(400).json({ message: 'Error updating book', error: error.message });
  }
});

// DELETE /books/:id - Delete a book by ID
router.delete('/books/:id', async (req, res) => {
  try {
    // Extract book ID from URL parameters
    const { id } = req.params;

    // Find and delete the book by ID
    const deletedBook = await Book.findByIdAndDelete(id);

    // If book not found, send 404 error
    if (!deletedBook) {
      return res.status(404).json({ message: 'Book not found' });
    }

    // Send success message with deleted book data
    res.json({ message: 'Book deleted successfully', book: deletedBook });
  } catch (error) {
    // Send error response if deletion fails
    res.status(400).json({ message: 'Error deleting book', error: error.message });
  }
});

// Export the router to be used in main server file
export default router;
