import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import authRoutes from "./routes/auth";
import problemRoutes from "./routes/problems";
import solutionRoutes from "./routes/solutions";
import morgan from "morgan";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

mongoose
  .connect(process.env.MONGODB_URI as string)
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("MongoDB connection error:", err));

app.use("/api/auth", authRoutes);
app.use("/api/problems", problemRoutes);
app.use("/api/solutions", solutionRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
