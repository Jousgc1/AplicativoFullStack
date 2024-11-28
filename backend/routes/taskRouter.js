const express = require('express');
const { body, validationResult } = require('express-validator');
const router = express.Router();
const taskController = require('../controllers/taskController');

// Obtener todas las tareas
router.get('/tasks', taskController.getTasks);

// Crear una nueva tarea con validación
router.post('/tasks', [
  body('title').isString().escape(),
  body('description').isString().escape()
], (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  taskController.createTask(req, res);
});

// Actualizar una tarea con validación
router.put('/tasks/:id', [
  body('title').optional().isString().escape(),
  body('description').optional().isString().escape()
], (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  taskController.updateTask(req, res);
});

// Eliminar una tarea
router.delete('/tasks/:id', taskController.deleteTask);

module.exports = router;
