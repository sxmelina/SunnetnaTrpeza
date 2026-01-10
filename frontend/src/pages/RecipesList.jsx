import { useEffect, useMemo, useState } from "react";
import api from "../api/client";
import RecipeModal from "../components/RecipeModal";
import "./RecipesList.css";

export default function RecipeList() {
  const [recipes, setRecipes] = useState([]);
  const [categories, setCategories] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [search, setSearch] = useState("");
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

  async function fetchCategories() {
    try {
      const res = await api.get("/categories");
      setCategories(Array.isArray(res.data) ? res.data : []);
    } catch {
      // kategorije su potrebne za edit u modalu; ako faila, modal će i dalje raditi ali bez dropdown-a
      setCategories([]);
    }
  }

  useEffect(() => {
    fetchRecipes();
    fetchCategories();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return recipes;

    return recipes.filter((r) => {
      const t = (r.title || "").toLowerCase();
      const s = (r.shortDescription || "").toLowerCase();
      const ref = (r.sourceReference || "").toLowerCase();
      return t.includes(q) || s.includes(q) || ref.includes(q);
    });
  }, [recipes, search]);

  return (
    <div className="rl-shell">
      <div className="rl-page">
        <div className="rl-top">
          <div>
            <h1 className="rl-h1">Recepti</h1>
            <p className="rl-sub">
              Pregled svih unesenih recepata — inspirisano Kur'anom, hadisima i zdravom ishranom.
            </p>
          </div>

          <div className="rl-actions">
            <input
              className="rl-search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Pretraga po naslovu/opisu/referenci..."
            />
            <button className="rl-btn" onClick={fetchRecipes}>
              Osvježi
            </button>
          </div>
        </div>

        {error && <div className="rl-alert rl-alert-error">{error}</div>}

        {loading ? (
          <div className="rl-empty">Učitavam...</div>
        ) : filtered.length === 0 ? (
          <div className="rl-empty">Nema recepata.</div>
        ) : (
          <div className="rl-grid">
            {filtered.map((r) => (
              <button
                key={r.id}
                className="rl-card"
                onClick={() => setSelected(r)}
                title="Otvori recept"
              >
                <div className="rl-thumb">
                  <span className="rl-badge">{r.sourceType || "ZDRAVO"}</span>

                  {r.imageUrl ? (
                    <img className="rl-img" src={r.imageUrl} alt={r.title} loading="lazy" />
                  ) : (
                    <div className="rl-imgPlaceholder">🍯</div>
                  )}
                </div>

                <div className="rl-body">
                  <h3 className="rl-title">{r.title}</h3>

                  {r.shortDescription ? (
                    <p className="rl-desc">{r.shortDescription}</p>
                  ) : (
                    <p className="rl-desc rl-desc-muted">Nema kratkog opisa.</p>
                  )}

                  <div className="rl-bottomRow">
                    <span className="rl-date">
                      {r.createdAt ? new Date(r.createdAt).toLocaleDateString() : ""}
                    </span>
                    <span className="rl-open">
                      Otvori <span aria-hidden>→</span>
                    </span>
                  </div>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>

      <RecipeModal
        open={Boolean(selected)}
        recipe={selected}
        categories={categories}
        onClose={() => setSelected(null)}
        onUpdated={async () => {
          await fetchRecipes();
          setSelected(null);
        }}
      />
    </div>
  );
}
