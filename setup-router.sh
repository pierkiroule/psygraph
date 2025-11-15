#!/bin/bash
echo "=== Installation de React Router + Layout de base ==="

# Crée les dossiers
mkdir -p src/layouts src/pages

# Installe React Router si pas déjà fait
npm install react-router-dom

# App.jsx avec routes
cat << 'EOT' > src/App.jsx
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Layout from "./layouts/Layout";
import Home from "./pages/Home";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<Home />} />
        </Route>
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
EOT

# Layout.jsx (simple wrapper avec Outlet)
cat << 'EOT' > src/layouts/Layout.jsx
import { Outlet } from "react-router-dom";

export default function Layout() {
  return (
    <div style={{ padding: "1rem" }}>
      <h1 style={{ textAlign: "center", color: "#444" }}>Psychographie</h1>
      <Outlet />
    </div>
  );
}
EOT

# Home.jsx
cat << 'EOT' > src/pages/Home.jsx
export default function Home() {
  return (
    <h2 style={{ textAlign: "center", marginTop: "2rem" }}>
      Bienvenue dans Psychographie
    </h2>
  );
}
EOT

echo "=== Router + Layout installés. Lance 'npm run dev -- --host' pour tester ==="
