const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const userRoutes = require('./routes/userRoutes');
const todoRoutes = require('./routes/todoRoutes');
const cors = require('cors');


dotenv.config();
const app = express();

app.use(express.json());
app.use(cors());
// Routes
app.use('/api/users', userRoutes);
app.use('/api/todos', todoRoutes);

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => {
  console.log(`MongoDB Connected: ${process.env.MONGO_URI}`);
  app.listen(5000, () => console.log('Server running on port 5000'));
})
.catch((err) => console.error('MongoDB connection error:', err));
