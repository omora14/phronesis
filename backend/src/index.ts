import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import sentimentRoutes from "./routes/sentimentRoutes";
dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

app.use("/api/sentiment", sentimentRoutes);

app.listen(5000, "0.0.0.0", () => {
  console.log("Server running on port 5000");
});