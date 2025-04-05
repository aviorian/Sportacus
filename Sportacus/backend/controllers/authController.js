import { Router } from "express";
import { hash, compare } from "bcryptjs";
import User from "../models/user.js";



export const register = async (req, res) => {
    try {
    const {
      firstName,
      lastName,
      birthDate,
      birthCountry,
      birthCity,
      gender,
      address,
      phoneNumber,
      email,
      username,
      password,
    } = req.body;

    // Check missing required fields
    if (
      !firstName ||
      !lastName ||
      !birthDate ||
      !birthCountry ||
      !birthCity ||
      !gender ||
      !email ||
      !username ||
      !password
    ) {
      return res
        .status(400)
        .json({ message: "Please fill all required fields." });
    }

    // Check email exists
    const existingEmail = await User.findOne({ email });
    if (existingEmail)
      return res.status(400).json({ message: "Email already exists" });

    // Check username exists
    const existingUsername = await User.findOne({ username });
    if (existingUsername)
      return res.status(400).json({ message: "Username already exists" });

    // Hash password
    const hashedPassword = await hash(password, 10);
    const verificationtoken = Math.floor(100000 + Math.random() * 900000); 

    const newUser = new User({
      firstName,
      lastName,
      birthDate,
      birthCountry,
      birthCity,
      gender,
      address, // Optional
      phoneNumber, // Optional
      email,
      username,
      password: hashedPassword,
      verificationToken: verificationtoken,
      verificationTokenExpiresAt: Date.now() + 24*60*60*1000, // 24 hour later from now
    });

    await newUser.save();

    sendVerificationEmail(newUser.email, verificationtoken); // Send verification email
    res.status(201).json({ message: "User created successfully" });
    

  } catch (err) {
    console.error("Register Error:", err);
    res.status(500).json({ message: "Server error" });
  }
}

export const login = async (req, res) => {
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
}

export const logout = (req, res) => {
    res.status(200).json({ message: "Logout successful" });
}
