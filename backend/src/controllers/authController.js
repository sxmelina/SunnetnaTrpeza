import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { User } from "../models/User.js";

function signToken(user) {
  return jwt.sign(
    { id: user.id, email: user.email },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || "2h" }
  );
}

export async function register(req, res) {
  try {
    const { fullName, email, password } = req.body;

    if (!fullName || !email || !password) {
      return res.status(400).json({ message: "Ime, email i lozinka su obavezni." });
    }

    const existing = await User.findOne({ where: { email } });
    if (existing) {
      return res.status(409).json({ message: "Korisnik sa ovim emailom već postoji." });
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const user = await User.create({
      fullName,
      email,
      passwordHash,
    });

    const token = signToken(user);

    return res.status(201).json({
      message: "Uspješna registracija.",
      token,
      user: { id: user.id, fullName: user.fullName, email: user.email },
    });
  } catch (err) {
    return res.status(500).json({ message: "Greška na serveru.", error: String(err) });
  }
}

export async function login(req, res) {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Email i lozinka su obavezni." });
    }

    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(401).json({ message: "Neispravan email ili lozinka." });
    }

    const ok = await bcrypt.compare(password, user.passwordHash);
    if (!ok) {
      return res.status(401).json({ message: "Neispravan email ili lozinka." });
    }

    const token = signToken(user);

    return res.json({
      message: "Uspješna prijava.",
      token,
      user: { id: user.id, fullName: user.fullName, email: user.email },
    });
  } catch (err) {
    return res.status(500).json({ message: "Greška na serveru.", error: String(err) });
  }
}
