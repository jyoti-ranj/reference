const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Todo = require('./models/Todo');
const User = require('./models/User');

dotenv.config();

const seedTodos = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);

    // Find users by username for assignment
    const john = await User.findOne({ username: 'john' });
    const sarah = await User.findOne({ username: 'sarah' });

    await Todo.deleteMany();

    const todos = [
      {
        title: 'Complete the todo app',
        description: 'Finish implementing all required features',
        priority: 'high',
        completed: false,
        user: john._id,
        tags: ['work', 'coding'],
        assignedUsers: ['john', 'sarah'],
        notes: [
          {
            content: 'Remember to add proper error handling',
          },
        ],
      },
      {
        title: 'Prepare for presentation',
        description: 'Slides and demo',
        priority: 'medium',
        completed: false,
        user: sarah._id,
        tags: ['work'],
        assignedUsers: ['sarah'],
        notes: [],
      },
    ];

    await Todo.insertMany(todos);
    console.log('✅ Sample todos added!');
    process.exit();
  } catch (err) {
    console.error('Error seeding todos:', err);
    process.exit(1);
  }
};

seedTodos();
