import jwt from "jsonwebtoken";
import User from "../models/userModel.js";
import asyncHandler from "express-async-handler";

export const protect = asyncHandler(async (req, res, next) => {
  const token = req.cookies.token;

  if (!token) {
    console.log("middleware: No token found in cookies");
    return res.status(401).json({ message: "Not authorized, no token" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (!decoded || !decoded.userId) {
      return res.status(401).json({ message: "Not authorized, token failed" });
    }

    req.user = await User.findById(decoded.userId).select("-password");
    if (!req.user) {
      console.log("middleware: User not found for ID:", decoded.userId);
      return res
        .status(401)
        .json({ message: "Not authorized, user not found" });
    }
    console.log("middleware: User found:", req.user._id);

    next();
  } catch (error) {
    res.status(401).json({ message: "Not authorized, token failed" });
  }
});
