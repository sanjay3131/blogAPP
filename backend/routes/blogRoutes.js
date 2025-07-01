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
  allBlogsOfUser,
  textGenerationApi,
  getBlogsByTags,
  getSingleUser,
} from "../controller/blogController.js";
import { protect } from "../middleware/authmiddleware.js";
import getUpload from "../middleware/upload.js";
import { imageGeneration } from "../utils/imageGeneration.js";

const router = express.Router();

const uploadBlogImage = getUpload("blog-images"); // folder name

// ✅ Post a blog with image upload support
router.post("/create", protect, uploadBlogImage.single("image"), createBlog);

// ✅ Update a blog with image upload support
router.put("/update/:id", protect, uploadBlogImage.single("image"), updateBlog);

// Get all blogs
router.get("/", getBlogs);
//get blogs by Tags
router.post("/selectedTags", getBlogsByTags);

// Get a single blog by ID
router.get("/:id", getSingleBlog);

// Delete a blog by author
router.delete("/delete/:id", protect, deleteBlog);

// Delete all blogs by author
router.delete("/delete", protect, deleteAllBlogsOfUser);

// Toggle blog like
router.post("/like/:id", protect, toggleLikeBlog);

// 🔥 You can remove this upload route if you handle image upload inside create and update
router.post(
  "/upload/:id",
  protect,
  uploadBlogImage.single("image"),
  uploadImage
);

// Delete image
router.delete("/delete/image/:id", protect, deleteImage);

// Follow/unfollow
router.post("/follow/:id", protect, toggleFollow);

// Image generation
router.post("/image/generation", protect, imageGeneration);

// User followers
router.get("/user/followers", protect, UserFollowers);

// User following
router.get("/user/following", protect, userFollowing);

// user Blogs
router.get("/user/blogs", protect, allBlogsOfUser);

//Get single user
router.get("/user/:id", getSingleUser);

//Text generation
router.get("/video/textgeneration", protect, textGenerationApi);

export default router;
