import { Router } from "express";
import { hash, compare } from "bcryptjs";
import User from "../models/user.js";

const router = Router();

// Register New User
router.post("/register", async (req, res) => {
  try {
    const { username, email, password } = req.body;

    const existingEmail = await User.findOne({ email });
    if (existingEmail)
      return res.status(400).json({ message: "Email already exists" });
    const existingUsername = await User.findOne({ username });
    if (existingUsername)
      return res.status(400).json({ message: "Username already exists" });

    const hashedPassword = await hash(password, 10);

    const newUser = new User({
      username,
      email,
      password: hashedPassword,
    });

    await newUser.save();
    res.status(201).json({ message: "User created successfully" });
  } catch (err) {
    console.error("Register Error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// Login User
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user)
      return res.status(400).json({ message: "Invalid email or password" });

    const isMatch = await compare(password, user.password);

    if (!isMatch)
      return res.status(400).json({ message: "Invalid email or password0" });

    res.status(200).json({ message: "Login successful", user });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// Logout (frontend can just delete token or user info locally)
router.post("/logout", (req, res) => {
  res.status(200).json({ message: "Logout successful" });
});

export default router;
