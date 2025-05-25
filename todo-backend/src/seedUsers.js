const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User');

dotenv.config();

const users = [
  { username: 'john', email: 'john@example.com' },
  { username: 'sarah', email: 'sarah@example.com' },
  { username: 'alice', email: 'alice@example.com' },
  { username: 'bob', email: 'bob@example.com' },
  { username: 'emma', email: 'emma@example.com' }
];

const seedUsers = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    await User.deleteMany(); // Optional: clear existing users
    await User.insertMany(users);
    console.log('✅ Sample users added!');
    process.exit();
  } catch (err) {
    console.error('Error seeding users:', err);
    process.exit(1);
  }
};

seedUsers();
