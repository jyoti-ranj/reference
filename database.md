# Database Requirements

## Overview
You need to implement a database for the Todo List application. You can choose either MongoDB or PostgreSQL based on your preference and experience.

## Schema Requirements

Your database schema should include at least the following models/tables:

### Users
- User ID (unique identifier)
- Username (unique)
- Created/Updated timestamps

### Todos
- Todo ID (unique identifier)
- Title (required)
- Description (optional)
- Priority (low, medium, high)
- Completed status (boolean)
- User ID (who created the todo)
- Created/Updated timestamps

### Tags
Implement a way to associate tags with todos. 

### User Assignments
Implement a way to assign users to todos:


### Notes
Implement a way to add notes to todos:

## Performance Considerations

1. **Indexing**
   - Create appropriate indexes for frequently queried fields
   - For MongoDB: Index the user field, tags, priority, and completed status
   - For PostgreSQL: Index foreign keys and fields used in WHERE clauses

2. **Query Optimization**
   - Implement efficient queries for retrieving todos with filters
   - Consider using database features for pagination and sorting

## Implementation Requirements

1. **Initial Data**
   - Create at least 5 different users in your database setup
   - Add a few sample todos for demonstration

2. **Pagination**
   - Implement database-level pagination for retrieving todos
   - Support both offset-based (SQL) or cursor-based (MongoDB) pagination

3. **Filtering and Sorting**
   - Support filtering todos by various criteria (tags, priority, completion status)
   - Support sorting todos by different fields

## Sample Schema Examples

### MongoDB Example

```javascript
// User Schema
{
  _id: ObjectId,
  username: String,
  email: String,
  createdAt: Date,
  updatedAt: Date
}

// Todo Schema
{
  _id: ObjectId,
  title: String,
  description: String,
  priority: String,  // "low", "medium", "high"
  completed: Boolean,
  user: ObjectId,    // Reference to User
  tags: [String],
  assignedUsers: [String],  // Usernames of assigned users
  notes: [
    {
      content: String,
      createdAt: Date
    }
  ],
  createdAt: Date,
  updatedAt: Date
}
```

### PostgreSQL Example

```sql
-- Users table
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  username VARCHAR(50) UNIQUE NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Todos table
CREATE TABLE todos (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  priority VARCHAR(10) CHECK (priority IN ('low', 'medium', 'high')) DEFAULT 'medium',
  completed BOOLEAN DEFAULT FALSE,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tags table
CREATE TABLE tags (
  id SERIAL PRIMARY KEY,
  name VARCHAR(50) UNIQUE NOT NULL
);

-- Todo-Tags junction table
CREATE TABLE todo_tags (
  todo_id INTEGER REFERENCES todos(id) ON DELETE CASCADE,
  tag_id INTEGER REFERENCES tags(id) ON DELETE CASCADE,
  PRIMARY KEY (todo_id, tag_id)
);

-- Todo-Users (assignments) junction table
CREATE TABLE todo_users (
  todo_id INTEGER REFERENCES todos(id) ON DELETE CASCADE,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  PRIMARY KEY (todo_id, user_id)
);

-- Notes table
CREATE TABLE notes (
  id SERIAL PRIMARY KEY,
  content TEXT NOT NULL,
  todo_id INTEGER REFERENCES todos(id) ON DELETE CASCADE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
``` 