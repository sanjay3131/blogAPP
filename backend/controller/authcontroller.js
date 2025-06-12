import bcrypt from "bcryptjs";
import asyncHandler from "express-async-handler";
import User from "../models/userModel.js";
import Blog from "../models/blogModel.js";
import generateToken from "../utils/generateToken.js";

// @desc    Register new user
// @route   POST /api/auth/register
export const register = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;

  const userExists = await User.findOne({ email });
  if (userExists) {
    res.status(400);
    throw new Error("User already exists");
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const user = await User.create({ name, email, password: hashedPassword });

  res.status(201).json({
    user: { id: user._id, name: user.name, email: user.email },
  });
});

// @desc    Login user
// @route   POST /api/auth/login
export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });
  if (!user) {
    res.status(404).json("User not found");
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    res.status(401);
    throw new Error("Invalid credentials");
  }

  const token = generateToken(user._id, res);

  res.json({
    token,
    user: { id: user._id, name: user.name, email: user.email },
  });
});

export const updateUserDetails = asyncHandler(async (req, res) => {
  const { bio, website, socialLinks } = req.body;
  const userId = req.user._id;
  const user = await User.findById(userId);
  if (!user) {
    res.status(404);
    throw new Error("User not found");
  }
  if (bio !== "") user.bio = bio;
  if (website !== "") user.website = website;
  if (socialLinks) user.socialLinks = socialLinks;
  const profilePic = req.file?.path || "";

  if (profilePic) {
    user.profilePic = profilePic;
    user.profilePublicPicId = req.file.filename;
  }
  await user.save();
  res.status(200).json({
    message: "User details updated successfully",
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      profilePic: user.profilePic,
      profilePublicPicId: user.profilePublicPicId,
      bio: user.bio,
      website: user.website,
      socialLinks: user.socialLinks,
    },
  });
});

// @desc    Get logged in user
// @route   GET /api/auth/check
export const checkUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id).select("-password");
  if (!user) {
    res.status(401).json({ message: "User not found ", status: "401" });
  }

  res.json({
    status: "200",
    author: user,
  });
});

// @desc    Logout user
// @route   GET /api/auth/logout
export const logout = asyncHandler((req, res) => {
  res.clearCookie("token");
  res.status(200).json({ message: "Logged out successfully", success: "200" });
});

//delete all users and their posts
// @desc    Delete all users
// @route   DELETE /api/auth/delete
export const deleteAlldata = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const user = await User.findById(userId);
  if (!user) {
    res.status(404);
    throw new Error("User not found");
  }
  if (user.role !== "admin") {
    return res.status(403).json("Not authorized to delete all users");
  }
  const users = await User.deleteMany();
  const blogs = await Blog.deleteMany();
  if (!users) {
    res.status(404);
    throw new Error("No users found");
  }
  if (!blogs) {
    res.status(404);
    throw new Error("No blogs found");
  }
  if (users.deletedCount === 0 && blogs.deletedCount === 0) {
    return res.status(200).json({ message: "No users or blogs found" });
  }
  res.clearCookie("token");
  res.status(200).json({ message: "All users deleted successfully" });
});

// delete blogs of user
// @desc    Delete all blogs by user
// @route   DELETE /api/auth/deleteblogs

export const deleteBlogs = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const user = await User.findById(userId);
  if (!user) {
    res.status(404);
    throw new Error("User not found");
  }
  const blogs = await Blog.deleteMany({ author: userId });
  if (!blogs) {
    res.status(404);
    throw new Error("No blogs found");
  }
  if (blogs.deletedCount === 0) {
    return res.status(200).json({ message: "No blogs found" });
  }
  res.status(200).json({ message: "All blogs deleted successfully" });
});
