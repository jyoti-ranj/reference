const express = require('express');
const {
  getTodos,
  getTodoById,
  createTodo,
  updateTodo,
  deleteTodo,
  addNoteToTodo,
  exportTodos
} = require('../controllers/todoController');

const router = express.Router();

router.get('/', getTodos);
router.get('/export', exportTodos);
router.get('/:id', getTodoById);
router.post('/', createTodo);
router.put('/:id', updateTodo);
router.delete('/:id', deleteTodo);
router.post('/:id/notes', addNoteToTodo);

module.exports = router;
