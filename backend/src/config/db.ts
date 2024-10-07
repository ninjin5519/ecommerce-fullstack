import mongoose from "mongoose";

export const connectDB = async () => {
  try {
    await mongoose.connect(
      "mongodb+srv://admin:admin1234@ecommerce-fullstack.bouhy.mongodb.net/?retryWrites=true&w=majority&appName=ecommerce-fullstack"
    );
    console.log("Database connected");
  } catch (error) {
    console.log("Database cannot connect");
  }
};
