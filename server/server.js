import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import connectDB from "./config/db.js";
import errorMiddleware, { notFound } from "./middleware/errorMiddleware.js";
import authRoutes from "./routes/authRoutes.js";
import transactionRoutes from "./routes/transactionRoutes.js";
import dashboardRoutes from "./routes/dashboardRoutes.js";
import assistantRoutes from "./routes/assistantRoutes.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT;

// Connect database.
connectDB();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(
  cors({
    origin: process.env.CLIENT_URL,
    credentials: true,
  }),
);

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/transactions", transactionRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/assistant", assistantRoutes);

app.use(notFound);
app.use(errorMiddleware);

// Start server locally
if (process.env.NODE_ENV !== "production") {
  app.listen(PORT, () => {
    console.log(
      `Server running in ${process.env.NODE_ENV || "development"} mode on port ${PORT}`,
    );
  });
}

export default app;