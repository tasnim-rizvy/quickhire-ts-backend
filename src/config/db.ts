import mongoose from 'mongoose';

// Cache connection for serverless environments (Vercel)
let isConnected = false;

const connectDB = async (): Promise<void> => {
  if (isConnected) {
    console.log('Using existing MongoDB connection');
    return;
  }

  const uri = process.env.MONGODB_URI;
  if (!uri) {
    throw new Error('MONGODB_URI environment variable is not defined');
  }

  try {
    const conn = await mongoose.connect(uri, {
      bufferCommands: false,
    });
    isConnected = conn.connections[0].readyState === 1;
    console.log(`✅ MongoDB connected: ${conn.connection.host}`);
  } catch (error) {
    console.error('❌ MongoDB connection error:', error);
    throw error;
  }
};

export default connectDB;
