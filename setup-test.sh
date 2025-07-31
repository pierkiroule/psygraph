#!/bin/bash
echo "=== Configuration du test navigation ==="

# Créer Home.jsx si absent
cat << 'EOT' > src/pages/Home.jsx
export default function Home() {
  return (
    <div style={{ textAlign: "center", marginTop: "2rem" }}>
      <h2>Bienvenue sur Le Psychographe</h2>
      <p>Navigation OK. Teste le menu burger à droite.</p>
    </div>
  );
}
EOT

# Vérifier App.jsx (routing complet)
cat << 'EOT' > src/App.jsx
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Layout from "./layouts/Layout";
import Home from "./pages/Home";
import Auth from "./pages/Auth";
import Profil from "./pages/Profil";
import Psychographe from "./pages/Psychographe";
import Psychotheque from "./pages/Psychotheque";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<Home />} />
          <Route path="/auth" element={<Auth />} />
          <Route path="/profil" element={<Profil />} />
          <Route path="/psychographe" element={<Psychographe />} />
          <Route path="/psychotheque" element={<Psychotheque />} />
        </Route>
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
EOT

echo "=== Navigation prête. Lance : npm run dev -- --host ==="
