import dotenv from "dotenv";
dotenv.config();

import { app } from "./app.js";
import { sequelize } from "./config/db.js";
import "./models/index.js";

const PORT = Number(process.env.PORT || 5000);

async function start() {
  try {
    await sequelize.authenticate();
    console.log("✅ Spojeno na MySQL!");

    await sequelize.sync({ alter: true });
    console.log("✅ Tabele kreirane/syncovane!");

    app.listen(PORT, () => console.log(`✅ Backend radi na http://localhost:${PORT}`));
  } catch (err) {
    console.error("❌ DB/server greška:", err);
  }
}

start();
