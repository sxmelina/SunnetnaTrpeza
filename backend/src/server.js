import dotenv from "dotenv";
dotenv.config();

import express from "express";
import { sequelize } from "./config/db.js";
import "./models/index.js";

const app = express();
const PORT = Number(process.env.PORT || 5000);


app.get("/api/health", async (req, res) => {
  try {
    await sequelize.authenticate();
    res.json({
      uspjeh: true,
      aplikacija: "Sunnetna Trpeza",
      baza: "povezana"
    });
  } catch (greska) {
    res.status(500).json({
      uspjeh: false,
      baza: "nije povezana",
      poruka: "Greška pri povezivanju sa bazom",
      detalji: String(greska)
    });
  }
});

async function pokreniServer() {
  try {
    await sequelize.authenticate();
    console.log("✅ Uspješno povezano sa MySQL bazom.");

    await sequelize.sync({ alter: true });
    console.log("✅ Tabele su uspješno kreirane/sinhronizovane.");

    app.listen(PORT, () => {
      console.log(`✅ Backend aplikacija radi na http://localhost:${PORT}`);
    });
  } catch (greska) {
    console.error("❌ Greška pri pokretanju servera:", greska);
  }
}

pokreniServer();

