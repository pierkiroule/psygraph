#!/bin/bash
echo "📦 Création du contexte utilisateur (UserContext)..."

# Créer le dossier context s'il n'existe pas
mkdir -p src/context

# Créer le fichier UserContext.jsx
cat << 'EOC' > src/context/UserContext.jsx
import { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";

const UserContext = createContext();

export function UserProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Vérifier session initiale
    supabase.auth.getSession().then(({ data }) => {
      setUser(data?.session?.user || null);
      setLoading(false);
    });

    // Écouter les changements d'état de session
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user || null);
    });

    return () => listener.subscription.unsubscribe();
  }, []);

  return (
    <UserContext.Provider value={{ user, loading }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  return useContext(UserContext);
}
EOC

echo "✅ UserContext.jsx créé dans src/context/"
