import express from "express";
import passport from "passport";
import {
  register,
  login,
  logout,
  checkUser,
  deleteAlldata,
  updateUserDetails,
} from "../controller/authcontroller.js";
import generateToken from "../utils/generateToken.js";
import { protect } from "../middleware/authmiddleware.js";
import asyncHandler from "express-async-handler";
import getUpload from "../middleware/upload.js";

const router = express.Router();

// JWT register/login
router.post("/register", register);
router.post("/login", login);
router.get("/logout", protect, logout);
router.get("/checkUser", protect, checkUser);
router.delete("/deleteAllData", protect, deleteAlldata);
const uploadProfilePic = getUpload("profile-pics");

router.post(
  "/updateUserDetails",
  protect,
  uploadProfilePic.single("profilePic"),
  updateUserDetails
);

// Google OAuth
router.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

router.get(
  "/google/callback",
  passport.authenticate("google", {
    failureRedirect: `${process.env.Vercel_Frontend_URL}/login`,
    session: false,
  }),
  asyncHandler(async (req, res) => {
    console.log("✅ Reached Google callback route");
    console.log("👉 req.user:", req.user); // Check if user exists
    const token = generateToken(req.user._id, res);
    const redirectUrl = `${process.env.Vercel_Frontend_URL}`;
    res.redirect(redirectUrl); // ⬅️ Send token back to frontend
  })
);

export default router;
