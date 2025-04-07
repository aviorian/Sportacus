import express from "express";
import cookieParser from "cookie-parser";


import { connectDB } from "./db/connectDB.js";
import authRoutes from "./routes/authRoute.js";

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cookieParser());

app.use(express.json());

app.use("/api/auth", authRoutes);

app.listen(PORT, () => {
  connectDB();
  console.log("Server is running on port", PORT);
}

);
