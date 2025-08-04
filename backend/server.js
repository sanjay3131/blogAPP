import express from "express";
import cors from "cors";
import { configDotenv } from "dotenv";
import connectDb from "./databaseConfig/connectDb.js";
import passport from "passport";
import session from "express-session";
import cookieParser from "cookie-parser";
import setupGoogleStrategy from "./passport/googleStrategy.js";
import authRoutes from "./routes/authRoutes.js";
import blogRoutes from "./routes/blogRoutes.js";
import path from "path";
import { fileURLToPath } from "url";

// Config
configDotenv();
const app = express();
const PORT = process.env.PORT || 5000;

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  cors({
    origin: process.env.Vercel_Frontend_URL,
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);
app.use(cookieParser());
app.use(
  session({ secret: "keyboard cat", resave: false, saveUninitialized: false })
);
app.use(passport.initialize());
app.use(passport.session());
setupGoogleStrategy(passport);

// Passport serialize/deserialize
passport.serializeUser((user, done) => done(null, user));
passport.deserializeUser((obj, done) => done(null, obj));

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/blogs", blogRoutes);

// ✅ Serve frontend in production
if (process.env.NODE_ENV === "production") {
  const __filename = fileURLToPath(import.meta.url);
  const __dirname = path.dirname(__filename);

  app.use(express.static(path.join(__dirname, "../frontend/dist")));

  // Catch-all route - should be LAST
  app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "../frontend/dist/index.html"));
  });
}

// Start server
app.listen(PORT, () => {
  connectDb();
  console.log(`Server is running on port ${PORT}`);
});
