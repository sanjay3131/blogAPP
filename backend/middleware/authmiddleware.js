import jwt from "jsonwebtoken";
import User from "../models/userModel.js";
import asyncHandler from "express-async-handler";

export const protect = asyncHandler(async (req, res, next) => {
  const token = req.cookies.token;
  console.log("middleware: Request headers:", req.headers);
  console.log("middleware: Cookies received:", req.cookies);
  console.log("middleware: Token retrieved from cookies:", token);

  if (!token) {
    console.log("middleware: No token found in cookies");
    return res.status(401).json({ message: "Not authorized, no token" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log("middleware: Token decoded:", decoded);

    if (!decoded || !decoded.userId) {
      console.log("middleware: Invalid decoded token:", decoded);
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
    console.error("middleware: Token verification failed:", error.message);
    res.status(401).json({ message: "Not authorized, token failed" });
  }
});
