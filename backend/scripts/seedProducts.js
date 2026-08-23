const mongoose = require('mongoose');
const { faker } = require('@faker-js/faker');
const Product = require('../src/models/Product');
require('dotenv').config();

// Categories with subcategories
const categories = [
  { name: 'Electronics', subcategories: ['Phones', 'Laptops', 'Audio', 'Gaming', 'Smartwatches'] },
  { name: 'Clothing', subcategories: ['Men', 'Women', 'Kids', 'Accessories'] },
  { name: 'Books', subcategories: ['Fiction', 'Non-Fiction', 'Textbooks', 'Children'] },
  { name: 'Home & Kitchen', subcategories: ['Furniture', 'Decor', 'Appliances', 'Storage'] },
  { name: 'Beauty', subcategories: ['Skincare', 'Makeup', 'Fragrances', 'Haircare'] },
  { name: 'Sports', subcategories: ['Fitness', 'Team Sports', 'Outdoor', 'Cycling'] },
  { name: 'Toys', subcategories: ['Action Figures', 'Board Games', 'Educational', 'Dolls'] },
  { name: 'Automotive', subcategories: ['Car Accessories', 'Tools', 'Cleaning', 'Maintenance'] },
  { name: 'Health', subcategories: ['Vitamins', 'Supplements', 'Wellness', 'Personal Care'] },
  { name: 'Food', subcategories: ['Snacks', 'Beverages', 'Cooking', 'Organic'] }
];

const brands = ['Apple', 'Samsung', 'Sony', 'Nike', 'Adidas', 'Puma', 'Levis', 'Gucci', 'Zara', 'H&M', 'Amazon Basics', 'Sony', 'Panasonic', 'Dell', 'HP', 'Lenovo', 'Asus', 'OnePlus', 'Google', 'Microsoft', 'Logitech', 'Bose', 'JBL', 'Sennheiser', 'Fitbit', 'Garmin'];

const images = [
  'https://picsum.photos/seed/1/300/300',
  'https://picsum.photos/seed/2/300/300',
  'https://picsum.photos/seed/3/300/300',
  'https://picsum.photos/seed/4/300/300',
  'https://picsum.photos/seed/5/300/300',
  'https://picsum.photos/seed/6/300/300',
  'https://picsum.photos/seed/7/300/300',
  'https://picsum.photos/seed/8/300/300',
  'https://picsum.photos/seed/9/300/300',
  'https://picsum.photos/seed/10/300/300'
];

// Function to generate realistic product name
const generateProductName = (category, subcategory) => {
  const adjectives = ['Premium', 'Deluxe', 'Pro', 'Elite', 'Essential', 'Classic', 'Modern', 'Luxury', 'Ultra', 'Advanced'];
  const adjectives2 = ['Smart', 'Tech', 'Style', 'Comfort', 'Fit', 'Flex', 'Turbo', 'Max', 'Prime', 'Plus'];
  
  const adj1 = faker.helpers.arrayElement(adjectives);
  const adj2 = faker.helpers.arrayElement(adjectives2);
  const brand = faker.helpers.arrayElement(brands);
  const model = faker.number.int({ min: 1000, max: 9999 });
  
  return `${adj1} ${brand} ${subcategory} ${model} ${adj2}`;
};

// Function to generate a single product
const generateProduct = (index) => {
  const category = faker.helpers.arrayElement(categories);
  const subcategory = faker.helpers.arrayElement(category.subcategories);
  const brand = faker.helpers.arrayElement(brands);
  
  const price = faker.number.float({ min: 5, max: 1500, precision: 0.01 });
  const stock = faker.number.int({ min: 1, max: 1000 });
  
  const productName = generateProductName(category.name, subcategory);
  
  return {
    name: productName,
    description: faker.commerce.productDescription() + ' ' + faker.commerce.productDescription(),
    shortDescription: faker.commerce.productDescription().substring(0, 150),
    price: price,
    compareAtPrice: price * faker.number.float({ min: 1.1, max: 1.5, precision: 0.01 }),
    costPerItem: price * faker.number.float({ min: 0.5, max: 0.8, precision: 0.01 }),
    category: category.name,
    subCategory: subcategory,
    brand: brand,
    sku: `SKU-${faker.string.alphanumeric(8).toUpperCase()}`,
    tags: faker.helpers.arrayElements(['popular', 'new', 'sale', 'featured', 'best-seller', 'eco-friendly', 'limited', 'exclusive'], { min: 1, max: 3 }),
    images: [
      `https://picsum.photos/seed/${index}/300/300`,
      `https://picsum.photos/seed/${index + 1000}/300/300`,
      `https://picsum.photos/seed/${index + 2000}/300/300`
    ],
    inventory: {
      quantity: stock,
      lowStockThreshold: faker.number.int({ min: 5, max: 20 }),
      isInStock: stock > 0,
      trackQuantity: true
    },
    ratings: {
      average: faker.number.float({ min: 1, max: 5, precision: 0.1 }),
      count: faker.number.int({ min: 0, max: 500 })
    },
    specifications: {
      'Brand': brand,
      'Category': category.name,
      'Subcategory': subcategory,
      'Model': `MDL-${faker.string.alphanumeric(6).toUpperCase()}`,
      'Warranty': `${faker.number.int({ min: 6, max: 24 })} months`
    },
    weight: {
      value: faker.number.float({ min: 0.1, max: 10, precision: 0.01 }),
      unit: faker.helpers.arrayElement(['kg', 'g', 'lb'])
    },
    dimensions: {
      length: faker.number.float({ min: 5, max: 50, precision: 0.1 }),
      width: faker.number.float({ min: 3, max: 40, precision: 0.1 }),
      height: faker.number.float({ min: 1, max: 30, precision: 0.1 }),
      unit: 'cm'
    },
    isActive: true,
    isFeatured: faker.datatype.boolean({ probability: 0.15 }),
    views: faker.number.int({ min: 0, max: 100000 }),
    purchases: faker.number.int({ min: 0, max: 50000 }),
    createdAt: faker.date.past({ years: 1 }),
    updatedAt: new Date()
  };
};

// Main seeding function
const seedProducts = async (count = 10000) => {
  console.log(`🚀 Starting seeding of ${count} products...`);
  
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/ecommerce');
    console.log('✅ Connected to MongoDB');

    // Delete existing products
    const deleted = await Product.deleteMany({});
    console.log(`🗑️ Deleted ${deleted.deletedCount} existing products`);

    const batchSize = 1000;
    const products = [];
    let inserted = 0;

    console.log(`📦 Generating ${count} products in batches of ${batchSize}...`);

    for (let i = 0; i < count; i++) {
      products.push(generateProduct(i));
      
      if (products.length === batchSize) {
        await Product.insertMany(products);
        inserted += products.length;
        console.log(`✅ Inserted ${inserted} products... (${Math.round((inserted/count)*100)}%)`);
        products.length = 0;
      }
    }

    if (products.length > 0) {
      await Product.insertMany(products);
      inserted += products.length;
    }

    const total = await Product.countDocuments();
    console.log(`✅ Successfully seeded ${total} products!`);
    console.log(`📊 Categories: ${await Product.distinct('category').then(c => c.join(', '))}`);
    console.log(`🛍️ Brands: ${await Product.distinct('brand').then(b => b.slice(0, 10).join(', '))} and more...`);

    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding products:', error);
    process.exit(1);
  }
};

// Run the seeder
const count = parseInt(process.argv[2]) || 10000;
seedProducts(count);