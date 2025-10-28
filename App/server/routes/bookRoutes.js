// Import Express Router and Book model
import express from 'express';
import Book from '../models/Book.js';

const router = express.Router();

// GET /books - Retrieve all books from database with search, filter, and sort
router.get('/books', async (req, res) => {
  try {
    const { 
      search, 
      status, 
      genre, 
      yearFrom, 
      yearTo, 
      sortBy = 'createdAt', 
      sortOrder = 'desc' 
    } = req.query;

    // Build query object
    let query = {};

    // Search functionality
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { author: { $regex: search, $options: 'i' } },
        { genre: { $regex: search, $options: 'i' } }
      ];
    }

    // Filter by status
    if (status) {
      query.status = status;
    }

    // Filter by genre
    if (genre) {
      query.genre = { $regex: genre, $options: 'i' };
    }

    // Filter by year range
    if (yearFrom || yearTo) {
      query.year = {};
      if (yearFrom) query.year.$gte = parseInt(yearFrom);
      if (yearTo) query.year.$lte = parseInt(yearTo);
    }

    // Build sort object
    const sortOptions = {};
    sortOptions[sortBy] = sortOrder === 'desc' ? -1 : 1;

    // Find books with query and sort
    const books = await Book.find(query).sort(sortOptions);

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
    const { 
      title, 
      author, 
      genre, 
      year, 
      status, 
      isbn, 
      pageCount, 
      currentPage, 
      description, 
      rating, 
      coverImage, 
      startDate, 
      finishDate, 
      publicationDate 
    } = req.body;

    // Create new book instance with provided data
    const newBook = new Book({
      title,
      author,
      genre,
      year,
      status,
      isbn,
      pageCount,
      currentPage,
      description,
      rating,
      coverImage,
      startDate: startDate ? new Date(startDate) : undefined,
      finishDate: finishDate ? new Date(finishDate) : undefined,
      publicationDate: publicationDate ? new Date(publicationDate) : undefined
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
    const { 
      title, 
      author, 
      genre, 
      year, 
      status, 
      isbn, 
      pageCount, 
      currentPage, 
      description, 
      rating, 
      coverImage, 
      startDate, 
      finishDate, 
      publicationDate 
    } = req.body;

    // Prepare update object
    const updateData = {
      title, 
      author, 
      genre, 
      year, 
      status, 
      isbn, 
      pageCount, 
      currentPage, 
      description, 
      rating, 
      coverImage
    };

    // Add date fields if provided
    if (startDate) updateData.startDate = new Date(startDate);
    if (finishDate) updateData.finishDate = new Date(finishDate);
    if (publicationDate) updateData.publicationDate = new Date(publicationDate);

    // Find book by ID and update with new data
    // { new: true } returns the updated document
    const updatedBook = await Book.findByIdAndUpdate(
      id,
      updateData,
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

// PATCH /books/:id/status - Quick status update
router.patch('/books/:id/status', async (req, res) => {
  try {
    const { id } = req.params;
    const { status, startDate, finishDate } = req.body;

    const updateData = { status };
    
    // Set start date when starting to read
    if (status === 'reading' && !startDate) {
      updateData.startDate = new Date();
    }
    
    // Set finish date when marking as read
    if (status === 'read' && !finishDate) {
      updateData.finishDate = new Date();
    }

    const updatedBook = await Book.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    );

    if (!updatedBook) {
      return res.status(404).json({ message: 'Book not found' });
    }

    res.json(updatedBook);
  } catch (error) {
    res.status(400).json({ message: 'Error updating book status', error: error.message });
  }
});

// PATCH /books/:id/progress - Update reading progress
router.patch('/books/:id/progress', async (req, res) => {
  try {
    const { id } = req.params;
    const { currentPage } = req.body;

    const updatedBook = await Book.findByIdAndUpdate(
      id,
      { currentPage },
      { new: true, runValidators: true }
    );

    if (!updatedBook) {
      return res.status(404).json({ message: 'Book not found' });
    }

    res.json(updatedBook);
  } catch (error) {
    res.status(400).json({ message: 'Error updating reading progress', error: error.message });
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
