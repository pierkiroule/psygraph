#!/bin/bash
echo "=== Mise à jour de App.jsx avec Layout et Routes ==="

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

echo "=== App.jsx mis à jour. Relance : npm run dev -- --host ==="
