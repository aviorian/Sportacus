import mongoose from "mongoose";
import dietProgram from "./dietProgram.js"; // adjust path if needed


// Connect to your MongoDB
export const connectDB = async () => {
  try {
    console.log("mongore uri", process.env.MONGO_URI);
    const conn = await mongoose.connect("mongodb+srv://erdemkaraahmet0:8K2OvMt55UqweJb0@cluster0.2btrcpz.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0", {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
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
];

async function seed() {
  await connectDB(); // <-- Add this line!
  await dietProgram.insertMany(programs);
  console.log("Diet programs seeded!");
  mongoose.disconnect();
}

seed();