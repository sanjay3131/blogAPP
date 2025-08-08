import express from "express";
import cors from "cors";
import { configDotenv } from "dotenv";
import connectDb from "./databaseConfig/connectDb.js";
import passport from "passport";
import cookieParser from "cookie-parser";
import setupGoogleStrategy from "./passport/googleStrategy.js";
import authRoutes from "./routes/authRoutes.js";
import blogRoutes from "./routes/blogRoutes.js";

//config
configDotenv();
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// CORS configuration - fixed for production
app.use(
  cors({
    origin: [process.env.FRONTEND_URL],

    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);

const PORT = process.env.PORT || 5000;

app.use(cookieParser());

// Since you're not using sessions, remove session middleware
app.use(passport.initialize());
// Remove passport.session() since you're not using sessions
setupGoogleStrategy(passport);

// Since you're not using sessions, you might not need these
// But keep them if your googleStrategy.js uses them
passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser((obj, done) => {
  done(null, obj);
});

app.get("/", (req, res) => {
  res.send("<h1>Welcome to the backend server!</h1>");
});

//routes
app.use("/api/auth", authRoutes);
app.use("/api/blogs", blogRoutes);

app.listen(PORT, () => {
  // Connect to MongoDB
  connectDb();
  console.log(`Server is running on port ${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV}`);
  console.log(
    `Frontend URL: ${
      process.env.FRONTEND_URL || process.env.Vercel_Frontend_URL
    }`
  );
});
