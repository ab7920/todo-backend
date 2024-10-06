// index.js
const express = require('express');
const mongoose = require('mongoose');
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/todoapp';
const cors = require('cors');


const app = express();
require('dotenv').config();

// Middleware
app.use(express.json());
app.use(cors({
  origin: 'https://your-frontend-url.onrender.com', // Update after deploying frontend
}));



mongoose.connect(MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log('Connected to MongoDB'))
  .catch((error) => console.error('Error connecting to MongoDB:', error.message));

// Todo Model
const Todo = mongoose.model('Todo', {
  text: String,
  completed: Boolean,
});

// Routes
app.get('/todos', async (req, res) => {
  const todos = await Todo.find();
  res.json(todos);
});

app.post('/todos', async (req, res) => {
  const todo = new Todo({ text: req.body.text, completed: false });
  await todo.save();
  res.json(todo);
});

// Update a todo
app.put('/todos/:id', async (req, res) => {
    try {
      const { text, completed } = req.body;
      const updatedTodo = await Todo.findByIdAndUpdate(
        req.params.id,
        { text, completed },
        { new: true } // Return the updated document
      );
      res.json(updatedTodo);
    } catch (error) {
      console.error('Error updating todo:', error.message);
      res.status(500).json({ message: error.message });
    }
  });
  

app.delete('/todos/:id', async (req, res) => {
  await Todo.findByIdAndDelete(req.params.id);
  res.json({ message: 'Todo deleted' });
});

  

// Start Server
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});