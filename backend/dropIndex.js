const mongoose = require('mongoose');
require('dotenv').config();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/ecommerce';

mongoose.connect(MONGODB_URI)
.then(async () => {
  console.log('Connected to MongoDB');
  
  const db = mongoose.connection.db;
  const collection = db.collection('products');
  
  // List all indexes
  const indexes = await collection.indexes();
  console.log('Current indexes:', indexes);
  
  // Drop slug_1 index if it exists
  try {
    await collection.dropIndex('slug_1');
    console.log('Index slug_1 dropped successfully');
  } catch (error) {
    console.log('Index slug_1 may not exist:', error.message);
  }
  
  // Drop sku_1 index if it exists
  try {
    await collection.dropIndex('sku_1');
    console.log('Index sku_1 dropped successfully');
  } catch (error) {
    console.log('Index sku_1 may not exist:', error.message);
  }
  
  mongoose.connection.close();
  console.log('Done');
})
.catch(err => {
  console.error('Error:', err);
  process.exit(1);
});
