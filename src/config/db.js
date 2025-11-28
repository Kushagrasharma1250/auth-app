const mongoose = require('mongoose');

exports.connectDB = async (uri) => {
  if (!uri) {
    throw new Error('MONGO_URI is not defined');
  }
  
  try {
    await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 5000,
    });
    console.log('✅ MongoDB connected');
  } catch (error) {
    console.error('❌ MongoDB connection error:', error.message);
    throw error;
  }
};
