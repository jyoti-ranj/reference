# Full-Stack Todo List Application

## Overview
This is a full-stack Todo List application developed as part of an SDE-1 Fullstack assessment.  
The application allows users to manage todos with features including tagging, priority levels, user mentions, notes, pagination, filtering, sorting, and optional export functionality.

---

## Tech Stack
- **Backend:** Node.js, Express.js, MongoDB (Mongoose ODM)
- **Frontend:** React.js (JavaScript)
- **Other:** dotenv for environment variables, CORS middleware for cross-origin requests

---

## Features
- Create, read, update, and delete todos
- Tag users using `@username` mentions
- Assign priority levels: High, Medium, Low
- Add notes to todos
- Filter todos by tag, priority, or assigned user
- Sort todos by creation date or priority
- Pagination support for efficient list viewing
- Export todos as JSON or CSV (optional)
- User management with pre-created users for validation (optional)

---

## Setup and Installation

### Prerequisites
- Node.js (v14+ recommended)
- npm (comes with Node.js)
- MongoDB instance (local or cloud-based like MongoDB Atlas)

---

### Backend Setup

1. Navigate to the backend folder (if backend and frontend are separate):
   ```bash
   cd backend
