const mongoose = require('mongoose');
const Product = require('../src/models/Product');
require('dotenv').config();

// Product categories and names
const categories = ['Electronics', 'Clothing', 'Books', 'Home & Kitchen', 'Beauty', 'Sports', 'Toys', 'Automotive'];
const brands = ['Apple', 'Samsung', 'Sony', 'Nike', 'Adidas', 'Puma', 'Levi\'s', 'Gucci', 'Zara', 'H&M'];

const productNames = [
  'Smartphone', 'Laptop', 'Headphones', 'Smart Watch', 'Tablet', 'Camera',
  'T-Shirt', 'Jeans', 'Jacket', 'Shoes', 'Sneakers', 'Dress', 'Skirt',
  'Novel', 'Textbook', 'Cookbook', 'Notebook', 'Dictionary',
  'Blender', 'Microwave', 'Toaster', 'Coffee Maker', 'Vacuum Cleaner',
  'Foundation', 'Lipstick', 'Mascara', 'Perfume', 'Shampoo', 'Conditioner',
  'Football', 'Basketball', 'Tennis Racket', 'Gym Bag', 'Dumbbells',
  'Action Figure', 'Board Game', 'Puzzle', 'Doll', 'LEGO Set',
  'Car Accessory', 'Bike Helmet', 'Tire', 'Car Cover', 'GPS Navigator'
];

const adjectives = ['Premium', 'Deluxe', 'Pro', 'Elite', 'Essential', 'Classic', 'Modern', 'Vintage', 'Luxury', 'Advanced'];
const colors = ['Red', 'Blue', 'Green', 'Black', 'White', 'Gold', 'Silver', 'Rose Gold', 'Purple', 'Pink'];

// Function to generate random product
const generateProduct = (index) => {
  const name = productNames[Math.floor(Math.random() * productNames.length)];
  const brand = brands[Math.floor(Math.random() * brands.length)];
  const category = categories[Math.floor(Math.random() * categories.length)];
  const adjective = adjectives[Math.floor(Math.random() * adjectives.length)];
  const color = colors[Math.floor(Math.random() * colors.length)];
  
  const price = (Math.random() * 1000 + 10).toFixed(2);
  const stock = Math.floor(Math.random() * 500) + 1;
  
  return {
    name: `${adjective} ${brand} ${name} (${color})`,
    description: `High quality ${category.toLowerCase()} product from ${brand}. Perfect for everyday use.`,
    price: parseFloat(price),
    category: category,
    sku: `SKU-${String(index).padStart(6, '0')}`,
    inventory: { quantity: stock },
    brand: brand,
    images: [`https://picsum.photos/seed/${index}/300/300`],
    imageUrl: `https://picsum.photos/seed/${index}/300/300`,
    isActive: true,
    isFeatured: Math.random() > 0.8,
    ratings: {
      average: (Math.random() * 4 + 1).toFixed(1),
      count: Math.floor(Math.random() * 500) + 1
    }
  };
};

// Seed function
const seedProducts = async (count = 10000) => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/ecommerce');
    console.log('Connected to MongoDB');

    // Delete existing products
    await Product.deleteMany({});
    console.log('Cleared existing products');

    // Generate products in batches
    const batchSize = 1000;
    const products = [];

    console.log(`Generating ${count} products...`);

    for (let i = 0; i < count; i++) {
      products.push(generateProduct(i));
      
      // Insert in batches
      if (products.length === batchSize) {
        await Product.insertMany(products);
        console.log(`Inserted ${i + 1} products...`);
        products.length = 0;
      }
    }

    // Insert remaining products
    if (products.length > 0) {
      await Product.insertMany(products);
      console.log(`Inserted final ${products.length} products...`);
    }

    // Get count
    const total = await Product.countDocuments();
    console.log(`✅ Successfully seeded ${total} products!`);

    process.exit(0);
  } catch (error) {
    console.error('Error seeding products:', error);
    process.exit(1);
  }
};

// Run with: node scripts/seedProducts.js 10000
const count = parseInt(process.argv[2]) || 10000;
seedProducts(count);