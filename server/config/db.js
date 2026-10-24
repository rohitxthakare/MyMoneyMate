import mongoose from 'mongoose';

// Use Google DNS servers to resolve MongoDB hostnames.
import dns from "node:dns";
dns.setServers(["8.8.8.8", "8.8.4.4"]);

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(`${process.env.MONGO_URI}mymoneymate`);
    console.log('MongoDB connected');
  } catch (error) {
    console.error('MongoDB connection error');
    process.exit(1);
  }
};

export default connectDB;