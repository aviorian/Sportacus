import { Router } from "express";
import {
  deleteAccount,
  login,
  logout,
  register,
  verificationAndPassword,
  editAccount,
  getUser,
  setAndSendVerificationCode
  editOrSetTrainingProfile,
} from "../controllers/authController.js";


const router = Router();


router.post("/register", register);// Register New User

router.post("/login", login);// Login User

router.post("/logout", logout);// Logout (frontend can just delete token or user info locally)

router.post("/delete", deleteAccount);

router.post("/verificationAndPassword", verificationAndPassword);

router.post("/editAccount", editAccount);

router.get("/getUser", getUser);

router.get("/sendVerificationCode", setAndSendVerificationCode);

router.post("/editOrSetTrainingProfile", editOrSetTrainingProfile);

export default router;
