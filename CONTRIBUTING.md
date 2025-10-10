# Contributing to Book Tracker

Thank you for your interest in contributing to **Book Tracker**! 🎉  
We welcome contributions of all kinds — whether it's fixing bugs, adding features, improving documentation, or enhancing UI/UX.

---

## Table of Contents

1. [How to Contribute](#how-to-contribute)
2. [Project Structure](#project-structure)
3. [Development Setup](#development-setup)
4. [Code Style](#code-style)
5. [Reporting Issues](#reporting-issues)
6. [Submitting Pull Requests](#submitting-pull-requests)
7. [Additional Guidelines](#additional-guidelines)

---

## How to Contribute

1. **Fork the repository** to your GitHub account.
2. **Clone** your fork locally:

```bash
git clone https://github.com/your-username/book-tracker.git
cd book-tracker
```

3. **Create a new branch** for your feature or bugfix:

```shellscript
git checkout -b feature/my-new-feature
```

4. **Make your changes** and test them locally.
5. **Commit your changes** with clear messages:

```shellscript
git add .
git commit -m "Add feature: search books by author"
```

6. **Push your branch** to your fork:

```shellscript
git push origin feature/my-new-feature
```

7. **Open a Pull Request** from your branch to the main repository.

---

## Project Structure

```plaintext
book-tracker/
├── App/                    # Frontend application
│   └── src/               # React source files
│       ├── components/    # Reusable React components
│       ├── App.js        # Main App component
│       └── index.js      # Entry point
│
├── server/                # Backend application
│   ├── models/           # MongoDB/Mongoose models
│   ├── routes/           # Express API routes
│   ├── controllers/      # Route controllers
│   ├── config/           # Configuration files
│   └── server.js         # Server entry point
│
├── CONTRIBUTING.md
└── README.md
```

---

## Development Setup

### Prerequisites

- Node.js (v14 or higher)
- MongoDB (local or MongoDB Atlas)
- npm or yarn

### Backend Setup

1. Navigate to the server directory:

```shellscript
cd server
```

2. Install dependencies:

```shellscript
npm install
```

3. Create a `.env` file in the `server` directory:

```plaintext
PORT=5000
MONGODB_URI=mongodb_url
NODE_ENV=development
```

4. Start the backend server:

```shellscript
npm start
```

The server will run on `http://localhost:5000`

### Frontend Setup

1. Navigate to the App directory:

```shellscript
cd App
```

2. Install dependencies:

```shellscript
npm install
```

3. Start the development server:

```shellscript
npm start
```

The React app will run on `http://localhost:3000`

# 🛠️ Contributing to MERN Book Tracker

Thanks for wanting to contribute! This guide explains how to report issues, set up the project locally, and submit changes.

---

## 📋 Table of Contents

- [Code of Conduct](#code-of-conduct)
- [How to Contribute](#how-to-contribute)
- [Setting Up Locally](#setting-up-locally)
- [Making Changes](#making-changes)
- [Pull Request Process](#pull-request-process)

---



## 🚀 How to Contribute

We welcome:
- 🐛 Bug reports and fixes
- ✨ New features and UX improvements
- 📚 Documentation and examples
- ⚡ Performance improvements

For major changes, open an issue first to discuss with maintainers.

---

## ⚙️ Setting Up Locally

### 1. Fork & Clone
```bash
git clone https://github.com/<YOUR_USERNAME>/mern-book-tracker.git
cd mern-book-tracker
git remote add upstream https://github.com/contrifest/mern-book-tracker.git
```

### 2. Backend Setup
```bash
cd App/server
npm install
# Create .env file with:
# MONGODB_URI='your-mongodb-connection-string'
# PORT=5000
npm run dev
```
API available at: http://localhost:5000/api

### 3. Frontend Setup
```bash
cd App  # from repo root
npm install
npm run dev
```
App available at: http://localhost:5173

---

## 🌱 Making Changes

### Create Branch
```bash
git fetch upstream
git checkout -b feature/short-description
```

### Test Your Changes
- **Backend**: Test endpoints with curl/Postman
- **Frontend**: Run Vite and verify UI flows
- **Both**: Ensure no errors in console

### Stay Updated
```bash
git fetch upstream
git rebase upstream/main
```

---

## 🚢 Pull Request Process

### 1. Commit Guidelines
Use clear, imperative messages:
```
feat(api): add book search functionality
fix(ui): preserve form data after submit
docs: update setup instructions
```

### 2. Submit PR
```bash
git push origin feature/short-description
```

Open PR with:
- **Summary**: What changed and why
- **Issue Reference**: "Closes #123"
- **Testing**: How you tested the changes
- **Screenshots**: For UI changes

### 3. PR Checklist
- [ ] Follows project coding style
- [ ] Tested locally (backend + frontend)
- [ ] No sensitive data committed
- [ ] Documentation updated if needed

---

## 🐞 Reporting Issues

Include:
- **Summary**: Clear description
- **Steps**: How to reproduce
- **Expected vs Actual**: What should happen vs what happens
- **Environment**: OS, Node version, browser
- **Screenshots**: If applicable

---

## 🧪 Available Endpoints

- `GET /api/books` — Fetch all books
- `POST /api/books` — Create book (`{title, author, genre, year, status?}`)
- `PUT /api/books/:id` — Update book
- `DELETE /api/books/:id` — Delete book

---

## ❤️ Thank You

Every contribution helps make this project better! Small fixes, documentation improvements, and examples are perfect first contributions.

