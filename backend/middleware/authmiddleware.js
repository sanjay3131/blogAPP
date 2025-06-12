import jwt from "jsonwebtoken";
import User from "../models/userModel.js";
import asyncHandler from "express-async-handler";

export const protect = asyncHandler(async (req, res, next) => {
  // Retrieve the token from cookies
  const token = req.cookies.token;

  if (!token) {
    return res.status(401).json({ message: "Not authorized, no token" });
  }

  try {
    // Verify the token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (!decoded) {
      return res.status(401).json({ message: "Not authorized, token failed" });
    }

    // Attach the user to the request object
    req.user = await User.findById(decoded.userId).select("-password");

    next(); // Proceed to the next middleware or route handler
  } catch (error) {
    return res.status(401).json({ message: "Not authorized, token failed" });
  }
});
