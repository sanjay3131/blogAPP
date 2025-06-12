import mongoose from "mongoose";
const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: function () {
        // Password required only if not a Google user
        return !this.googleId;
      },
    },
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },
    profilePic: {
      type: String,
      default: "",
    },
    profilePublicPicId: {
      type: String,
      default: "",
    },
    googleId: {
      type: String,
      default: "",
    },
    bio: {
      type: String,
      default: "",
    },
    website: {
      type: String,
      default: "",
    },
    socialLinks: {
      twitter: {
        type: String,
        default: "",
      },
      facebook: {
        type: String,
        default: "",
      },
      instagram: {
        type: String,
        default: "",
      },
    },
    following: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    followers: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    blogPosts: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Blog",
      },
    ],
    savedPosts: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Blog",
      },
    ],
    likedPosts: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Blog",
      },
    ],
    notifications: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Notification",
      },
    ],
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("User", userSchema);
