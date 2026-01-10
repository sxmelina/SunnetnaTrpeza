import { useEffect, useMemo, useState } from "react";
import api from "../api/client";
import "./RecipesList.css";

export default function Recipes() {
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [q, setQ] = useState("");
  const [selected, setSelected] = useState(null);

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

  useEffect(() => {
    fetchRecipes();
  }, []);

  const filtered = useMemo(() => {
    const s = q.trim().toLowerCase();
    if (!s) return recipes;

    return recipes.filter((r) => {
      const title = (r.title || "").toLowerCase();
      const desc = (r.shortDescription || "").toLowerCase();
      const ref = (r.sourceReference || "").toLowerCase();
      return title.includes(s) || desc.includes(s) || ref.includes(s);
    });
  }, [recipes, q]);

  return (
    <div className="recipes-shell">
      <div className="recipes-wrap">
        <header className="recipes-top">
          <div>
            <h1 className="recipes-h1">Recepti</h1>
            <p className="recipes-sub">
              Pregled svih unesenih recepata — inspirisano Kur'anom, hadisima i zdravom ishranom.
            </p>
          </div>

          <div className="recipes-actions">
            <input
              className="recipes-search"
              placeholder="Pretraga po naslovu/opisu/referenci…"
              value={q}
              onChange={(e) => setQ(e.target.value)}
            />
            <button className="recipes-btn" onClick={fetchRecipes}>
              Osvježi
            </button>
          </div>
        </header>

        {error && <div className="recipes-alert recipes-alert--error">{error}</div>}

        {loading ? (
          <div className="recipes-loading">Učitavam…</div>
        ) : filtered.length === 0 ? (
          <div className="recipes-empty">
            Nema recepata za prikaz. Dodaj novi recept na stranici “Dodaj recept”.
          </div>
        ) : (
          <section className="recipes-grid">
            {filtered.map((r) => (
              <article
                key={r.id}
                className="recipe-card"
                onClick={() => setSelected(r)}
                role="button"
                tabIndex={0}
              >
                <div className="recipe-media">
                  {r.imageUrl ? (
                    <img src={r.imageUrl} alt={r.title} className="recipe-img" loading="lazy" />
                  ) : (
                    <div className="recipe-img recipe-img--placeholder">🍯</div>
                  )}

                  <div className="recipe-chip">
                    {r.sourceType || "ZDRAVO"}
                  </div>
                </div>

                <div className="recipe-body">
                  <h3 className="recipe-title">{r.title}</h3>

                  {r.shortDescription ? (
                    <p className="recipe-desc">{r.shortDescription}</p>
                  ) : (
                    <p className="recipe-desc recipe-desc--muted">
                      (Nema kratkog opisa)
                    </p>
                  )}

                  <div className="recipe-meta">
                    <span className="recipe-date">
                      {r.createdAt ? new Date(r.createdAt).toLocaleDateString() : ""}
                    </span>
                    <span className="recipe-open">Otvori →</span>
                  </div>
                </div>
              </article>
            ))}
          </section>
        )}
      </div>

      {/* MODAL */}
      {selected && (
        <div className="modal-backdrop" onClick={() => setSelected(null)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <button className="modal-x" onClick={() => setSelected(null)} aria-label="Zatvori">
              ✕
            </button>

            <div className="modal-head">
              <div>
                <div className="modal-chip">{selected.sourceType || "ZDRAVO"}</div>
                <h2 className="modal-title">{selected.title}</h2>
                {selected.shortDescription && <p className="modal-sub">{selected.shortDescription}</p>}
              </div>

              {selected.imageUrl && (
                <img className="modal-img" src={selected.imageUrl} alt={selected.title} />
              )}
            </div>

            <div className="modal-section">
              <h4>Upute / način pripreme</h4>
              <p className="modal-text">{selected.instructions}</p>
            </div>

            {(selected.sourceReference || selected.Category?.name) && (
              <div className="modal-section">
                <h4>Dodatno</h4>
                {selected.Category?.name && (
                  <p className="modal-text">
                    <b>Kategorija:</b> {selected.Category.name}
                  </p>
                )}
                {selected.sourceReference && (
                  <p className="modal-text">
                    <b>Referenca:</b> {selected.sourceReference}
                  </p>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
