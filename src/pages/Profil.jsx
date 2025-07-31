// src/pages/Profil.jsx
import { useEffect, useState } from "react";
import { Box, Card, Typography, TextField, Button, Stack } from "@mui/material";
import { supabase } from "../lib/supabaseClient";
import { useUser } from "../context/UserContext";

export default function Profil() {
  const { user, setUser } = useUser();
  const [pseudo, setPseudo] = useState("");
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  // Charger le profil
  useEffect(() => {
    async function fetchProfile() {
      if (!user) return;
      const { data, error } = await supabase
        .from("profiles")
        .select("pseudo")
        .eq("id", user.id)
        .single();
      if (data?.pseudo) setPseudo(data.pseudo);
      if (error) console.error("Erreur profil:", error.message);
      setLoading(false);
    }
    fetchProfile();
  }, [user]);

  async function handleSave() {
    setMessage("");
    setError("");
    if (!pseudo.trim()) {
      setError("Le pseudo ne peut pas être vide.");
      return;
    }
    try {
      const { error } = await supabase
        .from("profiles")
        .update({ pseudo: pseudo.trim() })
        .eq("id", user.id);
      if (error) throw error;
      setMessage("Profil mis à jour !");
    } catch (e) {
      setError("Impossible de mettre à jour : " + e.message);
    }
  }

  if (!user) {
    return (
      <Box minHeight="80vh" display="flex" alignItems="center" justifyContent="center">
        <Typography variant="h6">Veuillez vous connecter pour accéder au profil.</Typography>
      </Box>
    );
  }

  return (
    <Box
      minHeight="80vh"
      display="flex"
      alignItems="center"
      justifyContent="center"
      sx={{ background: "transparent" }}
    >
      <Card
        sx={{
          maxWidth: 420,
          width: "100%",
          p: { xs: 3, sm: 5 },
          borderRadius: 4,
          boxShadow: "0 6px 30px rgba(0,0,0,0.3)",
          bgcolor: "rgba(255,255,255,0.05)",
          backdropFilter: "blur(10px)",
        }}
      >
        <Typography variant="h5" fontWeight={800} mb={3}>
          Mon Profil
        </Typography>

        <TextField
          fullWidth
          label="Email"
          value={user.email}
          disabled
          margin="normal"
        />

        <TextField
          fullWidth
          label="Pseudo (affiché publiquement)"
          value={pseudo}
          onChange={(e) => setPseudo(e.target.value)}
          margin="normal"
        />

        <Stack spacing={2} mt={3}>
          <Button
            variant="contained"
            color="primary"
            onClick={handleSave}
            disabled={loading}
          >
            Sauvegarder
          </Button>
        </Stack>

        {message && (
          <Typography color="info.main" mt={2}>
            {message}
          </Typography>
        )}
        {error && (
          <Typography color="error" mt={2}>
            {error}
          </Typography>
        )}
      </Card>
    </Box>
  );
}