import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import authRouter from "./routes/authRoutes.js";
import sessionRoutes from './routes/sessionRoutes.js';
import generateRoutes from './routes/llmRoutes.js';
import exportRoutes from './routes/llmRoutes.js'; 




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
app.use("/api/v1/auth", authRouter);

// Session Routes 
app.use("/api/v1/sessions", sessionRoutes);

//llm
app.use('/api/v1', generateRoutes);
app.use('/api', generateRoutes);

app.use('/api', exportRoutes);





export default app;