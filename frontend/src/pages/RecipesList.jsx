import { useEffect, useMemo, useState } from "react";
import api from "../api/client";
import { useAuth } from "../auth/AuthContext";

export default function RecipesList() {
  const { token } = useAuth();

  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

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

  useEffect(() => {
    fetchRecipes();
  }, []);

  return (
    <div style={styles.shell}>
      <div style={styles.page}>
        <div style={styles.listTop}>
          <div>
            <h2 style={styles.h2}>Recepti</h2>
            <p style={styles.sub}>
              Pregled svih recepata koje su korisnici dodali.
            </p>
          </div>

          <button style={styles.secondaryBtn} onClick={fetchRecipes}>
            Osvježi
          </button>
        </div>

        <div style={styles.card}>
          <div style={styles.searchRow}>
            <input
              style={{ ...styles.input, maxWidth: 360 }}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Pretraga po naslovu / opisu / kategoriji..."
            />
          </div>

          {error && <p style={styles.error}>{error}</p>}

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

                    <p style={{ margin: "0 0 8px", fontSize: 13, opacity: 0.85 }}>
                      <b>Kategorija:</b> {r.Category?.name || "—"}
                    </p>

                    {r.shortDescription && <p style={styles.desc}>{r.shortDescription}</p>}

                    {r.sourceReference && (
                      <p style={styles.ref}>
                        <b>Referenca:</b> {r.sourceReference}
                      </p>
                    )}

                    <button style={styles.dangerBtn} onClick={() => handleDelete(r.id)}>
                      Obriši
                    </button>
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

  listTop: {
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
  },

  searchRow: { display: "flex", justifyContent: "flex-end", marginBottom: 10 },

  input: {
    width: "100%",
    padding: "10px 12px",
    borderRadius: 12,
    border: "1px solid rgba(0,0,0,0.12)",
    outline: "none",
    background: "white",
  },

  error: { margin: "6px 0 10px", color: "crimson" },

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

  secondaryBtn: {
    padding: "10px 14px",
    borderRadius: 12,
    border: "1px solid rgba(0,0,0,0.14)",
    cursor: "pointer",
    background: "transparent",
    fontWeight: 600,
  },

  dangerBtn: {
    padding: "10px 12px",
    borderRadius: 12,
    border: "none",
    background: "#ffdddd",
    cursor: "pointer",
    fontWeight: 800,
  },
};
