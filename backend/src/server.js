import dotenv from "dotenv";
dotenv.config();

import express from "express";

const app = express();
const PORT = Number(process.env.PORT || 5000);

app.get("/api/health", (req, res) => {
  res.json({ ok: true, app: "Sunnetna Trpeza" });
});

app.listen(PORT, () => {
  console.log(`✅ Backend radi na http://localhost:${PORT}`);
});
