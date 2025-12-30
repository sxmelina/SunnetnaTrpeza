import { NavLink } from "react-router-dom";

export default function Navbar() {
  return (
    <header style={styles.header}>
      <div style={styles.inner}>
        <div style={styles.brand}>Sunnetna Trpeza</div>

        <nav style={styles.nav}>
          <NavLink to="/login" style={linkStyle}>Login</NavLink>
          <NavLink to="/recipes" style={linkStyle}>Recepti</NavLink>
          <NavLink to="/categories" style={linkStyle}>Kategorije</NavLink>
        </nav>
      </div>
    </header>
  );
}

const styles = {
  header: { background: "#fff", borderBottom: "1px solid #eee" },
  inner: {
    maxWidth: 1100,
    margin: "0 auto",
    padding: "14px 24px",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 16,
  },
  brand: { fontWeight: 700, letterSpacing: 0.2 },
  nav: { display: "flex", gap: 12 },
};

function linkStyle({ isActive }) {
  return {
    textDecoration: "none",
    padding: "8px 12px",
    borderRadius: 10,
    color: "#222",
    background: isActive ? "#f3eadc" : "transparent",
  };
}
