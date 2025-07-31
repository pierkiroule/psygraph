import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import router from "./server/index.js";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// API montée sur /api
app.use("/api", router);

// 404 JSON
app.use((req, res) => {
  res.status(404).json({ error: "Route introuvable" });
});

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`🚀 Backend sur http://localhost:${PORT}`);
});