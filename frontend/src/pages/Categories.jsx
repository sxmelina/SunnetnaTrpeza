import { useEffect, useState } from "react";
import api from "../api/client";
import { useAuth } from "../auth/AuthContext";
import "./Categories.css";

export default function Categories() {
  const { token } = useAuth();

  const [categories, setCategories] = useState([]);
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

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
      setSaving(true);
      await api.post(
        "/categories",
        { name: name.trim() },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setName("");
      fetchCategories();
    } catch {
      setError("Spremanje nije uspjelo.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="categories-shell">
      <div className="categories-page">
        <div className="categories-header">
          <div>
            <h2 className="categories-title">Kategorije</h2>
            <p className="categories-subtitle">
              Dodaj kategorije (npr. Med, Napici, Žitarice…) da bi ih koristila pri dodavanju recepata.
            </p>
          </div>
        </div>

        <div className="categories-card">
          <h3 className="categories-h3">Dodaj kategoriju</h3>

          {error && <p className="categories-error">{error}</p>}

          <form onSubmit={handleSubmit} className="categories-form">
            <input
              className="categories-input"
              placeholder="npr. Med, Napici, Žitarice..."
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <button className="categories-btn" disabled={saving}>
              {saving ? "Spremam..." : "Dodaj"}
            </button>
          </form>
        </div>

        <div className="categories-card">
          <div className="categories-listTop">
            <h3 className="categories-h3" style={{ margin: 0 }}>
              Lista kategorija
            </h3>
            <span className="categories-count">Ukupno: {categories.length}</span>
          </div>

          {categories.length === 0 ? (
            <p className="categories-empty">Nema kategorija.</p>
          ) : (
            <div className="categories-grid">
              {categories.map((c) => (
                <span className="categories-chip" key={c.id}>
                  <span className="categories-chipDot" />
                  {c.name}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
