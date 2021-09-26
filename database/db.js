const mongoose = require('mongoose');
const Product = require('../models/Product');
const products = require('../products.json');
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.CONNECTION_URI);
    await Product.deleteMany();
    await Product.create(products);
  } catch (error) {
    console.log(error);
  }
};

module.exports = connectDB;
