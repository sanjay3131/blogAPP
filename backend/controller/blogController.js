import asyncHandler from "express-async-handler";
import Blog from "../models/blogModel.js";
import User from "../models/userModel.js";
import cloudinary from "cloudinary";
import pkg from "@treeee/youtube-caption-extractor";

// @desc    Post a blog
// @route   POST /api/blogs/create
// @access  Private
const createBlog = asyncHandler(async (req, res) => {
  const { title, content, tags } = req.body;
  const userId = req.user?._id;
  const user = await User.findById(userId);
  if (!user) {
    res.status(404);
    throw new Error("User not found");
  }

  if (!title || !content || !tags) {
    res.status(400);
    throw new Error("Please fill all the fields");
  }
  let imageUrl = "";
  let imagePublicId = "";
  if (req.file) {
    imageUrl = req.file.path; // secure_url from cloudinary
    imagePublicId = req.file.filename; // public_id from cloudinary
  }

  const blog = await Blog.create({
    title,
    content,
    tags,
    image: imageUrl,
    imagePublicId,
    author: userId,
    // ✅ Corrected field name
  });
  user.blogPosts.push(blog._id);
  await user.save();

  res.status(201).json({
    message: "Blog created successfully",
    blog,
  });
});

// get all blogs
// @route   GET /api/blogs
const getBlogs = asyncHandler(async (req, res) => {
  const blogs = await Blog.find({})
    .sort({ createdAt: -1 })
    .populate("author", "name email");
  if (!blogs) {
    res.status(404);
    throw new Error("No blogs found");
  }
  if (blogs.length === 0) {
    return res.status(200).json({ message: "No blogs found" });
  }

  res.status(200).json(blogs);
});

// update a blog
// @route   PUT /api/blogs/:id
const updateBlog = asyncHandler(async (req, res) => {
  const { title, content, tags } = req.body;
  const blogId = req.params.id;

  const blog = await Blog.findById(blogId);
  if (!blog) {
    return res.status(404).json({ message: "Blog not found" });
  }

  const userId = req.user._id;
  if (blog.author.toString() !== userId.toString()) {
    return res
      .status(403)
      .json({ message: "You are not authorized to update this blog" });
  }
  if (req.file) {
    if (blog.imagePublicId) {
      await cloudinary.uploader.destroy(blog.imagePublicId);
    }
    blog.image = req.file.path;
    blog.imagePublicId = req.file.filename;
  }
  // Only update the fields provided
  if (title !== undefined) blog.title = title;
  if (content !== undefined) blog.content = content;
  if (tags !== undefined) blog.tags = tags;

  await blog.save();

  res.status(200).json({
    message: "Blog updated successfully",
    blog,
  });
});

//delete a blog by user
// @route   DELETE /api/blogs/:id
const deleteBlog = asyncHandler(async (req, res) => {
  const blogId = req.params.id;
  const blog = await Blog.findById(blogId);
  if (!blog) {
    return res.status(404).json({ message: "Blog not found" });
  }
  const userId = req.user._id;
  if (blog.author.toString() !== userId.toString()) {
    return res
      .status(403)
      .json({ message: "You are not authorized to delete this blog" });
  }
  await Blog.findByIdAndDelete(blogId);
  await User.findByIdAndUpdate(userId, {
    $pull: { blogPosts: blogId },
  });

  res.status(200).json({ message: "Blog deleted successfully" });
});

//delete all blogs
// @route   DELETE /api/blogs
const deleteAllBlogsOfUser = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const user = await User.findById(userId);
  if (!user) {
    res.status(404);
    throw new Error("User not found");
  }

  const blogs = await Blog.deleteMany({ author: userId });
  if (blogs.deletedCount === 0) {
    return res.status(200).json({ message: "No blogs found" });
  }

  // Optional: Clear blog references in user
  user.blogPosts = [];
  await user.save();

  res.status(200).json({ message: "All blogs deleted successfully" });
});
//like a blog
// @route   POST /api/blogs/like/:id
const toggleLikeBlog = asyncHandler(async (req, res) => {
  const blogId = req.params.id;
  const userId = req.user._id;
  const blog = await Blog.findById(blogId);
  if (!blog) {
    return res.status(404).json({ message: "Blog not found" });
  }
  if (blog.likedBy.includes(userId)) {
    blog.likes -= 1;
    blog.likedBy = blog.likedBy.filter(
      (id) => id.toString() !== userId.toString()
    );
    await blog.save();
    await User.findByIdAndUpdate(userId, {
      $pull: { likedPosts: blogId },
    });
    return res.status(200).json({ message: "Blog unliked successfully", blog });
  }
  blog.likes += 1;
  blog.likedBy.push(userId);
  await User.findByIdAndUpdate(userId, {
    $addToSet: { likedPosts: blogId },
  });
  await blog.save();
  res.status(200).json({ message: "Blog liked successfully", blog });
});

