#!/bin/bash
echo "📦 Création de la page Auth et configuration Supabase..."

# Créer les dossiers nécessaires
mkdir -p src/pages src/lib

# Créer le fichier supabaseClient.js
cat << 'EOC' > src/lib/supabaseClient.js
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
EOC

# Créer le fichier Auth.jsx
cat << 'EOP' > src/pages/Auth.jsx
import { useState } from "react";
import { supabase } from "../lib/supabaseClient";
import { useUser } from "../context/UserContext";

export default function Auth() {
  const { user } = useUser();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  async function handleSignUp() {
    setLoading(true);
    const { error } = await supabase.auth.signUp({ email, password });
    setMessage(error ? error.message : "Vérifie tes emails pour confirmer !");
    setLoading(false);
  }

  async function handleSignIn() {
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setMessage(error ? error.message : "Connexion réussie !");
    setLoading(false);
  }

  async function handleSignOut() {
    await supabase.auth.signOut();
  }

  if (user) {
    return (
      <div style={{ textAlign: "center", marginTop: "2rem" }}>
        <h2>Bienvenue, {user.email}</h2>
        <button onClick={handleSignOut}>Se déconnecter</button>
      </div>
    );
  }

  return (
    <div style={{ textAlign: "center", marginTop: "2rem" }}>
      <h2>Connexion au Psychographe</h2>
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      /><br />
      <input
        type="password"
        placeholder="Mot de passe"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      /><br />
      <button onClick={handleSignIn} disabled={loading}>Connexion</button>
      <button onClick={handleSignUp} disabled={loading}>Créer un compte</button>
      <p>{message}</p>
    </div>
  );
}
EOP

# Créer un modèle de fichier .env
cat << 'EOV' > .env
VITE_SUPABASE_URL=https://iddoqqcrwaglfwqxgoaj.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlkZG9xcWNyd2FnbGZ3cXhnb2FqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTA4MzA5MjAsImV4cCI6MjA2NjQwNjkyMH0.EQnDeMYHVckJv3sat__lP3NTIkMQa3MKa8ZRjJsbit8
EOV

echo "✅ Fichiers créés : Auth.jsx, supabaseClient.js et .env"
