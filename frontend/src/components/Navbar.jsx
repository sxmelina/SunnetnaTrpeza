import { NavLink } from "react-router-dom";

export default function Navbar() {
  return (
    <header style={styles.header}>
      <div style={styles.inner}>
        <div style={styles.brand}>Sunnetna Trpeza</div>

        <nav style={styles.nav}>
          <NavLink to="/login" style={linkStyle}>Login</NavLink>
          <NavLink to="/recipes" style={linkStyle}>Unos recepata</NavLink>
          <NavLink to="/categories" style={linkStyle}>Kategorije</NavLink>
        </nav>
      </div>
    </header>
  );
}

const styles = {
  header: {
    background: "#fff",
    borderBottom: "1px solid rgba(0,0,0,0.06)",
  },

  inner: {
    maxWidth: 980,              // 🔸 isto kao content
    margin: "0 auto",
    padding: "14px 24px",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
  },

  brand: {
    fontWeight: 700,
    fontSize: 16,
    letterSpacing: 0.3,
  },

  nav: {
    display: "flex",
    gap: 8,
  },
};

function linkStyle({ isActive }) {
  return {
    textDecoration: "none",
    padding: "8px 14px",
    borderRadius: 999,            // 🔸 pill shape
    fontSize: 14,
    fontWeight: 500,
    color: "#222",
    background: isActive ? "#efe3cf" : "transparent",
    transition: "all .2s ease",
  };
}
