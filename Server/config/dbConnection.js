import mongoose from "mongoose";

// Disable strict mode for MongoDB queries to allow flexible query handling
mongoose.set("strictQuery", false);

const connectionToDB = async () => {
  try {
    // Connect to the MongoDB database
    const { connection } = await mongoose.connect(
      process.env.MONGO_URI || `mongodb://127.0.0.1:27017/lms`
    );

    // Log successful database connection
    if (connection) {
      console.log(`Connected to MongoDB: ${connection.host}`);
    }
  } catch (err) {
    // Log the error and exit the process if connection fails
    console.log(err);
    process.exit(1);
  }
};

export default connectionToDB;
