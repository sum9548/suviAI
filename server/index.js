import express from "express";
import dotenv from "dotenv";
import connectDB from "./configs/connectDB.js";
import authRouter from "./routes/auth.route.js";
import userRouter from "./routes/user.route.js";
import cookieParser from "cookie-parser";
import cors from "cors";
import assistantRouter from "./routes/assistant.route.js";
import billingRouter from "./routes/billing.route.js";

dotenv.config();

const app = express();

// Allow requests from the React frontend

const allowedOrigins = [
  "https://suviai-client.onrender.com",
  "http://127.0.0.1:5500",
  "http://localhost:5500",
];

app.use(
  cors({
    origin: allowedOrigins,
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);
// Middleware
// ===== CHANGED CODE START =====
app.use(express.json({ limit: "10mb" }));
// ===== CHANGED CODE END =====
app.use(cookieParser());

// Test route
app.get("/", (req, res) => {
  res.json({ message: "Hello from server" });
});

// API routes
app.use("/api/auth", authRouter);
app.use("/api/user", userRouter);

// billing
app.use("/api/billing", billingRouter)

app.use("/api/assistant" ,assistantRouter)

// Start server after connecting to MongoDB
const startServer = async () => {
  try {
    await connectDB();

    const PORT = process.env.PORT || 8000;

    app.listen(PORT, () => {
      console.log(`Server started on port ${PORT}`);
    });
  } catch (error) {
    console.error("Failed to start server:", error);
    process.exit(1);
  }
};

startServer();
