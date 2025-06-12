import express from "express";
import {
  createBlog,
  deleteAllBlogsOfUser,
  deleteBlog,
  getBlogs,
  toggleLikeBlog,
  updateBlog,
  uploadImage,
  deleteImage,
  toggleFollow,
  UserFollowers,
  userFollowing,
  getSingleBlog,
} from "../controller/blogController.js";
import { protect } from "../middleware/authmiddleware.js";
import getUpload from "../middleware/upload.js";
import { imageGeneration } from "../utils/imageGeneration.js";

const router = express.Router();

// Post a blog
router.post("/create", protect, createBlog);
// Get all blogs
router.get("/", getBlogs);
// Get a single blog by ID
router.get("/:id", getSingleBlog);
router.put("/update/:id", protect, updateBlog);
//delete a blog by author
router.delete("/delete/:id", protect, deleteBlog);
//delete all blog by author
router.delete("/delete", protect, deleteAllBlogsOfUser);
//toogle blog like
router.post("/like/:id", protect, toggleLikeBlog);
//ulpoad image
const uploadBlogImage = getUpload("blog-images"); // folder name
router.post(
  "/upload/:id",
  protect,
  uploadBlogImage.single("image"),
  uploadImage
);

//delete image
router.delete("/delete/image/:id", protect, deleteImage);
//follow/unfollow
router.post("/follow/:id", protect, toggleFollow);
//image generation
router.post("/image/generation", protect, imageGeneration);
//user followers
router.get("/followers", protect, UserFollowers);
//user following
router.get("/following", protect, userFollowing);

export default router;
