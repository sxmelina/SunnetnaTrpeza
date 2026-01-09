import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Navbar from "./components/Navbar";
import Login from "./pages/Login";
import Recipes from "./pages/Recipes";
import Categories from "./pages/Categories";
import { AuthProvider } from "./auth/AuthContext";
import ProtectedRoute from "./auth/ProtectedRoute";

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <div style={styles.app}>
          <Navbar />

          {/* ❗ NEMA maxWidth ovdje */}
          <main style={styles.main}>
            <Routes>
              <Route path="/login" element={<Login />} />

              <Route
                path="/recipes"
                element={
                  <ProtectedRoute>
                    <Recipes />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/categories"
                element={
                  <ProtectedRoute>
                    <Categories />
                  </ProtectedRoute>
                }
              />

              <Route path="/" element={<Navigate to="/login" replace />} />
              <Route path="*" element={<div>404 - Stranica ne postoji</div>} />
            </Routes>
          </main>
        </div>
      </BrowserRouter>
    </AuthProvider>
  );
}

const styles = {
  app: {
    minHeight: "100vh",
    background: "#f7f1e6", // bež pozadina preko cijelog ekrana
  },

  // ❗ main je FULL WIDTH
  main: {
    width: "100%",
  },
};
