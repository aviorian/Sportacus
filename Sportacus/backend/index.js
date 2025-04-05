import express from "express";

import { connectDB } from "./db/connectDB.js";
import authRoutes from "./routes/authRoute.js";

const app = express();
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Hello World! 123");
});

app.use("/api/auth", authRoutes);

app.listen(3000, () => {
  connectDB();
  console.log("Server is running on port 3000");
});
