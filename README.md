# MERN Book Tracker

A minimal Book Tracker application built with the MERN stack (MongoDB, Express, React, Node). This repository contains a small, focused example you can run locally for learning, demos, or Hacktober contributions.

[![Node.js](https://img.shields.io/badge/Node.js-18+-brightgreen.svg)](https://nodejs.org/)
[![React](https://img.shields.io/badge/React-18-blue.svg)](https://reactjs.org/)
[![Vite](https://img.shields.io/badge/Vite-5.4.2-lightgrey.svg)](https://vitejs.dev/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-%2347A248.svg)](https://www.mongodb.com/)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

## 🌟 What it does

- Manage a personal collection of books (create, read, update, delete)
- Track reading status: `to-read`, `reading`, `read`
- Simple REST API consumed by a React + Vite frontend
- Persistent storage with MongoDB + Mongoose
- Tiny, easy-to-read codebase for quick contributions

## 🛠️ Technology

- Frontend: React + Vite + TypeScript
- Styling: Tailwind CSS (configured in project)
- Backend: Node.js + Express
- Database: MongoDB (Mongoose ODM)
- Dev tools: dotenv, ESLint, TypeScript typecheck

## 📋 Prerequisites

- Node.js 18+ and npm
- A MongoDB connection (MongoDB Atlas or local instance)

## 🚀 Quick Start

Follow these steps to set up the Book Tracker locally. This repo keeps both the frontend and backend under the `App/` folder. Start the backend API first, then the frontend.

### 1. Fork & Clone the Repository

First, fork the repository on GitHub, then clone your fork:

```bash
git clone https://github.com/YOUR-USERNAME/mern-book-tracker.git
cd mern-book-tracker
```

Alternatively, if you just want to run it locally without contributing:

```bash
git clone https://github.com/debugfest/mern-book-tracker.git
cd mern-book-tracker
```

### 2. Backend (API)

Open a terminal and run:

```bash
cd App/server
npm install
# Create a .env file in App/server with at least:
# MONGODB_URI='your-mongodb-connection-string'
# PORT=5000     # optional, defaults to 5000

# Start the server
npm run dev
```

By default the server listens on http://localhost:5000 and exposes the API under `/api`.

Available endpoints:

- GET /api/books — fetch all books (sorted newest first)
- POST /api/books — create a book (body: `{ title, author, genre, year, status? }`)
- PUT /api/books/:id — update a book by id
- DELETE /api/books/:id — delete a book by id

Example: create a book with curl

```bash
curl -X POST http://localhost:5000/api/books \
    -H "Content-Type: application/json" \
    -d '{"title":"Sapiens","author":"Yuval Noah Harari","genre":"History","year":2011}'
```

### 3. Frontend (React + Vite)

Open another terminal and run:

```bash
cd App
npm install
npm run dev
```

Vite will print the local dev URL (usually http://localhost:5173). Open it to use the app.

To build the frontend for production:

```bash
cd App
npm run build
```

You can deploy the frontend and backend separately, or optionally serve the built frontend from the Express server (requires adding a small static middleware to `App/server/server.js`).

## 📁 Project layout

```
mern-book-tracker/
├─ App/                      # Frontend + backend
│  ├─ src/                   # React + TypeScript app (Vite)
│  │  ├─ App.tsx
│  │  ├─ main.tsx
│  │  └─ index.css
│  ├─ server/                # Express API
│  │  ├─ models/Book.js      # Mongoose Book model
│  │  ├─ routes/bookRoutes.js# API routes (GET/POST/PUT/DELETE /api/books)
│  │  └─ server.js           # Express server and DB connection
│  └─ package.json           # Frontend deps & scripts (Vite)
├─ README.md                 # <-- this file
├─ CONTRIBUTING.md
└─ LICENSE
```

## 🧠 Data model

The `Book` model (`App/server/models/Book.js`) contains:

- `title` (String, required)
- `author` (String, required)
- `genre` (String, required)
- `year` (Number, required)
- `status` (String — enum: `read | reading | to-read`, default `to-read`)
- `createdAt` / `updatedAt` (timestamps added automatically)

## 🔒 Environment & security

- Keep your MongoDB connection string and other secrets out of version control. Add `App/server/.env` locally and never commit it.
- Example `App/server/.env`:

```env
MONGODB_URI='your-mongodb-connection-string'
PORT=5000
```

## 📦 Deployment notes

- Frontend: build with `cd App && npm run build` and deploy to Vercel, Netlify, or any static host.
- Backend: deploy `App/server` to any Node host (Render, Railway, Heroku-like) and set `MONGODB_URI` in the host's environment.
- To serve frontend from the backend, build the frontend then add Express static middleware to `server.js` and point unknown routes to `index.html`.

## 🤝 Contributing

Contributions are welcome. See `CONTRIBUTING.md` for guidelines. Quick contribution flow:

1. Fork the repo
2. Create a feature branch: `git checkout -b feature/awesome`
3. Commit changes: `git commit -m "Add awesome feature"`
4. Push and open a Pull Request

Please keep changes small and focused. Good first issues and documentation improvements are great places to start.

## ✅ Quality & scripts

- Frontend scripts are in `App/package.json` (dev, build, preview, lint, typecheck)
- Backend scripts are in `App/server/package.json` (start, dev)

Run linters and typecheck in the frontend as needed (`npm run lint`, `npm run typecheck`).

## 📄 License

This project is licensed under the MIT License — see the `LICENSE` file for details.

---

If this project helped you, please give it a star ⭐

Made with ❤️ by the project contributors
