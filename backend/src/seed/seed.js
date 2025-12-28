import dotenv from "dotenv";
dotenv.config();

import bcrypt from "bcrypt";
import { sequelize } from "../config/db.js";
import { User } from "../models/User.js";
import "../models/index.js";

async function seed() {
  await sequelize.authenticate();
  await sequelize.sync({ alter: true });

  const email = "admin@demo.com";
  const exists = await User.findOne({ where: { email } });

  if (!exists) {
    const passwordHash = await bcrypt.hash("Admin123!", 10);
    await User.create({
      fullName: "Admin Demo",
      email,
      passwordHash
    });
    console.log("✅ Kreiran demo korisnik: admin@demo.com / Admin123!");
  } else {
    console.log("ℹ️ Demo korisnik već postoji.");
  }

  process.exit(0);
}

seed().catch((e) => {
  console.error(e);
  process.exit(1);
});
