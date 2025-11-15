import { createClient } from "@supabase/supabase-js";

/** Config intégrée permettant d’éviter les erreurs « Supabase déconnecté » */
const FALLBACK_SUPABASE_URL = "https://qolkpukdylfhnojbxsam.supabase.co";
const FALLBACK_SUPABASE_ANON_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFvbGtwdWtkeWxmaG5vamJ4c2FtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjMxNzgwODQsImV4cCI6MjA3ODc1NDA4NH0.Pbyx8kmHcHPuJTyU0fy1WW7DCHxRZoatxlp9HmHf5Qk";

const env = import.meta?.env ?? {};
const disabledFlag =
  `${env.VITE_SUPABASE_DISABLED ?? ""}`.trim().toLowerCase() === "true";

const hasEnvConfig = Boolean(
  env.VITE_SUPABASE_URL && env.VITE_SUPABASE_ANON_KEY,
);
const canUseFallback = Boolean(
  !hasEnvConfig && FALLBACK_SUPABASE_URL && FALLBACK_SUPABASE_ANON_KEY,
);

const resolvedUrl = hasEnvConfig
  ? env.VITE_SUPABASE_URL
  : canUseFallback
    ? FALLBACK_SUPABASE_URL
    : undefined;
const resolvedAnonKey = hasEnvConfig
  ? env.VITE_SUPABASE_ANON_KEY
  : canUseFallback
    ? FALLBACK_SUPABASE_ANON_KEY
    : undefined;

export const supabaseSource = hasEnvConfig
  ? "env"
  : canUseFallback
    ? "fallback"
    : "none";

export const isSupabaseConfigured = Boolean(
  !disabledFlag && resolvedUrl && resolvedAnonKey,
);

if (!isSupabaseConfigured) {
  console.warn(
    disabledFlag
      ? "⚠️ Supabase explicitement désactivé via VITE_SUPABASE_DISABLED."
      : "⚠️ Supabase non configuré. Ajoute un .env ou utilise la configuration intégrée.",
  );
} else if (supabaseSource === "fallback") {
  console.info("ℹ️ Supabase utilise la configuration de repli intégrée.");
}

export const supabase = isSupabaseConfigured
  ? createClient(resolvedUrl, resolvedAnonKey)
  : null;