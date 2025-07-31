#!/bin/bash
echo "🔗 Configuration App + Home + Auth + Context..."

# Créer le dossier context si absent
mkdir -p src/context

# 1. Créer UserContext.jsx
cat << 'EOC' > src/context/UserContext.jsx
import { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";

const UserContext = createContext();

export function UserProvider({ children }) {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const session = supabase.auth.getSession().then(({ data }) => {
      setUser(data.session?.user ?? null);
    });
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });
    return () => {
      listener.subscription.unsubscribe();
    };
  }, []);

  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  return useContext(UserContext);
}
EOC

# 2. Créer Home.jsx
mkdir -p src/pages
cat << 'EOP' > src/pages/Home.jsx
import { useUser } from "../context/UserContext";
import { Link } from "react-router-dom";

export default function Home() {
  const { user } = useUser();
  return (
    <div style={{ textAlign: "center", marginTop: "2rem" }}>
      <h1>Bienvenue sur Le Psychographe</h1>
      {user ? (
        <p>Connecté en tant que : <strong>{user.email}</strong></p>
      ) : (
        <p>Pas encore connecté.</p>
      )}
      <Link to="/auth" style={{ display: "inline-block", marginTop: "1rem" }}>
        Accéder à la page Auth
      </Link>
    </div>
  );
}
EOP

# 3. Créer App.jsx
cat << 'EOM' > src/App.jsx
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Auth from "./pages/Auth";
import { UserProvider } from "./context/UserContext";

export default function App() {
  return (
    <UserProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/auth" element={<Auth />} />
        </Routes>
      </BrowserRouter>
    </UserProvider>
  );
}
EOM

echo "✅ App.jsx, Home.jsx, UserContext.jsx configurés avec Auth.jsx"
