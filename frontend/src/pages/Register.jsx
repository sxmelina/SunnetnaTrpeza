import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/client";

export default function Register() {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");

    try {
      await api.post("/auth/register", {
        fullName,
        email,
        password,
      });

      // nakon uspješne registracije -> login
      navigate("/login");
    } catch (err) {
      setError("Registracija nije uspjela.");
    }
  }

  return (
    <form onSubmit={handleSubmit} style={styles.card}>
      <h2 style={styles.h2}>Registracija</h2>

      {error && <p style={{ color: "red" }}>{error}</p>}

      <label style={styles.label}>Ime i prezime</label>
      <input
        style={styles.input}
        value={fullName}
        onChange={(e) => setFullName(e.target.value)}
      />

      <label style={styles.label}>Email</label>
      <input
        style={styles.input}
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />

      <label style={styles.label}>Lozinka</label>
      <input
        style={styles.input}
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />

      <button style={styles.btn}>Registruj se</button>
    </form>
  );
}

const styles = {
  card: {
    background: "#fff",
    borderRadius: 16,
    padding: 20,
    maxWidth: 420,
    margin: "0 auto",
  },
  h2: { marginTop: 0 },
  label: { marginTop: 12, display: "block" },
  input: { width: "100%", padding: 10 },
  btn: { marginTop: 16, padding: 10 },
};
