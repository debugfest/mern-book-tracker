# Book Tracker Application

A simple MERN stack application to manage your book collection.

## Project Structure

```
project/
├── server/              # Backend (Node.js + Express + MongoDB)
│   ├── models/          # Mongoose models
│   ├── routes/          # API routes
│   ├── .env             # Environment variables
│   ├── server.js        # Main server file
│   └── package.json     # Backend dependencies
│
├── src/                 # Frontend (React + TypeScript)
│   └── App.tsx          # Main React component
│
└── package.json         # Frontend dependencies
```

## Setup Instructions

### 1. Install Backend Dependencies

```bash
cd server
npm install
```

### 2. Install Frontend Dependencies

```bash
# From project root
npm install
```

### 3. Start Backend Server

```bash
cd server
npm start
```

The backend server will run on `http://localhost:5000`

### 4. Start Frontend Development Server

```bash
# From project root (in a new terminal)
npm run dev
```

The frontend will run on `http://localhost:5173` (or another port if 5173 is busy)

## Features

- **Add Books**: Add new books with title, author, genre, year, and reading status
- **View Books**: See all your books in a table format
- **Edit Books**: Update book information
- **Delete Books**: Remove books from your collection
- **Reading Status**: Track books as "To Read", "Reading", or "Read"

## API Endpoints

- `GET /api/books` - Get all books
- `POST /api/books` - Create a new book
- `PUT /api/books/:id` - Update a book by ID
- `DELETE /api/books/:id` - Delete a book by ID

## Technologies Used

- **Frontend**: React, TypeScript, Lucide React (icons)
- **Backend**: Node.js, Express.js
- **Database**: MongoDB (using Mongoose)
- **Styling**: Inline CSS

## Notes

- This application is NOT mobile responsive (as per requirements)
- MongoDB connection URI is stored in `server/.env`
- All code includes comments explaining the logic
