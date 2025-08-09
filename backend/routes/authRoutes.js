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

// Add this debug route before your Google routes
router.get("/debug", (req, res) => {
  res.json({
    environment: process.env.NODE_ENV,
    frontendUrl: process.env.FRONTEND_URL,
    googleClientId: process.env.GOOGLE_CLIENT_ID ? "Set" : "Not Set",
    googleCallbackUrl: process.env.GOOGLE_CALLBACK_URL,
    cookies: req.cookies,
    headers: {
      origin: req.get("origin"),
      referer: req.get("referer"),
      userAgent: req.get("user-agent"),
    },
  });
});

// Test cookie setting
router.get("/test-cookie", (req, res) => {
  res.cookie("testCookie", "testValue", {
    httpOnly: true,
    secure: true,
    sameSite: "none",
    maxAge: 24 * 60 * 60 * 1000,
    path: "/",
  });
  res.json({ message: "Test cookie set", success: true });
});

// Test cookie reading
router.get("/test-read-cookie", (req, res) => {
  console.log("All cookies:", req.cookies);
  console.log("Token cookie:", req.cookies.token);
  res.json({
    cookies: req.cookies,
    hasToken: !!req.cookies.token,
    message: "Cookie reading test",
  });
});

// Google OAuth
router.get(
  "/google",
  passport.authenticate("google", {
    scope: ["profile", "email"],
    prompt: "select_account", // Force account selection
  })
);

router.get(
  "/google/callback",
  passport.authenticate("google", {
    failureRedirect: `${process.env.FRONTEND_URL}/login`,
    session: false,
  }),
  asyncHandler(async (req, res) => {
    const token = await generateToken(req.user._id, res);
    // Optionally redirect or send token
    console.log("🔑 Token generated:", token);
    if (!token) {
      return res.status(500).json({ message: "Token generation failed" });
    }
    res.cookie("token", token, {
      httpOnly: true,
      secure: true,
      sameSite: "none",
      maxAge: 6 * 24 * 60 * 60 * 1000,
    });
    token
      ? res.redirect(`${process.env.FRONTEND_URL}/auth-success`)
      : res.status(500).json({ message: "Token generation failed" });
  })
);
export default router;
