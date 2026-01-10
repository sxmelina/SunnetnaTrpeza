import { useEffect, useState } from "react";
import api from "../api/client";
import { useAuth } from "../auth/AuthContext";
import "./AddRecipes.css";

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
    } catch (e) {
      const msg = e?.response?.data?.message || "Spremanje nije uspjelo.";
      const code = e?.response?.status;
      setError(code ? `${msg} (HTTP ${code})` : msg);
    }
  }

  return (
    <div className="add-shell">
      <div className="add-page">
        <div className="add-header">
          <div>
            <h2 className="add-title">Dodaj recept</h2>
            <p className="add-sub">Unesi novi recept i sačuvaj ga u bazi.</p>
          </div>
        </div>

        <div className="split-card">
          {/* LEFT PANEL */}
          <div className="split-left">
            <h3 className="hero-h">
              Unos
              <br />
              recepta
            </h3>
           <p className="hero-ayat">
             “O ljudi, jedite od onoga što je na Zemlji dopušteno i lijepo.”
             <span>Kur'an, El-Bekare (2:168)</span>
           </p>






            <div className="motif" />
          </div>

          {/* RIGHT FORM */}
          <div className="split-right">
            <div className="form-top">
              <div>
                <h4 className="form-h">Forma za unos</h4>
                <p className="form-note">Polja sa * su obavezna.</p>
              </div>
            </div>

            {!token && <div className="alert alert-warn">⚠️ Za dodavanje moraš biti prijavljena.</div>}

            {error && <div className="alert alert-error">{error}</div>}

            {categories.length === 0 && (
              <div className="alert alert-warn">
                ⚠️ Nema kategorija. Prvo dodaj kategorije u sekciji “Kategorije”.
              </div>
            )}

            <form onSubmit={handleSubmit} className="form-grid">
              <div className="field full">
                <label className="label">Naslov *</label>
                <input
                  className="input"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="npr. Telbina"
                />
              </div>

              <div className="field">
                <label className="label">Kategorija *</label>
                <select
                  className="select"
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

              <div className="field">
                <label className="label">Tip izvora</label>
                <select
                  className="select"
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

              <div className="field full">
                <label className="label">Kratki opis</label>
                <input
                  className="input"
                  value={shortDescription}
                  onChange={(e) => setShortDescription(e.target.value)}
                  placeholder="kratak opis (opcionalno)"
                />
              </div>

              <div className="field full">
                <label className="label">Upute / način pripreme *</label>
                <textarea
                  className="textarea"
                  value={instructions}
                  onChange={(e) => setInstructions(e.target.value)}
                  placeholder="napiši upute (obavezno)"
                  rows={6}
                />
              </div>

              <div className="field full">
                <label className="label">Referenca (hadis/ajet/izvor)</label>
                <input
                  className="input"
                  value={sourceReference}
                  onChange={(e) => setSourceReference(e.target.value)}
                  placeholder="npr. Sahih al-Bukhari #... / Ajet ..."
                />
              </div>

              <div className="field full">
                <label className="label">Slika (URL)</label>
                <input
                  className="input"
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  placeholder="https://..."
                />
              </div>

              <div className="field full">
                <div className="actions">
                  <button className="btn btn-primary" type="submit" disabled={categories.length === 0}>
                    Sačuvaj
                  </button>

                  <button className="btn btn-secondary" type="button" onClick={resetForm}>
                    Očisti
                  </button>

                </div>
              </div>
            </form>
          </div>
        </div>

      </div>
    </div>
  );
}
