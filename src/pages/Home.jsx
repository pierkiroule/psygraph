// src/pages/Home.jsx
import {
  Box,
  Typography,
  Button,
  Stack,
  ToggleButtonGroup,
  ToggleButton,
  useMediaQuery,
} from "@mui/material";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "../context/UserContext";
import Logo from "../components/Logo";

export default function Home() {
  const [lang, setLang] = useState("fr");
  const isMobile = useMediaQuery("(max-width:600px)");
  const navigate = useNavigate();
  const { user } = useUser();

    const text = {
      fr: {
        title: "La Psychographie : un outil I.A projectif et cocréatif",
        subtitle: "Au service de votre inconscient ressource",
        desc: [
          "✧ Imagine ta psychographie",
          "✧ Navigue dans un paysage de bulles inspirantes",
          "✧ Laisse-toi porter par la résonance poétique et visuelle",
        ],
        start: "Commencer l’expérience",
        tuto: "🧭 Tuto interactif",
        theory: "📚 Théorie & Modèle",
        footer: "© 2025 Psychographie - Tous droits réservés",
      },
      en: {
        title: "Psychographie: a projective & co-creative A.I. tool",
        subtitle: "Serving your resourceful unconscious",
        desc: [
          "✧ Imagine your psychography",
          "✧ Wander through a landscape of inspiring bubbles",
          "✧ Let yourself be carried by poetic and visual resonance",
        ],
        start: "Start the Experience",
        tuto: "🧭 Interactive Tutorial",
        theory: "📚 Theory & Model",
        footer: "© 2025 Psychographie - All rights reserved",
      },
    }[lang];

  // Navigation sécurisée (redirige vers auth si non connecté)
  const goTo = (path) => {
    if (!user) return navigate("/auth");
    navigate(path);
  };

  return (
    <Box
      component="main"
      sx={{
        minHeight: "100vh",
        width: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        textAlign: "center",
        color: "#fdfdfd",
        px: 2,
        py: { xs: 6, md: 8 },
        position: "relative",
        overflow: "hidden",
        backgroundColor: "#050505",
      }}
    >
      <Box
        aria-hidden
        sx={{
          position: "absolute",
          inset: 0,
          background:
            "radial-gradient(circle at 20% 25%, rgba(59,130,246,0.25), transparent 45%), radial-gradient(circle at 80% 10%, rgba(248,113,113,0.18), transparent 50%)",
          opacity: 0.85,
          zIndex: 0,
        }}
      />
      <Box
        aria-hidden
        sx={{
          position: "absolute",
          inset: 0,
          background: "linear-gradient(180deg, rgba(5,5,5,0) 0%, rgba(5,5,5,0.9) 100%)",
          zIndex: 0,
        }}
      />

      {/* Contenu central */}
      <Box
        sx={{
          maxWidth: 600,
          width: "100%",
          px: { xs: 2, sm: 4 },
          position: "relative",
          zIndex: 1,
        }}
      >
        <Logo size={isMobile ? 180 : 220} />

        {/* Titre et sous-titre */}
        <Typography
          variant={isMobile ? "h6" : "h5"}
          fontWeight={600}
          mb={1.5}
          sx={{
            background: "linear-gradient(90deg,#ffffff,#ffe6cc 80%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            letterSpacing: "1px",
            textShadow: "0 0 8px rgba(255,220,180,0.5)",
          }}
        >
          {text.title}
        </Typography>
        <Typography
          variant="subtitle1"
          sx={{
            color: "#e6f7ff",
            opacity: 0.9,
            mb: 2.5,
            textShadow: "0 0 4px rgba(200,220,255,0.3)",
          }}
        >
          {text.subtitle}
        </Typography>

        {/* Description */}
        <Typography
          fontSize={isMobile ? 14 : 16}
          sx={{ color: "#f5f9ff", opacity: 0.9, mb: 3, lineHeight: 1.6 }}
        >
          {text.desc.map((line, i) => (
            <span key={i}>
              {line}
              <br />
            </span>
          ))}
        </Typography>

        {/* Boutons */}
        <Stack direction="column" spacing={2} alignItems="center" width="100%">
          <Button
            variant="contained"
            color="primary"
            size="medium"
            onClick={() => goTo("/psychographe")}
            sx={{
              px: 4,
              py: 1.2,
              fontWeight: 700,
              fontSize: isMobile ? 14 : 16,
              borderRadius: 99,
              boxShadow: "0 2px 14px #a3f7ff44",
              width: "100%",
              maxWidth: 320,
            }}
          >
            {text.start}
          </Button>

          <Stack
            direction={isMobile ? "column" : "row"}
            spacing={2}
            justifyContent="center"
            width="100%"
            maxWidth={isMobile ? 320 : "100%"}
          >
            <Button
              variant="outlined"
              color="info"
              size="small"
              onClick={() => navigate("/tutoriel")}
              sx={{
                borderRadius: 99,
                px: 3,
                py: 1,
                fontSize: isMobile ? 13 : 15,
                color: "#e0f7ff",
                borderColor: "rgba(255,255,255,0.3)",
                "&:hover": { background: "rgba(255,255,255,0.08)" },
                flex: 1,
              }}
            >
              {text.tuto}
            </Button>
            <Button
              variant="outlined"
              color="secondary"
              size="small"
              onClick={() => navigate("/theorie")}
              sx={{
                borderRadius: 99,
                px: 3,
                py: 1,
                fontSize: isMobile ? 13 : 15,
                color: "#fdf5ff",
                borderColor: "rgba(255,255,255,0.3)",
                "&:hover": { background: "rgba(255,255,255,0.08)" },
                flex: 1,
              }}
            >
              {text.theory}
            </Button>
          </Stack>
        </Stack>
      </Box>

      {/* Sélecteur langue + copyright en bas */}
      <Box
        sx={{
          position: "absolute",
          bottom: { xs: 96, sm: 72 },
          left: "50%",
          transform: "translateX(-50%)",
          textAlign: "center",
          zIndex: 1,
        }}
      >
        <ToggleButtonGroup
          value={lang}
          exclusive
          onChange={(e, val) => val && setLang(val)}
          sx={{
            mb: 1,
            "& .MuiToggleButton-root": {
              color: "#e0f7ff",
              borderColor: "rgba(255,255,255,0.25)",
              px: 2,
              backdropFilter: "blur(6px)",
              backgroundColor: "rgba(8,8,8,0.4)",
              "&.Mui-selected": {
                background: "rgba(255,255,255,0.15)",
                color: "#fff",
              },
            },
          }}
        >
          <ToggleButton value="fr">FR</ToggleButton>
          <ToggleButton value="en">EN</ToggleButton>
        </ToggleButtonGroup>
        <Typography variant="caption" sx={{ color: "#e0f7ff", opacity: 0.7 }}>
          {text.footer}
        </Typography>
      </Box>
    </Box>
  );
}