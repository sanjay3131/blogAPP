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
  (req, res, next) => {
    console.log("🚀 Starting Google OAuth flow");
    console.log(
      "📋 Google Client ID:",
      process.env.GOOGLE_CLIENT_ID ? "Set" : "Not Set"
    );
    console.log("🔗 Callback URL:", process.env.GOOGLE_CALLBACK_URL);
    console.log("🌍 Request origin:", req.get("origin"));
    next();
  },
  passport.authenticate("google", {
    scope: ["profile", "email"],
    prompt: "select_account", // Force account selection
    accessType: "offline", // Get refresh token
  })
);

router.get(
  "/google/callback",
  passport.authenticate("google", {
    failureRedirect: `${process.env.FRONTEND_URL}/login`,
    session: false,
  }),
  asyncHandler(async (req, res) => {
    try {
      console.log("✅ Reached Google callback route");
      console.log("👉 req.user:", req.user);
      console.log("🌍 Environment:", process.env.NODE_ENV);
      console.log("🔗 Frontend URL:", process.env.FRONTEND_URL);

      if (!req.user) {
        console.log("❌ No user found in req.user");
        return res.redirect(
          `${process.env.FRONTEND_URL}/login?error=auth_failed`
        );
      }

      console.log("🔄 About to generate token for user ID:", req.user._id);

      // Generate token and set cookie with cross-origin settings
      const token = generateToken(req.user._id, res);

      console.log("🍪 Token generated successfully:", token ? "✅" : "❌");
      console.log("🍪 Token length:", token ? token.length : "No token");

      // For cross-origin setup, you might need to pass token in URL temporarily
      // and let frontend set it as httpOnly cookie via an API call
      const redirectUrl = `${process.env.FRONTEND_URL}/google-auth-success?token=${token}`;

      console.log("🔄 Redirecting to:", redirectUrl);
      res.redirect(redirectUrl);
    } catch (error) {
      console.error("❌ Error in Google callback:", error);
      console.error("❌ Error stack:", error.stack);
      res.redirect(`${process.env.FRONTEND_URL}/login?error=server_error`);
    }
  })
);

export default router;
