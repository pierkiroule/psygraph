import { createClient } from "@supabase/supabase-js";

const FALLBACK_SUPABASE_URL = "https://iddoqqcrwaglfwqxgoaj.supabase.co";
const FALLBACK_SUPABASE_ANON_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlkZG9xcWNyd2FnbGZ3cXhnb2FqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTA4MzA5MjAsImV4cCI6MjA2NjQwNjkyMH0.EQnDeMYHVckJv3sat__lP3NTIkMQa3MKa8ZRjJsbit8";

const sanitize = (value) => (typeof value === "string" ? value.trim() : "");
const env = (typeof import.meta !== "undefined" && import.meta.env) || {};

const disableSupabase =
  ["VITE_SUPABASE_DISABLED", "VITE_DISABLE_SUPABASE"].some((flag) =>
    ["true", "1"].includes(sanitize(env?.[flag]).toLowerCase()),
  );

const resolveSupabaseConfig = () => {
  if (disableSupabase) {
    return { url: "", anonKey: "" };
  }

  const url =
    sanitize(env?.VITE_SUPABASE_URL) ||
    sanitize(env?.PUBLIC_SUPABASE_URL) ||
    FALLBACK_SUPABASE_URL;
  const anonKey =
    sanitize(env?.VITE_SUPABASE_ANON_KEY) ||
    sanitize(env?.PUBLIC_SUPABASE_ANON_KEY) ||
    FALLBACK_SUPABASE_ANON_KEY;

  return { url, anonKey };
};

const { url: supabaseUrl, anonKey: supabaseAnonKey } = resolveSupabaseConfig();

export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey);

if (!isSupabaseConfigured) {
  console.warn(
    "⚠️ Supabase désactivé : aucune URL ou clé anonyme n'a été trouvée. L'app tourne en mode hors-ligne.",
  );
} else if (!sanitize(env?.VITE_SUPABASE_URL) || !sanitize(env?.VITE_SUPABASE_ANON_KEY)) {
  console.info(
    "ℹ️ Supabase utilise la configuration de repli. Pensez à définir VITE_SUPABASE_URL et VITE_SUPABASE_ANON_KEY pour votre propre projet.",
  );
}

export const supabase = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;