//upload image for blog
// @route   POST /api/blogs/upload/:id

const uploadImage = asyncHandler(async (req, res) => {
  const blogId = req.params.id;
  const userId = req.user._id;

  // Validate blog ownership
  const blog = await Blog.findById(blogId);
  if (!blog) {
    return res.status(404).json({ message: "Blog not found" });
  }

  if (blog.author.toString() !== userId.toString()) {
    return res
      .status(403)
      .json({ message: "You are not authorized to update this blog" });
  }

  // Validate file
  const file = req.file;
  const publicId = file.filename;
  console.log(publicId);

  if (!file) {
    return res.status(400).json({ message: "No file uploaded" });
  }

  // Update blog image
  blog.image = file.path;
  blog.imagePublicId = publicId;
  await blog.save();

  res.status(200).json({
    message: "Image uploaded successfully",
    blog,
  });
});

//delete image
// @route   DELETE /api/blogs/delete/image/:id
const deleteImage = asyncHandler(async (req, res) => {
  const blogId = req.params.id;
  const userId = req.user._id;
  const blog = await Blog.findById(blogId);
  if (!blog) {
    return res.status(404).json({ message: "Blog not found" });
  }
  if (blog.author.toString() !== userId.toString()) {
    return res
      .status(403)
      .json({ message: "You are not authorized to update this blog" });
  }
  if (!blog.imagePublicId) {
    return res.status(400).json({ message: "No image to delete" });
  }
  // Delete image from Cloudinary
  await cloudinary.v2.uploader.destroy(blog.imagePublicId, (error, result) => {
    if (error) {
      return res.status(500).json({ message: "Error deleting image", error });
    }
  });
  // Remove image from blog
  blog.image = undefined;
  blog.imagePublicId = undefined;
  await blog.save();
  res.status(200).json({
    message: "Image deleted successfully",
    blog,
  });
});
//toogle follow
// @route   POST /api/blogs/follow/:id
const toggleFollow = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const followAuthorId = req.params.id;

  if (userId.toString() === followAuthorId.toString()) {
    return res.status(400).json({ message: "You cannot follow yourself" });
  }

  const user = await User.findById(userId);
  const followAuthor = await User.findById(followAuthorId);

  if (!user || !followAuthor) {
    return res.status(404).json({ message: "User not found" });
  }

  const isFollowing = user.following.includes(followAuthorId);

  if (isFollowing) {
    await User.findByIdAndUpdate(userId, {
      $pull: { following: followAuthorId },
    });

    await User.findByIdAndUpdate(followAuthorId, {
      $pull: { followers: userId },
    });

    return res.status(200).json({ message: "Unfollowed successfully" });
  } else {
    await User.findByIdAndUpdate(userId, {
      $addToSet: { following: followAuthorId },
    });

    await User.findByIdAndUpdate(followAuthorId, {
      $addToSet: { followers: userId },
    });

    return res.status(200).json({ message: "Followed successfully" });
  }
});
//user followers
// @route   GET /api/blogs/followers/
const UserFollowers = asyncHandler(async (req, res) => {
  const { userId } = req.body;
  console.log(userId);

  if (!userId) {
    return res.status(400).json({ message: "User not found" });
  }
  const user = await User.findById(userId).populate(
    "followers",
    "name email profilePic"
  );
  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }
  if (user.followers.length === 0) {
    return res.status(200).json({ message: "No followers found" });
  }
  res.status(200).json({ followers: user.followers });
});

