import { Router } from "express";
import { hash, compare } from "bcryptjs";
import User from "../models/user.js";
import dietProgram from "../models/dietProgram.js"; // Import the dietProgram model
import { generateTokenAndSetCookie, getUserFromToken } from "../utils/generateTokenAndSetCookie.js";
import { sendVerificationEmail, sendForgotPasswordEmail } from "../mailtrap/emails.js"; // Import the email sending function


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
      !username
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
      verificationToken: verificationtoken,
      verificationTokenExpiresAt: Date.now() + 15 * 60 * 1000, // 24 hour later from now,
    });

    console.log(newUser);

    await newUser.save();

    //jwt
    generateTokenAndSetCookie(res, newUser._id);

    await sendVerificationEmail(newUser.email, verificationtoken); // Send verification email //where is this function?

    res.status(201).json({
      message: "Waiting for verification",
      user: {
        ...newUser._doc,
        password: undefined, // Exclude password from response
      },
    });
  } catch (err) {
    console.error("Register Error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user)
      return res.status(400).json({ message: "Invalid email or password" });

    if (user.isVerified == false)
      return res.status(400).json({ message: "Please verify your email" });

    const isMatch = await compare(password, user.password);

    if (!isMatch)
      return res.status(400).json({ message: "Invalid email or password" });

    //jwt
    generateTokenAndSetCookie(res, user._id); // Use newUser instead of user

    res.status(200).json({ message: "Login successful", user: user });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

export const logout = (req, res) => {
  res.clearCookie("token"); // Clear the cookie
  res.status(200).json({ message: "Logout successful" });
};

export const deleteAccount = async (req, res) => {
  try {
    console.log("Deleting account..."); // Log the start of the process
    const token = req.cookies.token; // .token accesses the specific cookie named token from the req.cookies object.
    console.log("Token:", token); // Log the token for debugging
    const currentUser = await getUserFromToken(token); // get the user form the token
    console.log("Current User:", currentUser); // Log the current user for debugging
    if (!currentUser) {
      console.log("User not found"); // Log the error
      return res.status(401).json({ message: "Unauthorized" });
    }
    res.clearCookie("token"); // Clear the cookie
    console.log("Cookie cleared"); // Log the success message
    await User.findOneAndDelete(currentUser._id); // Delete the user from the database
    console.log("User deleted"); // Log the success message
    res.status(200).json({ message: "Account deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error, couldn't delete" });
  }
};
export const setPassword = async (req, res) => {
  try {
    const { verificationCode, password } = req.body; // Get the vericication code and password from the request body
      const token = req.cookies.token; // .token accesses the specific cookie named token from the req.cookies object.
  const currentUser = await getUserFromToken(token);

    if (!currentUser) {
    console.log("User not found"); // Log the error
    }
    if (
      currentUser.verificationToken == verificationCode &&
      currentUser.verificationTokenExpiresAt > Date.now()
    ) {
      currentUser.password = await hash(password, 10); // Hash the password
      currentUser.isVerified = true; // Set the user as verified
      currentUser.verificationToken = undefined; // Clear the verification token
      currentUser.verificationTokenExpiresAt = undefined; // Clear the verification token expiration date
      await currentUser.save(); // Save the updated user to the database

      return res.status(200).json({ message: "Verification successful" }); // Verification successful
    } else {
      return res.status(400).json({ message: "Verification failed" });
    }
  } catch (error) {
    console.error("Verification Error:", error); // Log the error
    res.status(500).json({ message: "Server error" }); // Send a server error response
  }
};

export const verificationAndPassword = async (req, res) => {
  try {
    const { verificationCode, password } = req.body; // Get the vericication code and password from the request body

    const { email } = req.body;
    const currentUser = await User.findOne({ email });
    if (!currentUser) {
    console.log("User not found"); // Log the error
    }
    if (
      currentUser.verificationToken == verificationCode &&
      currentUser.verificationTokenExpiresAt > Date.now()
    ) {
      currentUser.password = await hash(password, 10); // Hash the password
      currentUser.isVerified = true; // Set the user as verified
      currentUser.verificationToken = undefined; // Clear the verification token
      currentUser.verificationTokenExpiresAt = undefined; // Clear the verification token expiration date
      await currentUser.save(); // Save the updated user to the database

      return res.status(200).json({ message: "Verification successful" }); // Verification successful
    } else {
      return res.status(400).json({ message: "Verification failed" });
    }
  } catch (error) {
    console.error("Verification Error:", error); // Log the error
    res.status(500).json({ message: "Server error" }); // Send a server error response
  }


};

export const editAccount = async (req, res) => {
  const token = req.cookies.token;
  const currentUser = await getUserFromToken(token);


  try {
    const {
      firstName,
      lastName,
      password,
      phoneNumber,
      email,
    } = req.body;

    if (!firstName || !lastName || !email || !password) {
      return res.status(400).json({ message: "Please fill all required fields." });
    }

    if (currentUser.firstName !== firstName) currentUser.firstName = firstName;
    if (currentUser.lastName !== lastName) currentUser.lastName = lastName;
    if (currentUser.phoneNumber !== phoneNumber) currentUser.phoneNumber = phoneNumber;
    if (currentUser.email !== email) currentUser.email = email;

    const passwordChanged = !(await compare(password, currentUser.password)); // Şifre değişti mi kontrol et
    if (passwordChanged) {
      currentUser.password = await hash(password, 10);
    }

    await currentUser.save(); // <--- EN ÖNEMLİ KISIM

    res.status(201).json({
      message: "Account updated successfully",
    });
  } catch (err) {
    console.error("Edit Account Error:", err);
    res.status(500).json({ message: "Server error" });
  }
};
export const getUser = async (req, res) => {
  const token = req.cookies.token; // .token accesses the specific cookie named token from the req.cookies object.
  const currentUser = await getUserFromToken(token); // get the user form the token
  if (!currentUser) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  else {
    return res.status(200).json({ message: "User found", user: currentUser });
  }
};



export const setAndSendVerificationCode = async (req, res) => {
  const token = req.cookies.token; // .token accesses the specific cookie named token from the req.cookies object.
  const currentUser = await getUserFromToken(token);
  currentUser.verificationToken = Math.floor(100000 + Math.random() * 900000);
  currentUser.verificationTokenExpiresAt = Date.now() + 15 * 60 * 1000,
    await currentUser.save();
  await sendVerificationEmail(currentUser.email, currentUser.verificationToken);
  return res.status(200).json({ message: "Verification Code Sent", });
};

export const editOrSetTrainingProfile = async (req, res) => {
  try {
    const currentUser = await getUserFromToken(req.cookies.token);
    if (!currentUser) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const {
      target,
      weight,
      height,
      bmi,
      chronicIllnesses,
      workingStyle,
      physicalActivity,
      habits
    } = req.body;

    if (!target || !weight || !height || !workingStyle || !physicalActivity) {
      return res.status(400).json({ message: "Lütfen tüm zorunlu alanları doldurun." });
    }

    if (!currentUser.TrainingProfile) {
      currentUser.TrainingProfile = {};
    }

    currentUser.TrainingProfile.target = target;
    currentUser.TrainingProfile.weight = weight;
    currentUser.TrainingProfile.height = height;
    currentUser.TrainingProfile.bmi = bmi;
    currentUser.TrainingProfile.chronicIllnesses = chronicIllnesses || [];
    currentUser.TrainingProfile.workingStyle = workingStyle;
    currentUser.TrainingProfile.physicalActivity = physicalActivity;
    currentUser.TrainingProfile.habits = habits || [];

    await currentUser.save();

    return res.status(200).json({ message: "Training profile updated successfully" });
  } catch (error) {
    console.error("Error in editOrSetTrainingProfile:", error);
    return res.status(500).json({ message: "hedef kaydedilemedi" });
  }
};
export const resetPassword = async (req, res) => {
  console.log("req.body:", req.body);
  try {
    const { email } = req.body;
    const currentUser = await User.findOne({ email });
    console.log("Current User:", currentUser, "email: ", email); // Log the current user for debugging
    if (!currentUser) {
      return res.status(404).json({ success: false, message: "Kullanıcı bulunamadı." });
    }
    currentUser.verificationToken = Math.floor(100000 + Math.random() * 900000);
    currentUser.verificationTokenExpiresAt = Date.now() + 15 * 60 * 1000;
    await currentUser.save();
    await sendForgotPasswordEmail(currentUser.email, currentUser.verificationToken);
    //const resetURL = `${process.env.FRONTEND_URL}/reset-password/${user.verificationToken}`; // Create a reset URL
    return res.status(200).json({ message: "Email sent" });
  } catch (error) {
    console.error("Reset password error:", error);
    return res.status(500).json({ message: "Server error" });
  }
};
export const listDietPrograms = async (req, res) => {
  try {
    const programs = await dietProgram.find();
    return res.status(200).json({ programs }); // programs is an array
  } catch (error) {
    console.error("Error listing diet programs:", error);
    return res.status(500).json({ message: "Server error" });
  }
};