// Import React hooks for state management and side effects
import { useState, useEffect } from 'react';
import { Plus, CreditCard as Edit2, Trash2, BookOpen, Search, Filter, Star, Calendar, BookMarked, Eye, EyeOff, ExternalLink } from 'lucide-react';
import ConfirmModal from './Components/Common/ConfirmModal';
import BookCoverLookup from './Components/Common/BookCoverLookup';

// Define TypeScript interface for Book object
interface Book {
  _id: string;
  title: string;
  author: string;
  genre: string;
  year: number;
  status: 'read' | 'reading' | 'to-read';
  isbn?: string;
  pageCount?: number;
  currentPage?: number;
  description?: string;
  rating?: number;
  coverImage?: string;
  startDate?: string;
  finishDate?: string;
  publicationDate?: string;
  createdAt: string;
  updatedAt: string;
}

function App() {
  // State to store all books fetched from backend
  const [books, setBooks] = useState<Book[]>([]);

  // State to control form visibility (add or edit mode)
  const [showForm, setShowForm] = useState(false);

  // State to store the book being edited (null if adding new book)
  const [editingBook, setEditingBook] = useState<Book | null>(null);

  // State to store form input values
  const [formData, setFormData] = useState({
    title: '',
    author: '',
    genre: '',
    year: new Date().getFullYear(),
    status: 'to-read' as 'read' | 'reading' | 'to-read',
    isbn: '',
    pageCount: 0,
    currentPage: 0,
    description: '',
    rating: 0,
    coverImage: '',
    startDate: '',
    finishDate: '',
    publicationDate: ''
  });

  // Search and filter states
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [genreFilter, setGenreFilter] = useState('');
  const [yearFrom, setYearFrom] = useState('');
  const [yearTo, setYearTo] = useState('');
  const [sortBy, setSortBy] = useState('createdAt');
  const [sortOrder, setSortOrder] = useState('desc');
  const [showFilters, setShowFilters] = useState(false);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [bookToDelete, setBookToDelete] = useState<string | null>(null);
  const [showBookLookup, setShowBookLookup] = useState(false);

  // Backend API URL
  const API_URL = 'http://localhost:5000/api';

  // Fetch all books when component mounts or filters change
  useEffect(() => {
    fetchBooks();
  }, [searchTerm, statusFilter, genreFilter, yearFrom, yearTo, sortBy, sortOrder]);

  // Function to fetch all books from backend with search and filters
  const fetchBooks = async () => {
    try {
      const params = new URLSearchParams();
      if (searchTerm) params.append('search', searchTerm);
      if (statusFilter) params.append('status', statusFilter);
      if (genreFilter) params.append('genre', genreFilter);
      if (yearFrom) params.append('yearFrom', yearFrom);
      if (yearTo) params.append('yearTo', yearTo);
      if (sortBy) params.append('sortBy', sortBy);
      if (sortOrder) params.append('sortOrder', sortOrder);

      const response = await fetch(`${API_URL}/books?${params.toString()}`);
      const data = await response.json();
      setBooks(data);
    } catch (error) {
      console.error('Error fetching books:', error);
      alert('Failed to fetch books');
    }
  };

  // Handle form input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'year' || name === 'pageCount' || name === 'currentPage' || name === 'rating' 
        ? parseInt(value) || 0 
        : value
    }));
  };

  // Quick status update function
  const handleQuickStatusUpdate = async (bookId: string, newStatus: 'read' | 'reading' | 'to-read') => {
    try {
      const response = await fetch(`${API_URL}/books/${bookId}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
      });

      if (response.ok) {
        fetchBooks(); // Refresh the book list
      }
    } catch (error) {
      console.error('Error updating book status:', error);
      alert('Failed to update book status');
    }
  };

  // Update reading progress function
  const handleProgressUpdate = async (bookId: string, currentPage: number) => {
    try {
      const response = await fetch(`${API_URL}/books/${bookId}/progress`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ currentPage })
      });

      if (response.ok) {
        fetchBooks(); // Refresh the book list
      }
    } catch (error) {
      console.error('Error updating reading progress:', error);
      alert('Failed to update reading progress');
    }
  };

  // Handle book lookup result
  const handleBookLookupResult = (bookData: any) => {
    setFormData(prev => ({
      ...prev,
      title: bookData.title,
      author: bookData.author,
      isbn: bookData.isbn,
      pageCount: bookData.pageCount,
      description: bookData.description,
      coverImage: bookData.coverImage,
      publicationDate: bookData.publicationDate ? bookData.publicationDate.split('T')[0] : ''
    }));
  };

  // Handle form submission (add or update book)
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      // If editing, update existing book
      if (editingBook) {
        const response = await fetch(`${API_URL}/books/${editingBook._id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData)
        });

        if (response.ok) {
          alert('Book updated successfully!');
        }
      } else {
        // If not editing, create new book
        const response = await fetch(`${API_URL}/books`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData)
        });

        if (response.ok) {
          alert('Book added successfully!');
        }
      }

      // Reset form and refresh book list
      resetForm();
      fetchBooks();
    } catch (error) {
      console.error('Error saving book:', error);
      alert('Failed to save book');
    }
  };

  // Handle edit button click - populate form with existing book data
  const handleEdit = (book: Book) => {
    setEditingBook(book);
    setFormData({
      title: book.title,
      author: book.author,
      genre: book.genre,
      year: book.year,
      status: book.status,
      isbn: book.isbn || '',
      pageCount: book.pageCount || 0,
      currentPage: book.currentPage || 0,
      description: book.description || '',
      rating: book.rating || 0,
      coverImage: book.coverImage || '',
      startDate: book.startDate ? book.startDate.split('T')[0] : '',
      finishDate: book.finishDate ? book.finishDate.split('T')[0] : '',
      publicationDate: book.publicationDate ? book.publicationDate.split('T')[0] : ''
    });
    setShowForm(true);
  };

  // Handle delete button click
      const handleDeleteClick = (id: string) => {
    setBookToDelete(id);   // store the book ID
    setIsModalOpen(true);  // open confirmation modal
  };

  const handleConfirmDelete = async () => {
    if (!bookToDelete) return;

    try {
      const response = await fetch(`${API_URL}/books/${bookToDelete}`, {
        method: "DELETE",
      });

      if (response.ok) {
        alert("Book deleted successfully!");
        fetchBooks();
      }
    } catch (error) {
      console.error("Error deleting book:", error);
      alert("Failed to delete book");
    } finally {
      setIsModalOpen(false);
      setBookToDelete(null);
    }
  };

  const handleCancelDelete = () => {
    setIsModalOpen(false);
    setBookToDelete(null);
  };

  // Reset form to initial state
  const resetForm = () => {
    setFormData({
      title: '',
      author: '',
      genre: '',
      year: new Date().getFullYear(),
      status: 'to-read',
      isbn: '',
      pageCount: 0,
      currentPage: 0,
      description: '',
      rating: 0,
      coverImage: '',
      startDate: '',
      finishDate: '',
      publicationDate: ''
    });
    setEditingBook(null);
    setShowForm(false);
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f5f5f5', padding: '20px' }}>
      {/* Header */}
      <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
        <div style={{
          backgroundColor: 'white',
          padding: '20px',
          marginBottom: '20px',
          borderRadius: '8px',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <BookOpen size={32} color="#2563eb" />
            <h1 style={{ fontSize: '28px', fontWeight: 'bold', color: '#1f2937', margin: 0 }}>
              Book Tracker
            </h1>
          </div>
          <button
            onClick={() => setShowForm(!showForm)}
            style={{
              backgroundColor: '#2563eb',
              color: 'white',
              padding: '10px 20px',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              fontSize: '14px',
              fontWeight: '500'
            }}
          >
            <Plus size={20} />
            {showForm ? 'Cancel' : 'Add Book'}
          </button>
        </div>

        {/* Search and Filter Section */}
        <div style={{
          backgroundColor: 'white',
          padding: '20px',
          marginBottom: '20px',
          borderRadius: '8px',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
        }}>
          <div style={{ display: 'flex', gap: '15px', marginBottom: '15px', alignItems: 'center' }}>
            {/* Search Input */}
            <div style={{ flex: 1, position: 'relative' }}>
              <Search size={20} style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: '#6b7280' }} />
              <input
                type="text"
                placeholder="Search books by title, author, or genre..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{
                  width: '100%',
                  padding: '10px 10px 10px 40px',
                  border: '1px solid #d1d5db',
                  borderRadius: '6px',
                  fontSize: '14px'
                }}
              />
            </div>
            
            {/* Filter Toggle Button */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              style={{
                backgroundColor: showFilters ? '#3b82f6' : '#f3f4f6',
                color: showFilters ? 'white' : '#374151',
                padding: '10px 15px',
                border: 'none',
                borderRadius: '6px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                fontSize: '14px',
                fontWeight: '500'
              }}
            >
              <Filter size={16} />
              Filters
            </button>
          </div>

          {/* Filter Options */}
          {showFilters && (
            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
              gap: '15px',
              padding: '15px',
              backgroundColor: '#f9fafb',
              borderRadius: '6px',
              border: '1px solid #e5e7eb'
            }}>
              {/* Status Filter */}
              <div>
                <label style={{ display: 'block', marginBottom: '5px', fontSize: '14px', fontWeight: '500' }}>
                  Status
                </label>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '8px',
                    border: '1px solid #d1d5db',
                    borderRadius: '4px',
                    fontSize: '14px'
                  }}
                >
                  <option value="">All Status</option>
                  <option value="to-read">To Read</option>
                  <option value="reading">Reading</option>
                  <option value="read">Read</option>
                </select>
              </div>

              {/* Genre Filter */}
              <div>
                <label style={{ display: 'block', marginBottom: '5px', fontSize: '14px', fontWeight: '500' }}>
                  Genre
                </label>
                <input
                  type="text"
                  placeholder="Filter by genre..."
                  value={genreFilter}
                  onChange={(e) => setGenreFilter(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '8px',
                    border: '1px solid #d1d5db',
                    borderRadius: '4px',
                    fontSize: '14px'
                  }}
                />
              </div>

              {/* Year Range */}
              <div>
                <label style={{ display: 'block', marginBottom: '5px', fontSize: '14px', fontWeight: '500' }}>
                  Year From
                </label>
                <input
                  type="number"
                  placeholder="From year..."
                  value={yearFrom}
                  onChange={(e) => setYearFrom(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '8px',
                    border: '1px solid #d1d5db',
                    borderRadius: '4px',
                    fontSize: '14px'
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: '5px', fontSize: '14px', fontWeight: '500' }}>
                  Year To
                </label>
                <input
                  type="number"
                  placeholder="To year..."
                  value={yearTo}
                  onChange={(e) => setYearTo(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '8px',
                    border: '1px solid #d1d5db',
                    borderRadius: '4px',
                    fontSize: '14px'
                  }}
                />
              </div>

              {/* Sort Options */}
              <div>
                <label style={{ display: 'block', marginBottom: '5px', fontSize: '14px', fontWeight: '500' }}>
                  Sort By
                </label>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '8px',
                    border: '1px solid #d1d5db',
                    borderRadius: '4px',
                    fontSize: '14px'
                  }}
                >
                  <option value="createdAt">Date Added</option>
                  <option value="title">Title</option>
                  <option value="author">Author</option>
                  <option value="year">Year</option>
                  <option value="status">Status</option>
                </select>
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: '5px', fontSize: '14px', fontWeight: '500' }}>
                  Order
                </label>
                <select
                  value={sortOrder}
                  onChange={(e) => setSortOrder(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '8px',
                    border: '1px solid #d1d5db',
                    borderRadius: '4px',
                    fontSize: '14px'
                  }}
                >
                  <option value="desc">Descending</option>
                  <option value="asc">Ascending</option>
                </select>
              </div>
            </div>
          )}
        </div>

        {/* Add/Edit Form */}
        {showForm && (
          <div style={{
            backgroundColor: 'white',
            padding: '20px',
            marginBottom: '20px',
            borderRadius: '8px',
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h2 style={{ fontSize: '20px', fontWeight: 'bold', color: '#1f2937', margin: 0 }}>
                {editingBook ? 'Edit Book' : 'Add New Book'}
              </h2>
              <button
                type="button"
                onClick={() => setShowBookLookup(true)}
                style={{
                  backgroundColor: '#10b981',
                  color: 'white',
                  padding: '8px 16px',
                  border: 'none',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  fontSize: '14px',
                  fontWeight: '500'
                }}
              >
                <ExternalLink size={16} />
                Lookup Book Details
              </button>
            </div>
            <form onSubmit={handleSubmit}>
              {/* Basic Information */}
              <div style={{ marginBottom: '20px' }}>
                <h3 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '15px', color: '#374151' }}>
                  Basic Information
                </h3>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
                  {/* Title Input */}
                  <div>
                    <label style={{ display: 'block', marginBottom: '5px', fontSize: '14px', fontWeight: '500' }}>
                      Title *
                    </label>
                    <input
                      type="text"
                      name="title"
                      value={formData.title}
                      onChange={handleInputChange}
                      required
                      style={{
                        width: '100%',
                        padding: '8px',
                        border: '1px solid #d1d5db',
                        borderRadius: '4px',
                        fontSize: '14px'
                      }}
                    />
                  </div>

                  {/* Author Input */}
                  <div>
                    <label style={{ display: 'block', marginBottom: '5px', fontSize: '14px', fontWeight: '500' }}>
                      Author *
                    </label>
                    <input
                      type="text"
                      name="author"
                      value={formData.author}
                      onChange={handleInputChange}
                      required
                      style={{
                        width: '100%',
                        padding: '8px',
                        border: '1px solid #d1d5db',
                        borderRadius: '4px',
                        fontSize: '14px'
                      }}
                    />
                  </div>

                  {/* Genre Input */}
                  <div>
                    <label style={{ display: 'block', marginBottom: '5px', fontSize: '14px', fontWeight: '500' }}>
                      Genre *
                    </label>
                    <input
                      type="text"
                      name="genre"
                      value={formData.genre}
                      onChange={handleInputChange}
                      required
                      style={{
                        width: '100%',
                        padding: '8px',
                        border: '1px solid #d1d5db',
                        borderRadius: '4px',
                        fontSize: '14px'
                      }}
                    />
                  </div>

                  {/* Year Input */}
                  <div>
                    <label style={{ display: 'block', marginBottom: '5px', fontSize: '14px', fontWeight: '500' }}>
                      Year *
                    </label>
                    <input
                      type="number"
                      name="year"
                      value={formData.year}
                      onChange={handleInputChange}
                      required
                      min="1000"
                      max="2100"
                      style={{
                        width: '100%',
                        padding: '8px',
                        border: '1px solid #d1d5db',
                        borderRadius: '4px',
                        fontSize: '14px'
                      }}
                    />
                  </div>

                  {/* ISBN Input */}
                  <div>
                    <label style={{ display: 'block', marginBottom: '5px', fontSize: '14px', fontWeight: '500' }}>
                      ISBN
                    </label>
                    <input
                      type="text"
                      name="isbn"
                      value={formData.isbn}
                      onChange={handleInputChange}
                      placeholder="978-0-123456-78-9"
                      style={{
                        width: '100%',
                        padding: '8px',
                        border: '1px solid #d1d5db',
                        borderRadius: '4px',
                        fontSize: '14px'
                      }}
                    />
                  </div>

                  {/* Status Select */}
                  <div>
                    <label style={{ display: 'block', marginBottom: '5px', fontSize: '14px', fontWeight: '500' }}>
                      Status *
                    </label>
                    <select
                      name="status"
                      value={formData.status}
                      onChange={handleInputChange}
                      required
                      style={{
                        width: '100%',
                        padding: '8px',
                        border: '1px solid #d1d5db',
                        borderRadius: '4px',
                        fontSize: '14px'
                      }}
                    >
                      <option value="to-read">To Read</option>
                      <option value="reading">Reading</option>
                      <option value="read">Read</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Book Details */}
              <div style={{ marginBottom: '20px' }}>
                <h3 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '15px', color: '#374151' }}>
                  Book Details
                </h3>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
                  {/* Page Count */}
                  <div>
                    <label style={{ display: 'block', marginBottom: '5px', fontSize: '14px', fontWeight: '500' }}>
                      Page Count
                    </label>
                    <input
                      type="number"
                      name="pageCount"
                      value={formData.pageCount}
                      onChange={handleInputChange}
                      min="0"
                      style={{
                        width: '100%',
                        padding: '8px',
                        border: '1px solid #d1d5db',
                        borderRadius: '4px',
                        fontSize: '14px'
                      }}
                    />
                  </div>

                  {/* Current Page */}
                  <div>
                    <label style={{ display: 'block', marginBottom: '5px', fontSize: '14px', fontWeight: '500' }}>
                      Current Page
                    </label>
                    <input
                      type="number"
                      name="currentPage"
                      value={formData.currentPage}
                      onChange={handleInputChange}
                      min="0"
                      style={{
                        width: '100%',
                        padding: '8px',
                        border: '1px solid #d1d5db',
                        borderRadius: '4px',
                        fontSize: '14px'
                      }}
                    />
                  </div>

                  {/* Rating */}
                  <div>
                    <label style={{ display: 'block', marginBottom: '5px', fontSize: '14px', fontWeight: '500' }}>
                      Rating (1-5)
                    </label>
                    <input
                      type="number"
                      name="rating"
                      value={formData.rating}
                      onChange={handleInputChange}
                      min="1"
                      max="5"
                      style={{
                        width: '100%',
                        padding: '8px',
                        border: '1px solid #d1d5db',
                        borderRadius: '4px',
                        fontSize: '14px'
                      }}
                    />
                  </div>

                  {/* Cover Image URL */}
                  <div>
                    <label style={{ display: 'block', marginBottom: '5px', fontSize: '14px', fontWeight: '500' }}>
                      Cover Image URL
                    </label>
                    <input
                      type="url"
                      name="coverImage"
                      value={formData.coverImage}
                      onChange={handleInputChange}
                      placeholder="https://example.com/cover.jpg"
                      style={{
                        width: '100%',
                        padding: '8px',
                        border: '1px solid #d1d5db',
                        borderRadius: '4px',
                        fontSize: '14px'
                      }}
                    />
                  </div>
                </div>

                {/* Description */}
                <div style={{ marginTop: '15px' }}>
                  <label style={{ display: 'block', marginBottom: '5px', fontSize: '14px', fontWeight: '500' }}>
                    Description
                  </label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    rows={3}
                    placeholder="Enter book description..."
                    style={{
                      width: '100%',
                      padding: '8px',
                      border: '1px solid #d1d5db',
                      borderRadius: '4px',
                      fontSize: '14px',
                      resize: 'vertical'
                    }}
                  />
                </div>
              </div>

              {/* Reading Dates */}
              <div style={{ marginBottom: '20px' }}>
                <h3 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '15px', color: '#374151' }}>
                  Reading Dates
                </h3>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '15px' }}>
                  {/* Start Date */}
                  <div>
                    <label style={{ display: 'block', marginBottom: '5px', fontSize: '14px', fontWeight: '500' }}>
                      Start Date
                    </label>
                    <input
                      type="date"
                      name="startDate"
                      value={formData.startDate}
                      onChange={handleInputChange}
                      style={{
                        width: '100%',
                        padding: '8px',
                        border: '1px solid #d1d5db',
                        borderRadius: '4px',
                        fontSize: '14px'
                      }}
                    />
                  </div>

                  {/* Finish Date */}
                  <div>
                    <label style={{ display: 'block', marginBottom: '5px', fontSize: '14px', fontWeight: '500' }}>
                      Finish Date
                    </label>
                    <input
                      type="date"
                      name="finishDate"
                      value={formData.finishDate}
                      onChange={handleInputChange}
                      style={{
                        width: '100%',
                        padding: '8px',
                        border: '1px solid #d1d5db',
                        borderRadius: '4px',
                        fontSize: '14px'
                      }}
                    />
                  </div>

                  {/* Publication Date */}
                  <div>
                    <label style={{ display: 'block', marginBottom: '5px', fontSize: '14px', fontWeight: '500' }}>
                      Publication Date
                    </label>
                    <input
                      type="date"
                      name="publicationDate"
                      value={formData.publicationDate}
                      onChange={handleInputChange}
                      style={{
                        width: '100%',
                        padding: '8px',
                        border: '1px solid #d1d5db',
                        borderRadius: '4px',
                        fontSize: '14px'
                      }}
                    />
                  </div>
                </div>
              </div>

              {/* Form Buttons */}
              <div style={{ display: 'flex', gap: '10px' }}>
                <button
                  type="submit"
                  style={{
                    backgroundColor: '#10b981',
                    color: 'white',
                    padding: '10px 20px',
                    border: 'none',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    fontSize: '14px',
                    fontWeight: '500'
                  }}
                >
                  {editingBook ? 'Update Book' : 'Add Book'}
                </button>
                <button
                  type="button"
                  onClick={resetForm}
                  style={{
                    backgroundColor: '#6b7280',
                    color: 'white',
                    padding: '10px 20px',
                    border: 'none',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    fontSize: '14px',
                    fontWeight: '500'
                  }}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Books List */}
        <div style={{
          backgroundColor: 'white',
          padding: '20px',
          borderRadius: '8px',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
        }}>
          <h2 style={{ fontSize: '20px', fontWeight: 'bold', marginBottom: '20px', color: '#1f2937' }}>
            My Books ({books.length})
          </h2>

          {/* Display message if no books */}
          {books.length === 0 ? (
            <p style={{ textAlign: 'center', color: '#6b7280', padding: '40px' }}>
              No books yet. Click "Add Book" to get started!
            </p>
          ) : (
            // Books Grid Layout
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: '20px' }}>
              {books.map((book) => (
                <div key={book._id} style={{
                  backgroundColor: '#f9fafb',
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px',
                  padding: '20px',
                  position: 'relative'
                }}>
                  {/* Book Cover */}
                  {book.coverImage && (
                    <div style={{ textAlign: 'center', marginBottom: '15px' }}>
                      <img
                        src={book.coverImage}
                        alt={`${book.title} cover`}
                        style={{
                          width: '120px',
                          height: '180px',
                          objectFit: 'cover',
                          borderRadius: '4px',
                          boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
                        }}
                        onError={(e) => {
                          e.currentTarget.style.display = 'none';
                        }}
                      />
                    </div>
                  )}

                  {/* Book Title */}
                  <h3 style={{ 
                    fontSize: '18px', 
                    fontWeight: '600', 
                    marginBottom: '8px', 
                    color: '#1f2937',
                    lineHeight: '1.3'
                  }}>
                    {book.title}
                  </h3>

                  {/* Author */}
                  <p style={{ 
                    fontSize: '14px', 
                    color: '#6b7280', 
                    marginBottom: '10px',
                    fontStyle: 'italic'
                  }}>
                    by {book.author}
                  </p>

                  {/* Book Details */}
                  <div style={{ marginBottom: '15px' }}>
                    <div style={{ display: 'flex', gap: '15px', marginBottom: '8px' }}>
                      <span style={{ fontSize: '12px', color: '#6b7280' }}>
                        <strong>Genre:</strong> {book.genre}
                      </span>
                      <span style={{ fontSize: '12px', color: '#6b7280' }}>
                        <strong>Year:</strong> {book.year}
                      </span>
                    </div>
                    
                    {book.isbn && (
                      <div style={{ fontSize: '12px', color: '#6b7280', marginBottom: '8px' }}>
                        <strong>ISBN:</strong> {book.isbn}
                      </div>
                    )}

                    {book.pageCount && (
                      <div style={{ fontSize: '12px', color: '#6b7280', marginBottom: '8px' }}>
                        <strong>Pages:</strong> {book.pageCount}
                      </div>
                    )}

                    {book.rating && (
                      <div style={{ display: 'flex', alignItems: 'center', gap: '5px', marginBottom: '8px' }}>
                        <span style={{ fontSize: '12px', color: '#6b7280' }}>
                          <strong>Rating:</strong>
                        </span>
                        <div style={{ display: 'flex', gap: '2px' }}>
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              size={12}
                              fill={i < book.rating! ? '#fbbf24' : '#e5e7eb'}
                              color={i < book.rating! ? '#fbbf24' : '#e5e7eb'}
                            />
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Reading Progress */}
                  {book.status === 'reading' && book.pageCount && book.currentPage !== undefined && (
                    <div style={{ marginBottom: '15px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px' }}>
                        <span style={{ fontSize: '12px', color: '#6b7280' }}>
                          Progress: {book.currentPage} / {book.pageCount}
                        </span>
                        <span style={{ fontSize: '12px', color: '#6b7280' }}>
                          {Math.round((book.currentPage / book.pageCount) * 100)}%
                        </span>
                      </div>
                      <div style={{
                        width: '100%',
                        height: '6px',
                        backgroundColor: '#e5e7eb',
                        borderRadius: '3px',
                        overflow: 'hidden'
                      }}>
                        <div style={{
                          width: `${(book.currentPage / book.pageCount) * 100}%`,
                          height: '100%',
                          backgroundColor: '#3b82f6',
                          transition: 'width 0.3s ease'
                        }} />
                      </div>
                      <div style={{ marginTop: '8px', display: 'flex', gap: '5px' }}>
                        <input
                          type="number"
                          placeholder="Page"
                          min="0"
                          max={book.pageCount}
                          style={{
                            width: '60px',
                            padding: '4px 6px',
                            border: '1px solid #d1d5db',
                            borderRadius: '4px',
                            fontSize: '12px'
                          }}
                          onKeyPress={(e) => {
                            if (e.key === 'Enter') {
                              const target = e.target as HTMLInputElement;
                              const page = parseInt(target.value);
                              if (page >= 0 && page <= book.pageCount!) {
                                handleProgressUpdate(book._id, page);
                                target.value = '';
                              }
                            }
                          }}
                        />
                        <button
                          onClick={() => {
                            const input = document.querySelector(`input[placeholder="Page"]`) as HTMLInputElement;
                            const page = parseInt(input.value);
                            if (page >= 0 && page <= book.pageCount!) {
                              handleProgressUpdate(book._id, page);
                              input.value = '';
                            }
                          }}
                          style={{
                            backgroundColor: '#10b981',
                            color: 'white',
                            padding: '4px 8px',
                            border: 'none',
                            borderRadius: '4px',
                            cursor: 'pointer',
                            fontSize: '12px'
                          }}
                        >
                          Update
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Status and Quick Actions */}
                  <div style={{ marginBottom: '15px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
                      <span style={{
                        padding: '4px 8px',
                        borderRadius: '4px',
                        fontSize: '12px',
                        fontWeight: '500',
                        backgroundColor:
                          book.status === 'read' ? '#d1fae5' :
                          book.status === 'reading' ? '#dbeafe' : '#fee2e2',
                        color:
                          book.status === 'read' ? '#065f46' :
                          book.status === 'reading' ? '#1e40af' : '#991b1b'
                      }}>
                        {book.status === 'to-read' ? 'To Read' :
                         book.status === 'reading' ? 'Reading' : 'Read'}
                      </span>

                      {/* Quick Status Buttons */}
                      <div style={{ display: 'flex', gap: '5px' }}>
                        {book.status !== 'to-read' && (
                          <button
                            onClick={() => handleQuickStatusUpdate(book._id, 'to-read')}
                            style={{
                              backgroundColor: '#f3f4f6',
                              color: '#374151',
                              padding: '4px 8px',
                              border: 'none',
                              borderRadius: '4px',
                              cursor: 'pointer',
                              fontSize: '10px',
                              display: 'flex',
                              alignItems: 'center',
                              gap: '2px'
                            }}
                          >
                            <EyeOff size={10} />
                            To Read
                          </button>
                        )}
                        {book.status !== 'reading' && (
                          <button
                            onClick={() => handleQuickStatusUpdate(book._id, 'reading')}
                            style={{
                              backgroundColor: '#dbeafe',
                              color: '#1e40af',
                              padding: '4px 8px',
                              border: 'none',
                              borderRadius: '4px',
                              cursor: 'pointer',
                              fontSize: '10px',
                              display: 'flex',
                              alignItems: 'center',
                              gap: '2px'
                            }}
                          >
                            <BookMarked size={10} />
                            Reading
                          </button>
                        )}
                        {book.status !== 'read' && (
                          <button
                            onClick={() => handleQuickStatusUpdate(book._id, 'read')}
                            style={{
                              backgroundColor: '#d1fae5',
                              color: '#065f46',
                              padding: '4px 8px',
                              border: 'none',
                              borderRadius: '4px',
                              cursor: 'pointer',
                              fontSize: '10px',
                              display: 'flex',
                              alignItems: 'center',
                              gap: '2px'
                            }}
                          >
                            <Eye size={10} />
                            Read
                          </button>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Description */}
                  {book.description && (
                    <div style={{ marginBottom: '15px' }}>
                      <p style={{
                        fontSize: '12px',
                        color: '#6b7280',
                        lineHeight: '1.4',
                        maxHeight: '60px',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis'
                      }}>
                        {book.description}
                      </p>
                    </div>
                  )}

                  {/* Reading Dates */}
                  {(book.startDate || book.finishDate) && (
                    <div style={{ marginBottom: '15px' }}>
                      {book.startDate && (
                        <div style={{ fontSize: '11px', color: '#6b7280', marginBottom: '2px' }}>
                          <Calendar size={10} style={{ display: 'inline', marginRight: '4px' }} />
                          Started: {new Date(book.startDate).toLocaleDateString()}
                        </div>
                      )}
                      {book.finishDate && (
                        <div style={{ fontSize: '11px', color: '#6b7280' }}>
                          <Calendar size={10} style={{ display: 'inline', marginRight: '4px' }} />
                          Finished: {new Date(book.finishDate).toLocaleDateString()}
                        </div>
                      )}
                    </div>
                  )}

                  {/* Action Buttons */}
                  <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                    <button
                      onClick={() => handleEdit(book)}
                      style={{
                        backgroundColor: '#3b82f6',
                        color: 'white',
                        padding: '6px 12px',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px',
                        fontSize: '12px'
                      }}
                    >
                      <Edit2 size={12} />
                      Edit
                    </button>
                    <button
                      onClick={() => handleDeleteClick(book._id)}
                      style={{
                        backgroundColor: '#ef4444',
                        color: 'white',
                        padding: '6px 12px',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px',
                        fontSize: '12px'
                      }}
                    >
                      <Trash2 size={12} />
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      <ConfirmModal
          isOpen={isModalOpen}
          title="Confirm Delete"
          message="Are you sure you want to delete this book?"
          onConfirm={handleConfirmDelete}
          onCancel={handleCancelDelete}
        />
      
      {showBookLookup && (
        <BookCoverLookup
          onBookFound={handleBookLookupResult}
          onClose={() => setShowBookLookup(false)}
        />
      )}
    </div>
  );
}

export default App;
