import express from "express";
import cookieParser from "cookie-parser";

import path from "path";
import { fileURLToPath } from "url";

import { connectDB } from "./db/connectDB.js";
import authRoutes from "./routes/authRoute.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cookieParser());

app.use(express.json());

app.use(express.static(path.join(__dirname, "../frontend")));

app.use("/api/auth", authRoutes);

app.listen(PORT, () => {
  connectDB();
  console.log("Server is running on port", PORT);
});
