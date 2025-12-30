import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Navbar from "./components/Navbar";
import Login from "./pages/Login";
import Recipes from "./pages/Recipes";
import Categories from "./pages/Categories";

export default function App() {
  return (
    <BrowserRouter>
      <div style={styles.app}>
        <Navbar />

        <main style={styles.main}>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/recipes" element={<Recipes />} />
            <Route path="/categories" element={<Categories />} />
            <Route path="/" element={<Navigate to="/login" replace />} />
            <Route path="*" element={<div>404 - Stranica ne postoji</div>} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}

const styles = {
  app: { minHeight: "100vh", background: "#faf7f2" },
  main: { padding: "24px", maxWidth: 1100, margin: "0 auto" },
};
