// src/pages/Auth.jsx
import { useState } from "react";
import {
  Box,
  Card,
  TextField,
  Typography,
  Button,
  Stack,
  Checkbox,
  FormControlLabel,
} from "@mui/material";
import { Link } from "react-router-dom";
import { supabase } from "../lib/supabaseClient";

export default function Auth() {
  const [isSignup, setIsSignup] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [pseudo, setPseudo] = useState("");
  const [acceptCGU, setAcceptCGU] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    setMessage("");
    setError("");

    if (isSignup && (!pseudo.trim() || !acceptCGU)) {
      setError("Veuillez entrer un pseudo et accepter les conditions.");
      return;
    }

    try {
      if (isSignup) {
        const { data, error } = await supabase.auth.signUp({ email, password });
        if (error) throw error;

        // Créer un profil associé
        if (data.user) {
          await supabase.from("profiles").insert({
            id: data.user.id,
            email,
            pseudo: pseudo.trim(),
          });
        }

        setMessage(
          "Inscription réussie ! Vérifiez vos emails pour confirmer votre compte."
        );
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        setMessage("Connexion réussie !");
      }
    } catch (e) {
      setError(e.message);
    }
  }

  return (
    <Box
      minHeight="100vh"
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
          textAlign: "center",
        }}
      >
        <Typography variant="h5" fontWeight={800} mb={3}>
          {isSignup ? "Créer un compte" : "Connexion"}
        </Typography>

        <form onSubmit={handleSubmit}>
          {isSignup && (
            <TextField
              fullWidth
              label="Pseudo (visible dans vos créations)"
              value={pseudo}
              onChange={(e) => setPseudo(e.target.value)}
              margin="normal"
              required
            />
          )}
          <TextField
            fullWidth
            type="email"
            label="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            margin="normal"
            required
          />
          <TextField
            fullWidth
            type="password"
            label="Mot de passe"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            margin="normal"
            required
          />

          {isSignup && (
            <FormControlLabel
              control={
                <Checkbox
                  checked={acceptCGU}
                  onChange={(e) => setAcceptCGU(e.target.checked)}
                  color="primary"
                />
              }
              label={
                <span>
                  J’accepte les{" "}
                  <Link to="/mentions-legales" style={{ color: "#5aa8ff" }}>
                    conditions d’utilisation et mentions légales
                  </Link>.
                </span>
              }
              sx={{ mt: 1, textAlign: "left" }}
            />
          )}

          <Stack spacing={2} mt={3}>
            <Button
              type="submit"
              variant="contained"
              color="primary"
              disabled={isSignup && (!pseudo || !acceptCGU)}
            >
              {isSignup ? "Créer mon compte" : "Se connecter"}
            </Button>
            <Button
              variant="text"
              onClick={() => setIsSignup(!isSignup)}
              sx={{ color: "#b7d8ff" }}
            >
              {isSignup
                ? "Déjà inscrit ? Se connecter"
                : "Pas encore de compte ? Créer un compte"}
            </Button>
          </Stack>
        </form>

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

        {/* Mentions d'information RGPD */}
        <Typography variant="body2" color="text.secondary" mt={3} fontSize={12}>
          Votre email ne sera utilisé que pour la connexion et la récupération
          de mot de passe. Les contenus générés sont anonymisés et sous votre
          responsabilité.
        </Typography>
      </Card>
    </Box>
  );
}