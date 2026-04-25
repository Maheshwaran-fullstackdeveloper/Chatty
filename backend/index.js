import dotenv from "dotenv";
import express from "express";
dotenv.config();
import { connectDB } from "./src/lib/db.js";
import authRoutes from "./src/routes/auth.route.js";

const PORT = process.env.PORT || 5001;
const app = express();

app.use(express.json());
app.use("/api/auth", authRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  connectDB();
});
