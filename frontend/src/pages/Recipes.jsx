import { useEffect, useMemo, useState } from "react";
import api from "../api/client";
import { useAuth } from "../auth/AuthContext";

const SOURCE_TYPES = [
  { value: "HADIS", label: "Hadis" },
  { value: "KURAN", label: "Kur'an" },
  { value: "ZDRAVO", label: "Zdravo (općenito)" },
];

export default function Recipes() {
  const { token } = useAuth();

  const [recipes, setRecipes] = useState([]);
  const [categories, setCategories] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // forma
  const [mode, setMode] = useState("create"); // create | edit
  const [editingId, setEditingId] = useState(null);

  const [title, setTitle] = useState("");
  const [shortDescription, setShortDescription] = useState("");
  const [instructions, setInstructions] = useState("");
  const [categoryId, setCategoryId] = useState(""); // ✅ OBAVEZNO
  const [sourceType, setSourceType] = useState("ZDRAVO");
  const [sourceReference, setSourceReference] = useState("");
  const [imageUrl, setImageUrl] = useState("");

  const [search, setSearch] = useState("");

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return recipes;
    return recipes.filter((r) => {
      const t = (r.title || "").toLowerCase();
      const s = (r.shortDescription || "").toLowerCase();
      const c = (r.Category?.name || "").toLowerCase();
      return t.includes(q) || s.includes(q) || c.includes(q);
    });
  }, [recipes, search]);

  async function fetchRecipes() {
    try {
      setLoading(true);
      setError("");
      const res = await api.get("/recipes");
      setRecipes(Array.isArray(res.data) ? res.data : []);
    } catch (e) {
      setError(e?.response?.data?.message || "Ne mogu učitati recepte.");
    } finally {
      setLoading(false);
    }
  }

  async function fetchCategories() {
    try {
      const res = await api.get("/categories");
      const list = Array.isArray(res.data) ? res.data : [];
      setCategories(list);

      // ako nema izabrane kategorije, izaberi prvu (UX)
      if (!categoryId && list.length > 0) {
        setCategoryId(String(list[0].id));
      }
    } catch (e) {
      // ne blokiramo cijelu stranicu, ali javimo korisniku
      setError(e?.response?.data?.message || "Ne mogu učitati kategorije.");
    }
  }

  useEffect(() => {
    // učitaj i kategorije i recepte
    fetchCategories();
    fetchRecipes();
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

    // vrati na prvu kategoriju ako postoji
    if (categories.length > 0) setCategoryId(String(categories[0].id));
    else setCategoryId("");
  }

  function startEdit(recipe) {
    setMode("edit");
    setEditingId(recipe.id);
    setTitle(recipe.title || "");
    setShortDescription(recipe.shortDescription || "");
    setInstructions(recipe.instructions || "");
    setCategoryId(recipe.categoryId ? String(recipe.categoryId) : "");
    setSourceType(recipe.sourceType || "ZDRAVO");
    setSourceReference(recipe.sourceReference || "");
    setImageUrl(recipe.imageUrl || "");
    window.scrollTo({ top: 0, behavior: "smooth" });
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
      setError("Moraš biti prijavljena da dodaješ/uređuješ recepte.");
      return;
    }

    const payload = {
      title: title.trim(),
      instructions: instructions.trim(),
      categoryId: Number(categoryId), // ✅ backend traži broj
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

      await fetchRecipes();
      resetForm();
    } catch (e) {
      const msg = e?.response?.data?.message || "Spremanje nije uspjelo.";
      const code = e?.response?.status;
      setError(code ? `${msg} (HTTP ${code})` : msg);
    }
  }

  async function handleDelete(id) {
    if (!token) {
      setError("Moraš biti prijavljena da brišeš recepte.");
      return;
    }

    const ok = window.confirm("Da li sigurno želiš obrisati ovaj recept?");
    if (!ok) return;

    try {
      const headers = { Authorization: `Bearer ${token}` };
      await api.delete(`/recipes/${id}`, { headers });
      await fetchRecipes();
    } catch (e) {
      setError(e?.response?.data?.message || "Brisanje nije uspjelo.");
    }
  }

  return (
    <div style={styles.shell}>
      <div style={styles.page}>
        <div style={styles.headerRow}>
          <div>
            <h2 style={styles.h2}>Recepti</h2>
            <p style={styles.sub}>
              Sunnetna trpeza — recepti inspirisani Kur'anom, hadisima i zdravom ishranom.
            </p>
          </div>

          <button style={styles.secondaryBtn} onClick={fetchRecipes}>
            Osvježi
          </button>
        </div>

        <div style={styles.card}>
          <h3 style={styles.h3}>{mode === "create" ? "Dodaj recept" : "Uredi recept"}</h3>

          {!token && (
            <p style={styles.warn}>⚠️ Za dodavanje/uređivanje/brisanje moraš biti prijavljena.</p>
          )}

          {error && <p style={styles.error}>{error}</p>}

          {categories.length === 0 && (
            <p style={styles.warn}>
              ⚠️ Nema kategorija. Prvo dodaj kategorije u sekciji “Kategorije”, pa onda možeš dodavati recepte.
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
                {mode === "create" ? "Sačuvaj" : "Spasi izmjene"}
              </button>

              {mode === "edit" && (
                <button style={styles.secondaryBtn} type="button" onClick={resetForm}>
                  Odustani
                </button>
              )}
            </div>
          </form>
        </div>

        <div style={styles.card}>
          <div style={styles.listTop}>
            <h3 style={styles.h3}>Lista recepata</h3>

            <input
              style={{ ...styles.input, maxWidth: 320 }}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Pretraga po naslovu / opisu / kategoriji..."
            />
          </div>

          {loading ? (
            <p>Učitavam...</p>
          ) : filtered.length === 0 ? (
            <p>Nema recepata.</p>
          ) : (
            <div style={styles.grid}>
              {filtered.map((r) => (
                <div key={r.id} style={styles.recipeCard}>
                  {r.imageUrl ? (
                    <img src={r.imageUrl} alt={r.title} style={styles.image} />
                  ) : (
                    <div style={styles.imagePlaceholder}>🍯</div>
                  )}

                  <div style={{ padding: 14 }}>
                    <div style={styles.badgeRow}>
                      <span style={styles.badge}>{r.sourceType || "ZDRAVO"}</span>
                      <span style={styles.muted}>
                        {r.createdAt ? new Date(r.createdAt).toLocaleDateString() : ""}
                      </span>
                    </div>

                    <h4 style={styles.title}>{r.title}</h4>

                    {/* ✅ kategorija */}
                    <p style={{ margin: "0 0 8px", fontSize: 13, opacity: 0.85 }}>
                      <b>Kategorija:</b> {r.Category?.name || "—"}
                    </p>

                    {r.shortDescription && <p style={styles.desc}>{r.shortDescription}</p>}
                    {r.sourceReference && (
                      <p style={styles.ref}>
                        <b>Referenca:</b> {r.sourceReference}
                      </p>
                    )}

                    <div style={styles.btnRow}>
                      <button style={styles.smallBtn} onClick={() => startEdit(r)}>
                        Uredi
                      </button>
                      <button style={styles.dangerBtn} onClick={() => handleDelete(r.id)}>
                        Obriši
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
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
  h3: { margin: "0 0 10px", fontSize: 18 },
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

  listTop: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 10,
    marginBottom: 10,
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
    gap: 14,
  },

  recipeCard: {
    background: "white",
    borderRadius: 16,
    border: "1px solid rgba(0,0,0,0.06)",
    overflow: "hidden",
    boxShadow: "0 8px 18px rgba(0,0,0,0.05)",
  },
  image: { width: "100%", height: 160, objectFit: "cover" },
  imagePlaceholder: {
    width: "100%",
    height: 160,
    display: "grid",
    placeItems: "center",
    fontSize: 46,
    background: "#f1e7d6",
  },

  badgeRow: { display: "flex", justifyContent: "space-between", gap: 8, marginBottom: 8 },
  badge: {
    fontSize: 12,
    padding: "4px 10px",
    borderRadius: 999,
    background: "#f1e7d6",
    border: "1px solid rgba(0,0,0,0.08)",
    fontWeight: 700,
  },
  muted: { fontSize: 12, opacity: 0.6 },

  title: { margin: "0 0 6px", fontSize: 16 },
  desc: { margin: "0 0 10px", opacity: 0.8 },
  ref: { margin: "0 0 12px", fontSize: 13, opacity: 0.85 },

  btnRow: { display: "flex", gap: 10 },
  smallBtn: {
    padding: "8px 10px",
    borderRadius: 10,
    border: "1px solid rgba(0,0,0,0.14)",
    background: "transparent",
    cursor: "pointer",
    fontWeight: 600,
  },
  dangerBtn: {
    padding: "8px 10px",
    borderRadius: 10,
    border: "none",
    background: "#ffdddd",
    cursor: "pointer",
    fontWeight: 700,
  },
};
