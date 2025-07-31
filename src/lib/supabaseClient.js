import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || "";
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || "";

// Vérification de la configuration
if (!supabaseUrl || !supabaseAnonKey) {
  console.warn("⚠️ Supabase : URL ou clé anonyme manquante. Vérifie ton fichier .env");
}

// Création du client ou null si config absente
export const supabase = (supabaseUrl && supabaseAnonKey)
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;