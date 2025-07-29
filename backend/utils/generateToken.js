import jwt from "jsonwebtoken";

const generateToken = (userId, res) => {
  // Generate the token
  const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });

  // Set the token as a cookie
  res.cookie("token", token, {
    httpOnly: true,
    // secure: process.env.NODE_ENV === "production",
    sameSite: "none",
    secure: true,
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  });

  return token; // Optional: Return the token if needed
};

export default generateToken;
