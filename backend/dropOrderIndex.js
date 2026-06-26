const mongoose = require('mongoose');
require('dotenv').config();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/ecommerce';

mongoose.connect(MONGODB_URI)
.then(async () => {
  console.log('Connected to MongoDB');
  
  const db = mongoose.connection.db;
  const collection = db.collection('orders');
  
  // Drop orderNumber_1 index if it exists
  try {
    await collection.dropIndex('orderNumber_1');
    console.log('Index orderNumber_1 dropped successfully');
  } catch (error) {
    console.log('Index orderNumber_1 may not exist:', error.message);
  }
  
  mongoose.connection.close();
  console.log('Done');
})
.catch(err => {
  console.error('Error:', err);
  process.exit(1);
});