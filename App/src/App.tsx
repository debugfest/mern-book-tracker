// Import React hooks for state management and side effects
import { useState, useEffect } from 'react';
import { Plus, CreditCard as Edit2, Trash2, BookOpen } from 'lucide-react';

// Define TypeScript interface for Book object
interface Book {
  _id: string;
  title: string;
  author: string;
  genre: string;
  year: number;
  status: 'read' | 'reading' | 'to-read';
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
    status: 'to-read' as 'read' | 'reading' | 'to-read'
  });

  // Backend API URL
  const API_URL = 'http://localhost:5000/api';

  // Fetch all books when component mounts
  useEffect(() => {
    fetchBooks();
  }, []);

  // Function to fetch all books from backend
  const fetchBooks = async () => {
    try {
      const response = await fetch(`${API_URL}/books`);
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
      [name]: name === 'year' ? parseInt(value) : value
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
      status: book.status
    });
    setShowForm(true);
  };

  // Handle delete button click
  const handleDelete = async (id: string) => {
    // Confirm before deleting
    if (!confirm('Are you sure you want to delete this book?')) {
      return;
    }

    try {
      const response = await fetch(`${API_URL}/books/${id}`, {
        method: 'DELETE'
      });

      if (response.ok) {
        alert('Book deleted successfully!');
        fetchBooks();
      }
    } catch (error) {
      console.error('Error deleting book:', error);
      alert('Failed to delete book');
    }
  };

  // Reset form to initial state
  const resetForm = () => {
    setFormData({
      title: '',
      author: '',
      genre: '',
      year: new Date().getFullYear(),
      status: 'to-read'
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

        {/* Add/Edit Form */}
        {showForm && (
          <div style={{
            backgroundColor: 'white',
            padding: '20px',
            marginBottom: '20px',
            borderRadius: '8px',
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
          }}>
            <h2 style={{ fontSize: '20px', fontWeight: 'bold', marginBottom: '20px', color: '#1f2937' }}>
              {editingBook ? 'Edit Book' : 'Add New Book'}
            </h2>
            <form onSubmit={handleSubmit}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginBottom: '15px' }}>
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
              </div>

              {/* Status Select */}
              <div style={{ marginBottom: '20px' }}>
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
            // Books Table
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ backgroundColor: '#f9fafb', borderBottom: '2px solid #e5e7eb' }}>
                  <th style={{ padding: '12px', textAlign: 'left', fontSize: '14px', fontWeight: '600', color: '#374151' }}>
                    Title
                  </th>
                  <th style={{ padding: '12px', textAlign: 'left', fontSize: '14px', fontWeight: '600', color: '#374151' }}>
                    Author
                  </th>
                  <th style={{ padding: '12px', textAlign: 'left', fontSize: '14px', fontWeight: '600', color: '#374151' }}>
                    Genre
                  </th>
                  <th style={{ padding: '12px', textAlign: 'left', fontSize: '14px', fontWeight: '600', color: '#374151' }}>
                    Year
                  </th>
                  <th style={{ padding: '12px', textAlign: 'left', fontSize: '14px', fontWeight: '600', color: '#374151' }}>
                    Status
                  </th>
                  <th style={{ padding: '12px', textAlign: 'center', fontSize: '14px', fontWeight: '600', color: '#374151' }}>
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {/* Map through books array and display each book */}
                {books.map((book) => (
                  <tr key={book._id} style={{ borderBottom: '1px solid #e5e7eb' }}>
                    <td style={{ padding: '12px', fontSize: '14px', color: '#1f2937' }}>
                      {book.title}
                    </td>
                    <td style={{ padding: '12px', fontSize: '14px', color: '#1f2937' }}>
                      {book.author}
                    </td>
                    <td style={{ padding: '12px', fontSize: '14px', color: '#1f2937' }}>
                      {book.genre}
                    </td>
                    <td style={{ padding: '12px', fontSize: '14px', color: '#1f2937' }}>
                      {book.year}
                    </td>
                    <td style={{ padding: '12px', fontSize: '14px' }}>
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
                    </td>
                    <td style={{ padding: '12px', textAlign: 'center' }}>
                      <div style={{ display: 'flex', gap: '8px', justifyContent: 'center' }}>
                        {/* Edit Button */}
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
                          <Edit2 size={14} />
                          Edit
                        </button>
                        {/* Delete Button */}
                        <button
                          onClick={() => handleDelete(book._id)}
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
                          <Trash2 size={14} />
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
