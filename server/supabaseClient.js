// server/supabaseClient.js
import { createClient } from "@supabase/supabase-js";

const FALLBACK_SUPABASE_URL = "https://iddoqqcrwaglfwqxgoaj.supabase.co";
const FALLBACK_SUPABASE_ANON_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlkZG9xcWNyd2FnbGZ3cXhnb2FqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTA4MzA5MjAsImV4cCI6MjA2NjQwNjkyMH0.EQnDeMYHVckJv3sat__lP3NTIkMQa3MKa8ZRjJsbit8";

const sanitize = (value) => (typeof value === "string" ? value.trim() : "");
const toBool = (value) => ["true", "1", "yes"].includes(sanitize(value).toLowerCase());

const disableSupabase = toBool(
  process.env.VITE_SUPABASE_DISABLED ||
    process.env.VITE_DISABLE_SUPABASE ||
    process.env.SUPABASE_DISABLED,
);

const supabaseUrl = disableSupabase
  ? ""
  : sanitize(process.env.VITE_SUPABASE_URL) ||
    sanitize(process.env.SUPABASE_URL) ||
    sanitize(process.env.PUBLIC_SUPABASE_URL) ||
    FALLBACK_SUPABASE_URL;

const supabaseAnonKey = disableSupabase
  ? ""
  : sanitize(process.env.VITE_SUPABASE_ANON_KEY) ||
    sanitize(process.env.SUPABASE_ANON_KEY) ||
    sanitize(process.env.PUBLIC_SUPABASE_ANON_KEY) ||
    FALLBACK_SUPABASE_ANON_KEY;

export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey);

if (!isSupabaseConfigured) {
  console.warn("⚠️ Supabase désactivé côté serveur. Les endpoints dépendants seront inactifs.");
}

export const supabase = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;