const Todo = require('../models/todoModel');
const User = require('../models/userModel');

// GET /api/todos?user=username
exports.getTodos = async (req, res) => {
  const { user, tag, priority, completed, sortBy, order = 'asc', page = 1, limit = 10 } = req.query;

  try {
    const userObj = await User.findOne({ username: user });
    if (!userObj) return res.status(404).json({ message: 'User not found' });

    const filters = { user: userObj._id };
    if (tag) filters.tags = tag;
    if (priority) filters.priority = priority;
    if (completed) filters.completed = completed === 'true';

    const todos = await Todo.find(filters)
      .sort({ [sortBy || 'createdAt']: order === 'desc' ? -1 : 1 })
      .skip((page - 1) * limit)
      .limit(parseInt(limit));

    res.status(200).json(todos);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching todos', error: error.message });
  }
};

// GET /api/todos/:id
exports.getTodoById = async (req, res) => {
  try {
    const todo = await Todo.findById(req.params.id);
    if (!todo) return res.status(404).json({ message: 'Todo not found' });
    res.status(200).json(todo);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching todo', error: error.message });
  }
};

// POST /api/todos
exports.createTodo = async (req, res) => {
  try {
    const { title, description, priority, tags, assignedUsers, user } = req.body;

    const userObj = await User.findOne({ username: user });
    if (!userObj) return res.status(404).json({ message: 'User not found' });

    const newTodo = new Todo({
      title,
      description,
      priority,
      tags,
      assignedUsers,
      user: userObj._id,
    });

    const savedTodo = await newTodo.save();
    res.status(201).json(savedTodo);
  } catch (error) {
    res.status(400).json({ message: 'Error creating todo', error: error.message });
  }
};

// PUT /api/todos/:id
exports.updateTodo = async (req, res) => {
  try {
    const updatedTodo = await Todo.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!updatedTodo) return res.status(404).json({ message: 'Todo not found' });
    res.status(200).json(updatedTodo);
  } catch (error) {
    res.status(400).json({ message: 'Error updating todo', error: error.message });
  }
};

// DELETE /api/todos/:id
exports.deleteTodo = async (req, res) => {
  try {
    const deleted = await Todo.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: 'Todo not found' });
    res.status(200).json({ message: 'Todo deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting todo', error: error.message });
  }
};

// POST /api/todos/:id/notes
exports.addNoteToTodo = async (req, res) => {
  try {
    const { content } = req.body;
    const todo = await Todo.findById(req.params.id);
    if (!todo) return res.status(404).json({ message: 'Todo not found' });

    todo.notes.push({ content });
    await todo.save();
    res.status(201).json(todo);
  } catch (error) {
    res.status(400).json({ message: 'Error adding note', error: error.message });
  }
};

// GET /api/todos/export
exports.exportTodos = async (req, res) => {
  try {
    const { user, format = 'json' } = req.query;
    const userObj = await User.findOne({ username: user });
    if (!userObj) return res.status(404).json({ message: 'User not found' });

    const todos = await Todo.find({ user: userObj._id });

    if (format === 'csv') {
      const csv = [
        ['Title', 'Description', 'Priority', 'Completed', 'Tags'].join(','),
        ...todos.map((todo) =>
          [
            todo.title,
            todo.description,
            todo.priority,
            todo.completed,
            todo.tags.join('|'),
          ].join(',')
        ),
      ].join('\n');
      res.header('Content-Type', 'text/csv');
      res.attachment('todos.csv');
      return res.send(csv);
    }

    res.status(200).json(todos);
  } catch (error) {
    res.status(500).json({ message: 'Error exporting todos', error: error.message });
  }
};
