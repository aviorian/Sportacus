import { Router } from "express";
import { deleteAccount, login, logout, register, verificationAndPassword } from "../controllers/authController.js";


const router = Router();

// Register New User
router.post("/register", register);

// Login User
router.post("/login", login);

// Logout (frontend can just delete token or user info locally)
router.post("/logout", logout);

router.post("/delete", deleteAccount);

router.post("/verificationAndPassword", verificationAndPassword);

export default router;
