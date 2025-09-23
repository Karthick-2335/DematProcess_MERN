import mongoose from 'mongoose'

const connectDb = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_STRING);
    console.log("Database connection established");
  } catch (error) {
    console.error("Database connection error:", error);
    process.exit(1);
  }
};

export default connectDb;