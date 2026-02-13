import mongoose from 'mongoose';

const connectDB = async () => {
  try {
    // Log the connection attempt
    console.log('📡 Attempting to connect to MongoDB...');
    console.log('Connection string:', process.env.MONGODB_URI ? 'Found ✅' : 'Missing ❌');
    
    const mongoURI = process.env.NODE_ENV === 'production' 
      ? process.env.MONGODB_URI_PROD 
      : process.env.MONGODB_URI;

    // Check if URI exists
    if (!mongoURI) {
      throw new Error('MongoDB URI is not defined in environment variables');
    }

    // Log masked URI (for debugging)
    const maskedURI = mongoURI.replace(/\/\/.*:.*@/, '//***:***@');
    console.log('Using URI:', maskedURI);

    const conn = await mongoose.connect(mongoURI);

    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
    console.log(`✅ Database: ${conn.connection.name}`);
    
    // Handle connection events
    mongoose.connection.on('error', (err) => {
      console.error(`❌ MongoDB connection error: ${err}`);
    });

    mongoose.connection.on('disconnected', () => {
      console.log('⚠️ MongoDB disconnected');
    });

    // Graceful shutdown
    process.on('SIGINT', async () => {
      await mongoose.connection.close();
      console.log('MongoDB connection closed through app termination');
      process.exit(0);
    });

  } catch (error) {
    console.error(`❌ Error connecting to MongoDB: ${error.message}`);
    console.error('Make sure:');
    console.error('1. MONGODB_URI is set in .env file');
    console.error('2. Your IP is whitelisted in MongoDB Atlas');
    console.error('3. Username and password are correct');
    process.exit(1);
  }
};

export default connectDB;
