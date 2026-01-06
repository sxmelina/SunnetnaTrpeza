import { useEffect, useState } from "react";
import api from "../api/client";
import { useAuth } from "../auth/AuthContext";

export default function Categories() {
  const { token } = useAuth();

  const [categories, setCategories] = useState([]);
  const [name, setName] = useState("");
  const [error, setError] = useState("");

  async function fetchCategories() {
    try {
      const res = await api.get("/categories");
      setCategories(Array.isArray(res.data) ? res.data : []);
    } catch {
      setError("Ne mogu učitati kategorije.");
    }
  }

  useEffect(() => {
    fetchCategories();
  }, []);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");

    if (!name.trim()) {
      setError("Naziv kategorije je obavezan.");
      return;
    }

    if (!token) {
      setError("Moraš biti prijavljena.");
      return;
    }

    try {
      await api.post(
        "/categories",
        { name: name.trim() },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setName("");
      fetchCategories();
    } catch {
      setError("Spremanje nije uspjelo.");
    }
  }

  return (
    <div style={{ maxWidth: 600 }}>
      <h2>Kategorije</h2>

      {error && <p style={{ color: "crimson" }}>{error}</p>}

      <form onSubmit={handleSubmit} style={{ marginBottom: 20 }}>
        <input
          placeholder="npr. Med, Napici, Zitarice..."
          value={name}
          onChange={(e) => setName(e.target.value)}
          style={styles.input}
        />
        <button style={styles.btn}>Dodaj</button>
      </form>

      {categories.length === 0 ? (
        <p>Nema kategorija.</p>
      ) : (
        <ul>
          {categories.map((c) => (
            <li key={c.id}>{c.name}</li>
          ))}
        </ul>
      )}
    </div>
  );
}

const styles = {
  input: {
    width: "100%",
    padding: 10,
    borderRadius: 10,
    border: "1px solid #ccc",
    marginBottom: 10,
  },
  btn: {
    padding: "8px 14px",
    borderRadius: 10,
    border: "none",
    background: "#c8a96a",
    fontWeight: 600,
    cursor: "pointer",
  },
};