//user following
// @route   GET /api/blogs/following/
const userFollowing = asyncHandler(async (req, res) => {
  const { userId } = req.body;
  if (!userId) {
    return res.status(400).json({ message: "User not found" });
  }
  const user = await User.findById(userId).populate(
    "following",
    "name email profilePic"
  );
  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }
  if (user.following.length === 0) {
    return res.status(200).json({ message: "No following found" });
  }
  res.status(200).json({ following: user.following });
});
//get single blog
//@route GET /api/blogs/:id
const getSingleBlog = asyncHandler(async (req, res) => {
  const blogId = req.params.id;
  if (!blogId) {
    return res.status(400).json({ message: "Blog ID is required" });
  }
  const blog = await Blog.findById(blogId).populate("author", "name email");

  if (!blog) {
    return res.status(404).json({ message: "Blog not found" });
  }
  res.status(200).json(blog);
});
//get all blogs of user

const allBlogsOfUser = asyncHandler(async (req, res) => {
  const author = req.user._id;
  if (!author)
    return res.status(404).json({
      message: "author not found",
    });
  const userBlogs = await Blog.find({ author })
    .populate("author", "name email")
    .sort({ createdAt: -1 });
  if (userBlogs) {
    return res.status(200).json(userBlogs);
  }
  res.status(404).json({ message: "not blog found" });
});
// text generation from youtube videos// Extract YouTube Video ID
const { getSubtitles } = pkg;

const extractYouTubeId = (url) => {
  const m = url.match(/(?:v=|youtu\.be\/)([^&]+)/);
  return m ? m[1] : null;
};

const textGenerationApi = asyncHandler(async (req, res) => {
  const user = req.user?._id;
  if (!user) return res.status(401).json({ message: "User not found" });

  const { videoUrl } = req.body;
  if (!videoUrl)
    return res.status(400).json({ message: "No video URL provided" });

  const videoID = extractYouTubeId(videoUrl);
  if (!videoID) return res.status(400).json({ message: "Invalid YouTube URL" });

  try {
    const subtitles = await getSubtitles({ videoID, lang: "en" });

    if (!subtitles || subtitles.length === 0)
      return res.status(404).json({ message: "No video transcript found" });

    const fullText = subtitles.map((s) => s.text).join(" ");

    res.status(200).json({
      message: "Transcript fetched successfully",
      transcript: fullText,
      transcriptChunks: subtitles,
    });
  } catch (error) {
    console.error("Caption fetch error:", error.message);
    res
      .status(500)
      .json({ message: "Failed to fetch transcript", error: error.message });
  }
});
const getBlogsByTags = asyncHandler(async (req, res) => {
  const { tags } = req.body; // tags should be an array

  if (!Array.isArray(tags) || tags.length === 0) {
    return res.status(400).json({ message: "Tags must be a non-empty array" });
  }

  // Find blogs where at least one tag matches
  const selectedBlogs = await Blog.find({ tags: { $in: tags } });

  if (!selectedBlogs || selectedBlogs.length === 0)
    return res.status(200).json({ message: "No blogs found" });

  res.status(200).json({ selectedBlogs });
});
//get single user
const getSingleUser = asyncHandler(async (req, res) => {
  const userId = req.params.id;
  console.log(userId);

  if (!userId)
    return res.status(400).json({
      message: "userid is not there ",
    });
  const user = await User.findById(userId)
    .populate("blogPosts")
    .populate("followers", "name email profilePic")
    .populate("following", "name email profilePic");
  console.log(user);

  if (!user)
    return res.status(404).json({
      message: "user not found",
    });
  res.status(200).json(user);
});
// search blog by Titl e

const getBlogByTitle = asyncHandler(async (req, res) => {
  const searchQuery = req.query.query || "";

  if (!searchQuery)
    return res.status(400).json({
      message: "no title found to search",
    });

  const searchBlog = await Blog.find({
    title: { $regex: "^" + searchQuery, $options: "i" },
  });
  res.status(200).json(searchBlog);
});
export {
  createBlog,
  getBlogs,
  updateBlog,
  deleteAllBlogsOfUser,
  deleteBlog,
  toggleLikeBlog,
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
  getBlogByTitle,
};
