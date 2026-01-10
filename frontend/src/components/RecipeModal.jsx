import { useEffect, useMemo, useState } from "react";
import api from "../api/client";
import { useAuth } from "../auth/AuthContext";

const SOURCE_TYPES = [
  { value: "HADIS", label: "Hadis" },
  { value: "KURAN", label: "Kur'an" },
  { value: "ZDRAVO", label: "Zdravo (općenito)" },
];

export default function RecipeModal({
  open,
  onClose,
  recipe,
  categories = [],
  onUpdated, // callback da osvježiš listu nakon save
}) {
  const { token } = useAuth();
  const canEdit = Boolean(token);

  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [err, setErr] = useState("");

  // local form state
  const [title, setTitle] = useState("");
  const [shortDescription, setShortDescription] = useState("");
  const [instructions, setInstructions] = useState("");
  const [sourceType, setSourceType] = useState("ZDRAVO");
  const [sourceReference, setSourceReference] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [categoryId, setCategoryId] = useState("");

  // kad se promijeni "recipe" (otvoriš drugi), napuni polja
  useEffect(() => {
    if (!recipe) return;
    setIsEditing(false);
    setErr("");

    setTitle(recipe.title ?? "");
    setShortDescription(recipe.shortDescription ?? "");
    setInstructions(recipe.instructions ?? "");
    setSourceType(recipe.sourceType ?? "ZDRAVO");
    setSourceReference(recipe.sourceReference ?? "");
    setImageUrl(recipe.imageUrl ?? "");
    setCategoryId(recipe.categoryId ? String(recipe.categoryId) : "");
  }, [recipe]);

  const categoryName = useMemo(() => {
    const found = categories.find((c) => String(c.id) === String(recipe?.categoryId));
    return found?.name || recipe?.Category?.name || "";
  }, [categories, recipe]);

  if (!open || !recipe) return null;

  function closeAll() {
    setIsEditing(false);
    setErr("");
    onClose?.();
  }

  function startEdit() {
    if (!canEdit) {
      setErr("Moraš biti prijavljena da uređuješ recept.");
      return;
    }
    setIsEditing(true);
    setErr("");
  }

  function cancelEdit() {
    // vrati na početne vrijednosti iz recipe
    setTitle(recipe.title ?? "");
    setShortDescription(recipe.shortDescription ?? "");
    setInstructions(recipe.instructions ?? "");
    setSourceType(recipe.sourceType ?? "ZDRAVO");
    setSourceReference(recipe.sourceReference ?? "");
    setImageUrl(recipe.imageUrl ?? "");
    setCategoryId(recipe.categoryId ? String(recipe.categoryId) : "");
    setErr("");
    setIsEditing(false);
  }

  async function saveEdit() {
    setErr("");

    if (!title.trim() || !instructions.trim()) {
      setErr("Naslov i upute su obavezni.");
      return;
    }
    if (!categoryId) {
      setErr("Kategorija je obavezna.");
      return;
    }
    if (!token) {
      setErr("Nema tokena (prijavi se ponovo).");
      return;
    }

    const payload = {
      title: title.trim(),
      shortDescription: shortDescription.trim() || null,
      instructions: instructions.trim(),
      sourceType,
      sourceReference: sourceReference.trim() || null,
      imageUrl: imageUrl.trim() || null,
      categoryId: Number(categoryId),
    };

    try {
      setSaving(true);
      const headers = { Authorization: `Bearer ${token}` };
      await api.put(`/recipes/${recipe.id}`, payload, { headers });

      setIsEditing(false);
      onUpdated?.(); // refresh liste
    } catch (e) {
      setErr(e?.response?.data?.message || "Spremanje nije uspjelo.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div style={styles.backdrop} onMouseDown={closeAll}>
      <div style={styles.modal} onMouseDown={(e) => e.stopPropagation()}>
        <button style={styles.close} onClick={closeAll} aria-label="Zatvori">
          ✕
        </button>

        {err && <div style={styles.err}>{err}</div>}

        <div style={styles.topRow}>
          <span style={styles.badge}>{recipe.sourceType || "ZDRAVO"}</span>

          {!isEditing ? (
            <div style={{ display: "flex", gap: 10 }}>
              <button style={styles.btnGhost} onClick={closeAll}>Zatvori</button>
              <button style={styles.btnPrimary} onClick={startEdit} disabled={!canEdit}>
                Uredi
              </button>
            </div>
          ) : (
            <div style={{ display: "flex", gap: 10 }}>
              <button style={styles.btnGhost} onClick={cancelEdit} disabled={saving}>
                Otkaži
              </button>
              <button style={styles.btnPrimary} onClick={saveEdit} disabled={saving}>
                {saving ? "Spremam..." : "Sačuvaj izmjene"}
              </button>
            </div>
          )}
        </div>

        <div style={styles.header}>
          {!isEditing ? (
            <>
              <h2 style={styles.h2}>{recipe.title}</h2>
              {recipe.shortDescription && <p style={styles.sub}>{recipe.shortDescription}</p>}
            </>
          ) : (
            <>
              <label style={styles.label}>Naslov *</label>
              <input style={styles.input} value={title} onChange={(e) => setTitle(e.target.value)} />

              <label style={styles.label}>Kratki opis</label>
              <input
                style={styles.input}
                value={shortDescription}
                onChange={(e) => setShortDescription(e.target.value)}
              />

              <div style={styles.grid2}>
                <div>
                  <label style={styles.label}>Kategorija *</label>
                  <select
                    style={styles.input}
                    value={categoryId}
                    onChange={(e) => setCategoryId(e.target.value)}
                    disabled={categories.length === 0}
                  >
                    <option value="">Odaberi...</option>
                    {categories.map((c) => (
                      <option key={c.id} value={String(c.id)}>{c.name}</option>
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
                      <option key={x.value} value={x.value}>{x.label}</option>
                    ))}
                  </select>
                </div>
              </div>
            </>
          )}
        </div>

        <div style={styles.body}>
          <div style={styles.sectionRow}>
            <div style={{ flex: 1 }}>
              <h3 style={styles.h3}>Upute / način pripreme</h3>

              {!isEditing ? (
                <div style={styles.textBlock}>{recipe.instructions}</div>
              ) : (
                <>
                  <label style={styles.label}>Upute *</label>
                  <textarea
                    style={styles.textarea}
                    value={instructions}
                    onChange={(e) => setInstructions(e.target.value)}
                    rows={8}
                  />
                </>
              )}
            </div>

            <div style={styles.imageBox}>
              {imageUrl || recipe.imageUrl ? (
                <img
                  src={isEditing ? imageUrl : recipe.imageUrl}
                  alt={recipe.title}
                  style={styles.img}
                  onError={(e) => { e.currentTarget.style.display = "none"; }}
                />
              ) : (
                <div style={styles.imgPlaceholder}>Nema slike</div>
              )}

              {isEditing && (
                <div style={{ marginTop: 10 }}>
                  <label style={styles.label}>Slika (URL)</label>
                  <input style={styles.input} value={imageUrl} onChange={(e) => setImageUrl(e.target.value)} />
                </div>
              )}
            </div>
          </div>

          <div style={styles.divider} />

          {!isEditing ? (
            <div style={styles.meta}>
              <div><b>Kategorija:</b> {categoryName || "—"}</div>
              <div><b>Referenca:</b> {recipe.sourceReference || "—"}</div>
            </div>
          ) : (
            <div style={styles.metaEdit}>
              <label style={styles.label}>Referenca (hadis/ajet/izvor)</label>
              <input
                style={styles.input}
                value={sourceReference}
                onChange={(e) => setSourceReference(e.target.value)}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

const styles = {
  backdrop: {
    position: "fixed",
    inset: 0,
    background: "rgba(0,0,0,0.45)",
    display: "grid",
    placeItems: "center",
    padding: 16,
    zIndex: 999,
  },
  modal: {
    width: "min(1000px, 96vw)",
    maxHeight: "92vh",
    overflow: "auto",
    background: "rgba(255,255,255,0.92)",
    border: "1px solid rgba(255,255,255,0.35)",
    borderRadius: 18,
    boxShadow: "0 30px 80px rgba(0,0,0,0.25)",
    position: "relative",
    padding: 18,
    backdropFilter: "blur(10px)",
  },
  close: {
    position: "absolute",
    right: 12,
    top: 10,
    width: 36,
    height: 36,
    borderRadius: 12,
    border: "1px solid rgba(0,0,0,0.12)",
    background: "white",
    cursor: "pointer",
    fontSize: 16,
  },
  err: {
    background: "rgba(220,20,60,0.10)",
    border: "1px solid rgba(220,20,60,0.25)",
    color: "#8f2f2f",
    padding: "10px 12px",
    borderRadius: 14,
    marginBottom: 10,
    fontWeight: 600,
  },
  topRow: { display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12 },
  badge: {
    fontSize: 12,
    padding: "6px 10px",
    borderRadius: 999,
    background: "#f1e7d6",
    border: "1px solid rgba(0,0,0,0.08)",
    fontWeight: 800,
  },
  btnPrimary: {
    border: 0,
    borderRadius: 14,
    padding: "10px 14px",
    fontWeight: 900,
    cursor: "pointer",
    background: "linear-gradient(180deg, #c8a96a, #b89045)",
    boxShadow: "0 12px 24px rgba(200,169,106,0.30)",
  },
  btnGhost: {
    borderRadius: 14,
    padding: "10px 14px",
    fontWeight: 800,
    cursor: "pointer",
    background: "transparent",
    border: "1px solid rgba(0,0,0,0.14)",
  },
  header: { marginTop: 12 },
  h2: { margin: "8px 0 6px", fontSize: 32 },
  sub: { margin: 0, opacity: 0.75, maxWidth: 720 },
  body: { marginTop: 14 },
  sectionRow: { display: "flex", gap: 16, alignItems: "flex-start", flexWrap: "wrap" },
  h3: { margin: "0 0 8px", fontSize: 16 },
  textBlock: { whiteSpace: "pre-wrap", lineHeight: 1.7, opacity: 0.9 },
  imageBox: {
    width: 300,
    minWidth: 260,
    borderRadius: 16,
    border: "1px solid rgba(0,0,0,0.10)",
    padding: 10,
    background: "rgba(255,255,255,0.85)",
  },
  img: { width: "100%", height: 190, objectFit: "cover", borderRadius: 12, display: "block" },
  imgPlaceholder: {
    width: "100%",
    height: 190,
    borderRadius: 12,
    display: "grid",
    placeItems: "center",
    background: "rgba(0,0,0,0.04)",
    color: "rgba(0,0,0,0.5)",
    fontWeight: 700,
  },
  divider: { height: 1, background: "rgba(0,0,0,0.08)", margin: "14px 0" },
  meta: { display: "grid", gap: 8, opacity: 0.9 },
  metaEdit: { display: "grid", gap: 8 },
  label: { fontSize: 13, fontWeight: 800, opacity: 0.75, marginTop: 10, marginBottom: 6, display: "block" },
  input: {
    width: "100%",
    padding: "12px 14px",
    borderRadius: 999,
    border: "1px solid rgba(0,0,0,0.10)",
    background: "rgba(240,245,248,0.85)",
    outline: "none",
  },
  textarea: {
    width: "100%",
    padding: "12px 14px",
    borderRadius: 18,
    border: "1px solid rgba(0,0,0,0.10)",
    background: "rgba(240,245,248,0.85)",
    outline: "none",
    resize: "vertical",
  },
  grid2: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginTop: 8 },
};
