import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../api/client";
import "./Register.css";

export default function Register() {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    setErr("");
    setLoading(true);

    try {
      await api.post("/auth/register", {
        fullName: fullName.trim(),
        email: email.trim(),
        password,
      });

      navigate("/login");
    } catch (e) {
      console.log("REGISTER ERROR:", e);
      console.log("REGISTER RESPONSE:", e?.response);
      setErr(
        e?.response?.data?.message ||
          e?.response?.data?.error ||
          `Registracija nije uspjela. (HTTP ${e?.response?.status || "?"})`
      );
    }
finally {
      setLoading(false);
    }
  }

  return (
    <div className="register-page">
      <div className="register-card">
        <h2 className="register-title">Registracija</h2>

        {err && <p className="register-error">{err}</p>}

        <form onSubmit={handleSubmit}>
          <label className="register-label">Ime i prezime</label>
          <input
            className="register-input"
            placeholder="npr. Amina Subašić"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
          />

          <label className="register-label">Email</label>
          <input
            className="register-input"
            placeholder="npr. amina@mail.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <label className="register-label">Lozinka</label>
          <input
            className="register-input"
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <button className="register-btn" disabled={loading} type="submit">
            {loading ? "Registrujem..." : "Registruj se"}
          </button>

          <p className="register-footer">
            Već imaš račun? <Link to="/login">Prijavi se</Link>
          </p>
        </form>
      </div>
    </div>
  );
}
