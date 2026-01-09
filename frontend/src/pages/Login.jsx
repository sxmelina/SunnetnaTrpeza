import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../api/client";
import { useAuth } from "../auth/AuthContext";
import "./Login.css";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    setErr("");
    setLoading(true);

    try {
      const res = await api.post("/auth/login", {
        email: email.trim(),
        password,
      });

      login(res.data);
      navigate("/recipes", { replace: true });
    } catch (e) {
      setErr(e?.response?.data?.message || "Prijava nije uspjela.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="login-page">
      <div className="login-card">
        <h2 className="login-title">Prijava</h2>

        {err && <p className="login-error">{err}</p>}

        <form onSubmit={handleSubmit}>
          <label className="login-label">Email</label>
          <input
            className="login-input"
            placeholder="npr. amina@mail.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <label className="login-label">Lozinka</label>
          <input
            className="login-input"
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <button className="login-btn" disabled={loading} type="submit">
            {loading ? "Prijava..." : "Prijavi se"}
          </button>

          <p className="login-footer">
            Nemaš račun? <Link to="/register">Registruj se</Link>
          </p>
        </form>
      </div>
    </div>
  );
}
