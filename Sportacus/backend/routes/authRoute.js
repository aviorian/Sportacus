import { Router } from "express";
import { login, logout, register } from "../controllers/authController.js";

const router = Router();

// Register New User
router.post("/register", register);

// Login User
router.post("/login", login);

// Logout (frontend can just delete token or user info locally)
router.post("/logout", logout);

export default router;
