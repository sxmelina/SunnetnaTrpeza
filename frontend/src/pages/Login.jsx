import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/client";
import { useAuth } from "../auth/AuthContext";

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

      // backend vraća { token, user }
      login(res.data);

      // idi na recepte
      navigate("/recipes", { replace: true });
    } catch (e) {
      setErr(e?.response?.data?.message || "Prijava nije uspjela.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={styles.card}>
      <h2 style={styles.h2}>Prijava</h2>

      {err && <p style={styles.error}>{err}</p>}

      <form onSubmit={handleSubmit}>
        <label style={styles.label}>Email</label>
        <input
          style={styles.input}
          placeholder="npr. amina@mail.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <label style={styles.label}>Lozinka</label>
        <input
          style={styles.input}
          type="password"
          placeholder="••••••••"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button style={styles.btn} disabled={loading} type="submit">
          {loading ? "Prijava..." : "Prijavi se"}
        </button>
        <p style={{ marginTop: 12, fontSize: 13 }}>
          Nemaš račun? <a href="/register">Registruj se</a>
        </p>

      </form>
    </div>
  );
}

const styles = {
  card: {
    background: "#fff",
    border: "1px solid #eee",
    borderRadius: 16,
    padding: 20,
    maxWidth: 420,
    boxShadow: "0 10px 30px rgba(0,0,0,0.05)",
    margin: "40px auto",
  },
  h2: { marginTop: 0 },
  error: { marginTop: 0, color: "crimson", fontSize: 13 },
  label: { display: "block", marginTop: 12, marginBottom: 6, fontSize: 14 },
  input: {
    width: "100%",
    padding: "10px 12px",
    borderRadius: 12,
    border: "1px solid #ddd",
    outline: "none",
  },
  btn: {
    width: "100%",
    marginTop: 16,
    padding: "10px 12px",
    borderRadius: 12,
    border: "none",
    background: "#e7d2b5",
    cursor: "pointer",
    fontWeight: 600,
  },
};
