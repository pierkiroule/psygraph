#!/bin/bash
echo "=== Mise à jour App.jsx avec Layout et MenuBurger ==="

# App.jsx avec Layout
cat << 'EOT' > src/App.jsx
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./layouts/Layout";
import Home from "./pages/Home";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<Home />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
EOT

# Layout.jsx minimal avec MenuBurger
mkdir -p src/layouts src/components

cat << 'EOT' > src/layouts/Layout.jsx
import { Outlet } from "react-router-dom";
import MenuBurger from "../components/MenuBurger";

export default function Layout() {
  return (
    <div>
      <MenuBurger />
      <div style={{ padding: "2rem" }}>
        <Outlet />
      </div>
    </div>
  );
}
EOT

# MenuBurger.jsx simple
cat << 'EOT' > src/components/MenuBurger.jsx
import { useState } from "react";
import { Link } from "react-router-dom";

export default function MenuBurger() {
  const [open, setOpen] = useState(false);

  return (
    <div style={{ position: "fixed", top: "1rem", right: "1rem" }}>
      <button
        onClick={() => setOpen(!open)}
        style={{
          background: "#007BFF",
          color: "white",
          border: "none",
          padding: "0.5rem 1rem",
          borderRadius: "5px"
        }}
      >
        {open ? "Fermer" : "Menu"}
      </button>
      {open && (
        <nav style={{ marginTop: "1rem", background: "#f4f4f4", padding: "1rem" }}>
          <Link to="/" style={{ display: "block", margin: "0.5rem 0" }}>Accueil</Link>
          <Link to="/profil" style={{ display: "block", margin: "0.5rem 0" }}>Profil</Link>
          <Link to="/psychographe" style={{ display: "block", margin: "0.5rem 0" }}>Psychographe</Link>
          <Link to="/psychotheque" style={{ display: "block", margin: "0.5rem 0" }}>Psychothèque</Link>
        </nav>
      )}
    </div>
  );
}
EOT

# Home.jsx minimal
mkdir -p src/pages
cat << 'EOT' > src/pages/Home.jsx
export default function Home() {
  return (
    <h2 style={{ textAlign: "center", marginTop: "2rem", color: "#333" }}>
      Bienvenue sur Le Psychographe
    </h2>
  );
}
EOT

echo "=== MenuBurger et Layout configurés. Lance : npm run dev -- --host ==="
