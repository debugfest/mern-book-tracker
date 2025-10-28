import React, { useState } from 'react';
import { Search, BookOpen } from 'lucide-react';

interface BookCoverLookupProps {
  onBookFound: (bookData: {
    title: string;
    author: string;
    isbn: string;
    pageCount: number;
    description: string;
    coverImage: string;
    publicationDate: string;
  }) => void;
  onClose: () => void;
}

const BookCoverLookup: React.FC<BookCoverLookupProps> = ({ onBookFound, onClose }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState<any[]>([]);

  const searchBooks = async () => {
    if (!searchTerm.trim()) return;

    setIsLoading(true);
    try {
      // Using Google Books API (free, no API key required for basic searches)
      const response = await fetch(
        `https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(searchTerm)}&maxResults=10`
      );
      const data = await response.json();
      setResults(data.items || []);
    } catch (error) {
      console.error('Error searching books:', error);
      alert('Failed to search books. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleBookSelect = (book: any) => {
    const volumeInfo = book.volumeInfo;
    const isbn = volumeInfo.industryIdentifiers?.find((id: any) => id.type === 'ISBN_13')?.identifier ||
                 volumeInfo.industryIdentifiers?.find((id: any) => id.type === 'ISBN_10')?.identifier || '';

    onBookFound({
      title: volumeInfo.title || '',
      author: volumeInfo.authors?.join(', ') || '',
      isbn: isbn,
      pageCount: volumeInfo.pageCount || 0,
      description: volumeInfo.description || '',
      coverImage: volumeInfo.imageLinks?.thumbnail?.replace('http:', 'https:') || '',
      publicationDate: volumeInfo.publishedDate || ''
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg p-6 w-96 max-h-[80vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Find Book Details</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            ×
          </button>
        </div>

        <div className="mb-4">
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="Search for a book..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && searchBooks()}
              className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              onClick={searchBooks}
              disabled={isLoading || !searchTerm.trim()}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              <Search size={16} />
              {isLoading ? 'Searching...' : 'Search'}
            </button>
          </div>
        </div>

        {results.length > 0 && (
          <div className="space-y-3">
            <h3 className="font-semibold text-gray-700">Search Results:</h3>
            {results.map((book, index) => (
              <div
                key={index}
                onClick={() => handleBookSelect(book)}
                className="flex gap-3 p-3 border border-gray-200 rounded-md hover:bg-gray-50 cursor-pointer"
              >
                {book.volumeInfo.imageLinks?.thumbnail && (
                  <img
                    src={book.volumeInfo.imageLinks.thumbnail.replace('http:', 'https:')}
                    alt={book.volumeInfo.title}
                    className="w-12 h-16 object-cover rounded"
                  />
                )}
                <div className="flex-1">
                  <h4 className="font-medium text-sm line-clamp-2">
                    {book.volumeInfo.title}
                  </h4>
                  <p className="text-xs text-gray-600">
                    by {book.volumeInfo.authors?.join(', ')}
                  </p>
                  <p className="text-xs text-gray-500">
                    {book.volumeInfo.publishedDate} • {book.volumeInfo.pageCount} pages
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}

        {results.length === 0 && !isLoading && searchTerm && (
          <div className="text-center text-gray-500 py-8">
            <BookOpen size={48} className="mx-auto mb-2 text-gray-300" />
            <p>No books found. Try a different search term.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default BookCoverLookup;
