# Backend Requirements

## Overview
You need to implement a backend API for the Todo List application. You can choose one of the following technologies:
- Next.js
- Node.js (Express)
- Flask (Python)

## API Endpoints

Your backend should implement the following RESTful API endpoints:

### User Endpoints

1. **GET /api/users**
   - Get all users
   - This will be used for user switching in the frontend

### Todo Endpoints

1. **GET /api/todos**
   - Get all todos for the current user
   - Support query parameters for pagination, filtering, and sorting

2. **GET /api/todos/:id**
   - Get a specific todo by ID
   - Return detailed information including tags, notes, and assigned users

3. **POST /api/todos**
   - Create a new todo
   - Validate required fields (title)
   - Associate with the current user

4. **PUT /api/todos/:id**
   - Update an existing todo
   - Support partial updates

5. **DELETE /api/todos/:id**
   - Delete a todo

### Note Endpoints

1. **POST /api/todos/:id/notes**
   - Add a note to a specific todo

### Export Endpoint

1. **GET /api/todos/export**
   - Export all todos for the current user
   - Support different formats (JSON, CSV)

## Implementation Requirements

1. **User Management**
   - Pre-create at least 5 different users in your database
   - Implement endpoints to retrieve user information
   - For a real application, you would include authentication, but for this assessment, you can simplify by:
     - Using a request header or query parameter to specify the current user
     - Example: `/api/todos?user=john`

2. **Input Validation**
   - Validate incoming request data
   - Return appropriate error messages for invalid inputs

3. **Error Handling**
   - Implement proper error handling for all endpoints
   - Use appropriate HTTP status codes
   - Return meaningful error messages

4. **API Documentation**
   - Document your API endpoints
   - Specify request/response formats and parameters

## Sample API Responses

### Sample Todo Response

```json
{
  "id": "1",
  "title": "Complete the todo app",
  "description": "Finish implementing all required features",
  "priority": "high",
  "completed": false,
  "tags": ["work", "coding"],
  "assignedUsers": ["@john", "@sarah"],
  "notes": [
    {
      "content": "Remember to add proper error handling",
      "date": "2023-05-10"
    }
  ],
  "createdAt": "2023-05-01T12:00:00Z",
  "updatedAt": "2023-05-10T14:30:00Z"
}
```

### Sample User Response

```json
{
  "id": "1",
  "username": "john_doe",
  "email": "john@example.com"
}
```
