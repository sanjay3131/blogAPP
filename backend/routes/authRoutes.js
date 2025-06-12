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
    session: false,
    failureRedirect: "/login",
  }),
  asyncHandler(async (req, res) => {
    const token = generateToken(req.user._id, res);
    // Optionally redirect or send token
    res.redirect(`http://localhost:5173/user`); // or send JSON if API-only
  })
);

export default router;
