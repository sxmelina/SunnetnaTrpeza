import { NavLink } from "react-router-dom";
import "./Navbar.css";

export default function Navbar() {
  return (
    <header className="navbar">
      <div className="navbar-inner">
        <div className="navbar-brand">
          <NavLink to="/">Sunnetna Trpeza</NavLink>
        </div>

        <nav className="navbar-links">
          <NavLink to="/login" className={({ isActive }) => (isActive ? "navlink active" : "navlink")}>
            Login
          </NavLink>

          <NavLink to="/recipes" className={({ isActive }) => (isActive ? "navlink active" : "navlink")}>
            Dodaj recept
          </NavLink>

          <NavLink to="/categories" className={({ isActive }) => (isActive ? "navlink active" : "navlink")}>
            Kategorije
          </NavLink>
        </nav>
      </div>
    </header>
  );
}
