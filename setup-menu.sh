#!/bin/bash
echo "=== Ajout du menu burger et Layout ==="

# MenuBurger.jsx
mkdir -p src/components
cat << 'EOT' > src/components/MenuBurger.jsx
import { useState } from "react";
import { Link } from "react-router-dom";

export default function MenuBurger() {
  const [open, setOpen] = useState(false);
  return (
    <div style={{ position: "absolute", top: "1rem", right: "1rem" }}>
      <button
        onClick={() => setOpen(!open)}
        style={{
          fontSize: "1.5rem",
          background: "none",
          border: "none",
          cursor: "pointer"
        }}
      >
        ☰
      </button>
      {open && (
        <div
          style={{
            position: "absolute",
            top: "2.5rem",
            right: 0,
            background: "white",
            border: "1px solid #ccc",
            borderRadius: "8px",
            padding: "1rem",
            minWidth: "150px"
          }}
        >
          <Link to="/" onClick={() => setOpen(false)}>Accueil</Link><br />
          <Link to="/auth" onClick={() => setOpen(false)}>Connexion</Link><br />
          <Link to="/profil" onClick={() => setOpen(false)}>Profil</Link><br />
          <Link to="/psychographe" onClick={() => setOpen(false)}>Psychographe</Link><br />
          <Link to="/psychotheque" onClick={() => setOpen(false)}>Psychothèque</Link>
        </div>
      )}
    </div>
  );
}
EOT

# Layout.jsx (inclut le menu + Outlet)
mkdir -p src/layouts
cat << 'EOT' > src/layouts/Layout.jsx
import { Outlet } from "react-router-dom";
import MenuBurger from "../components/MenuBurger";

export default function Layout() {
  return (
    <div>
      <MenuBurger />
      <Outlet />
    </div>
  );
}
EOT

echo "=== Menu Burger ajouté. Relance : npm run dev -- --host ==="
