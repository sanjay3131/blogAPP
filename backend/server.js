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
//config
configDotenv();
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// CORS configuration
const allowedOrigins = [
  process.env.Vercel_Frontend_URL,
  process.env.Localhost,
  process.env.Render_Frontend_URL,
];
app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true, // if you're using cookies/auth
  })
);

const PORT = process.env.PORT || 5000;
app.use(cookieParser());
app.use(
  session({ secret: "keyboard cat", resave: false, saveUninitialized: false })
);
app.use(passport.initialize());
app.use(passport.session());
setupGoogleStrategy(passport);

// Serialize user
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
});
