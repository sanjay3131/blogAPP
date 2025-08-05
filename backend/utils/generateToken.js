import jwt from "jsonwebtoken";

const generateToken = (userId, res) => {
  try {
    console.log("🔑 Generating token for user ID:", userId);
    console.log("🔑 JWT Secret exists:", !!process.env.JWT_SECRET);

    // Generate the token
    const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    console.log("✅ Token generated successfully, length:", token.length);

    // Set the token as a cookie with proper cross-origin settings
    res.cookie("token", token, {
      httpOnly: true,
      secure: true, // Always true for production cross-origin
      sameSite: "none", // Required for cross-origin cookies
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      path: "/", // Make sure cookie is available on all paths
    });

    console.log("🍪 Cookie set with settings:", {
      httpOnly: true,
      secure: true,
      sameSite: "none",
      maxAge: 7 * 24 * 60 * 60 * 1000,
      path: "/",
    });

    return token;
  } catch (error) {
    console.error("❌ Error generating token:", error);
    throw error;
  }
};

export default generateToken;
