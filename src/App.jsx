// src/App.jsx
import { CssBaseline } from "@mui/material";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import { UserProvider } from "./context/UserContext";

import Menu from "./components/Menu";
import Home from "./pages/Home";
import Auth from "./pages/Auth";
import Profil from "./pages/Profil";
import Psychographe from "./pages/Psychographe";
import Psychotheque from "./pages/Psychotheque";
import MentionsLegales from "./pages/MentionsLegales";

export default function App() {
  return (
    <>
      <CssBaseline />
      <UserProvider>
        <Router>
          <Menu />
          <div
            style={{
              minHeight: "100vh",
              position: "relative",
              zIndex: 1,
              paddingBottom: "100px",
            }}
          >
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/auth" element={<Auth />} />
              <Route path="/profil" element={<Profil />} />
              <Route path="/psychographe" element={<Psychographe />} />
              <Route path="/psychotheque" element={<Psychotheque />} />
              <Route path="/mentions-legales" element={<MentionsLegales />} />
            </Routes>
          </div>

          {/* Pied de page */}
          <footer
            style={{
              textAlign: "center",
              padding: "12px",
              fontSize: "14px",
              background: "rgba(20,35,65,0.6)",
              color: "#b7d8ff",
              position: "fixed",
              bottom: 0,
              width: "100%",
            }}
          >
            <Link
              to="/mentions-legales"
              style={{ color: "#a3f7ff", textDecoration: "none" }}
            >
              Mentions légales & CGU
            </Link>
          </footer>
        </Router>
      </UserProvider>
    </>
  );
}