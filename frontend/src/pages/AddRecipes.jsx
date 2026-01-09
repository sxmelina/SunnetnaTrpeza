import { useEffect, useState } from "react";
import api from "../api/client";
import { useAuth } from "../auth/AuthContext";

const SOURCE_TYPES = [
  { value: "HADIS", label: "Hadis" },
  { value: "KURAN", label: "Kur'an" },
  { value: "ZDRAVO", label: "Zdravo (općenito)" },
];

export default function AddRecipes() {
  const { token } = useAuth();

  const [categories, setCategories] = useState([]);
  const [error, setError] = useState("");

  // forma
  const [mode, setMode] = useState("create"); // create | edit (ako ti treba kasnije)
  const [editingId, setEditingId] = useState(null);

  const [title, setTitle] = useState("");
  const [shortDescription, setShortDescription] = useState("");
  const [instructions, setInstructions] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [sourceType, setSourceType] = useState("ZDRAVO");
  const [sourceReference, setSourceReference] = useState("");
  const [imageUrl, setImageUrl] = useState("");

  async function fetchCategories() {
    try {
      setError("");
      const res = await api.get("/categories");
      const list = Array.isArray(res.data) ? res.data : [];
      setCategories(list);

      if (!categoryId && list.length > 0) setCategoryId(String(list[0].id));
    } catch (e) {
      setError(e?.response?.data?.message || "Ne mogu učitati kategorije.");
    }
  }

  useEffect(() => {
    fetchCategories();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function resetForm() {
    setMode("create");
    setEditingId(null);
    setTitle("");
    setShortDescription("");
    setInstructions("");
    setSourceType("ZDRAVO");
    setSourceReference("");
    setImageUrl("");
    if (categories.length > 0) setCategoryId(String(categories[0].id));
    else setCategoryId("");
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");

    if (!title.trim() || !instructions.trim()) {
      setError("Naslov i upute su obavezni.");
      return;
    }
    if (!categoryId) {
      setError("Kategorija je obavezna (categoryId).");
      return;
    }
    if (!token) {
      setError("Moraš biti prijavljena da dodaješ recepte.");
      return;
    }

    const payload = {
      title: title.trim(),
      instructions: instructions.trim(),
      categoryId: Number(categoryId),
      shortDescription: shortDescription.trim() || null,
      sourceType,
      sourceReference: sourceReference.trim() || null,
      imageUrl: imageUrl.trim() || null,
    };

    try {
      const headers = { Authorization: `Bearer ${token}` };

      if (mode === "create") {
        await api.post("/recipes", payload, { headers });
      } else {
        await api.put(`/recipes/${editingId}`, payload, { headers });
      }

      resetForm();
      // (opcionalno) prebaci na listu recepata nakon dodavanja:
      // navigate("/recipes");
    } catch (e) {
      const msg = e?.response?.data?.message || "Spremanje nije uspjelo.";
      const code = e?.response?.status;
      setError(code ? `${msg} (HTTP ${code})` : msg);
    }
  }

  return (
    <div style={styles.shell}>
      <div style={styles.page}>
        <div style={styles.headerRow}>
          <div>
            <h2 style={styles.h2}>Dodaj recept</h2>
            <p style={styles.sub}>
              Unesi novi recept i sačuvaj ga u bazi.
            </p>
          </div>
        </div>

        <div style={styles.card}>
          {!token && (
            <p style={styles.warn}>⚠️ Za dodavanje moraš biti prijavljena.</p>
          )}

          {error && <p style={styles.error}>{error}</p>}

          {categories.length === 0 && (
            <p style={styles.warn}>
              ⚠️ Nema kategorija. Prvo dodaj kategorije u sekciji “Kategorije”.
            </p>
          )}

          <form onSubmit={handleSubmit} style={styles.formGrid}>
            <div style={styles.col2}>
              <label style={styles.label}>Naslov *</label>
              <input
                style={styles.input}
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="npr. Telbina"
              />
            </div>

            <div style={styles.col2}>
              <label style={styles.label}>Kategorija *</label>
              <select
                style={styles.input}
                value={categoryId}
                onChange={(e) => setCategoryId(e.target.value)}
                disabled={categories.length === 0}
              >
                {categories.map((c) => (
                  <option key={c.id} value={String(c.id)}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label style={styles.label}>Tip izvora</label>
              <select
                style={styles.input}
                value={sourceType}
                onChange={(e) => setSourceType(e.target.value)}
              >
                {SOURCE_TYPES.map((x) => (
                  <option key={x.value} value={x.value}>
                    {x.label}
                  </option>
                ))}
              </select>
            </div>

            <div style={styles.col2}>
              <label style={styles.label}>Kratki opis</label>
              <input
                style={styles.input}
                value={shortDescription}
                onChange={(e) => setShortDescription(e.target.value)}
                placeholder="kratak opis (opcionalno)"
              />
            </div>

            <div style={styles.col2}>
              <label style={styles.label}>Upute / način pripreme *</label>
              <textarea
                style={styles.textarea}
                value={instructions}
                onChange={(e) => setInstructions(e.target.value)}
                placeholder="napiši upute (obavezno)"
                rows={5}
              />
            </div>

            <div style={styles.col2}>
              <label style={styles.label}>Referenca (hadis/ajet/izvor)</label>
              <input
                style={styles.input}
                value={sourceReference}
                onChange={(e) => setSourceReference(e.target.value)}
                placeholder="npr. Sahih al-Bukhari #... / Ajet ..."
              />
            </div>

            <div style={styles.col2}>
              <label style={styles.label}>Slika (URL)</label>
              <input
                style={styles.input}
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                placeholder="https://..."
              />
            </div>

            <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
              <button style={styles.primaryBtn} type="submit" disabled={categories.length === 0}>
                Sačuvaj
              </button>

              <button style={styles.secondaryBtn} type="button" onClick={resetForm}>
                Očisti
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

const styles = {
  shell: { minHeight: "100vh", background: "#f7f1e6", padding: "24px 16px" },
  page: { maxWidth: 980, margin: "0 auto", color: "#1f1f1f" },

  headerRow: {
    display: "flex",
    gap: 12,
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 14,
  },
  h2: { margin: 0, fontSize: 28 },
  sub: { margin: "6px 0 0", opacity: 0.75 },

  card: {
    background: "#fffaf0",
    border: "1px solid rgba(0,0,0,0.06)",
    borderRadius: 16,
    padding: 16,
    boxShadow: "0 8px 20px rgba(0,0,0,0.06)",
    marginTop: 16,
  },
  warn: { margin: "6px 0 10px", color: "#8a6d3b" },
  error: { margin: "6px 0 10px", color: "crimson" },

  formGrid: { display: "grid", gap: 10 },
  col2: { gridColumn: "1 / -1" },

  label: { fontSize: 13, opacity: 0.8, display: "block", marginBottom: 6 },
  input: {
    width: "100%",
    padding: "10px 12px",
    borderRadius: 12,
    border: "1px solid rgba(0,0,0,0.12)",
    outline: "none",
    background: "white",
  },
  textarea: {
    width: "100%",
    padding: "10px 12px",
    borderRadius: 12,
    border: "1px solid rgba(0,0,0,0.12)",
    outline: "none",
    background: "white",
    resize: "vertical",
  },

  primaryBtn: {
    padding: "10px 14px",
    borderRadius: 12,
    border: "none",
    cursor: "pointer",
    background: "#c8a96a",
    color: "#1f1f1f",
    fontWeight: 700,
  },
  secondaryBtn: {
    padding: "10px 14px",
    borderRadius: 12,
    border: "1px solid rgba(0,0,0,0.14)",
    cursor: "pointer",
    background: "transparent",
    fontWeight: 600,
  },
};
