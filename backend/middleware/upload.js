import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import cloudinary from "../utils/cloudinaryConfig.js";

// Function that returns multer upload middleware with custom folder
const getUpload = (folder = "blog-images") => {
  const storage = new CloudinaryStorage({
    cloudinary,
    params: {
      folder, // dynamic folder (e.g., blog-images or profile-pics)
      allowed_formats: ["jpg", "png", "jpeg", "webp"],
      transformation: [{ width: 800, height: 600, crop: "limit" }],
    },
  });

  return multer({ storage });
};

export default getUpload;
