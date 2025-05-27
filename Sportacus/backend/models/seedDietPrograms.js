import path, { dirname } from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";

const __dirname = dirname(fileURLToPath(import.meta.url)); //get directory name of the current module
dotenv.config({ path: path.resolve(__dirname, "../../.env") }); //../../.env means go up two directories from the current file and find .env file
//path.resolve combines both

import mongoose from "mongoose";
import dietProgram from "./dietProgram.js"; // adjust path if needed

// Connect to your MongoDB
export const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`MongoDB connected: ${conn.connection.host}`);
  } catch (error) {
    console.error("MongoDB connection error:", error.message);
    process.exit(1); // Exit the process with failure
  }
};

const programs = [
  {
    name: "Weight Loss Plan",
    shortDescription: "A low-calorie diet focused on fat loss.",
    detail: "this is the detail of the weight loss plan",
    targetCalories: 1500,
    targetMacros: { protein: 100, carbs: 150, fats: 40 },
  },
  {
    name: "Muscle Gain Plan",
    shortDescription: "A high-protein, high-calorie diet for muscle building.",
    detail: "this is the detail of the muscle gain plan",
    targetCalories: 2800,
    targetMacros: { protein: 180, carbs: 300, fats: 80 },
  },
  {
    name: "Gain Weight",
    shortDescription: "A balanced diet to help you gain weight healthily.",
    detail: "this is the detail of the gain weight plan",
    targetCalories: 2500,
    targetMacros: { protein: 150, carbs: 250, fats: 70 },
  },
  {
    name: "Eat Healthy",
    shortDescription: "A diet focused on whole foods and balanced nutrition.",
    detail: "this is the detail of the eat healthy plan",
    targetCalories: 2000,
    targetMacros: { protein: 120, carbs: 200, fats: 60 },
  },
];

async function seed() {
  await connectDB(); // <-- Add this line!
  await dietProgram.insertMany(programs);
  console.log("Diet programs seeded!");
  mongoose.disconnect();
}

seed();