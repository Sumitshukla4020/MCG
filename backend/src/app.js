// app.js
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import session from "express-session";

const app = express();

app.use(cors({
  origin: process.env.CORS_ORIGIN,
  credentials: true,
}));
app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(express.static("public"));
app.use(cookieParser());

// Routes
import authRouter from './routes/authRoutes.js';
import sessionRouter from './routes/sessionRoutes.js';
import aiRouter from './routes/llmRoutes.js';

app.use("/api/v1/auth", authRouter);
app.use("/api/sessions", sessionRouter);
app.use("/api/ai", aiRouter);

export default app;
