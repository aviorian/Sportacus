import { Router } from "express";
import { hash, compare } from "bcryptjs";
import User from "../models/user.js";
import { generateTokenAndSetCookie } from "../utils/generateTokenAndSetCookie.js";

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

    //jwt
    generateTokenAndSetCookie(res, newUser._id);

    //sendVerificationEmail(newUser.email, verificationtoken); // Send verification email //where is this function?
    
    res.status(201).json({ message: "User created successfully",
      user: {
        ...newUser._doc,
        password: undefined, // Exclude password from response
      }
     });
    

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
    
        //jwt
        generateTokenAndSetCookie(res, user._id); // Use newUser instead of user

        res.status(200).json({ message: "Login successful", user });
        

      } catch (err) {
        res.status(500).json({ message: "Server error" });
      }
}

export const logout = (req, res) => {
    res.clearCookie("token"); // Clear the cookie
    res.status(200).json({ message: "Logout successful" });
}
