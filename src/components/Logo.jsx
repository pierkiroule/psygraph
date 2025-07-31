// src/components/Logo.jsx
import { Box } from "@mui/material";

export default function Logo({ size = 220, tagline = "•°" }) {
  return (
    <Box
      sx={{
        width: size,
        height: size,
        mx: "auto",
        mb: 3,
        position: "relative",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      {/* Halo central rose-orangé */}
      <Box
        sx={{
          position: "absolute",
          width: size * 0.8,
          height: size * 0.8,
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(255,200,150,0.4) 0%, transparent 80%)",
          filter: "blur(40px)",
          animation: "pulseHalo 5s ease-in-out infinite",
        }}
      />

      {/* Ondes concentriques */}
      {[1, 2, 3].map((i) => (
        <Box
          key={i}
          sx={{
            position: "absolute",
            width: size * 0.6,
            height: size * 0.6,
            borderRadius: "50%",
            border: "2px solid rgba(255,180,160,0.4)",
            animation: `ripple ${4 + i}s ease-out infinite`,
            animationDelay: `${i * 1.2}s`,
          }}
        />
      ))}

      {/* Texte central sans coupure */}
      <Box
        sx={{
          zIndex: 2,
          color: "#fff",
          fontWeight: 800,
          fontSize: size * 0.17,
          textShadow: "0 0 12px rgba(255,200,160,0.8)",
          letterSpacing: "3px",
          whiteSpace: "nowrap", // Empêche le retour à la ligne
        }}
      >
        {"PSYCH"}
        <Box
          component="span"
          sx={{
            display: "inline-block",
            animation: "pulseO 1.6s ease-in-out infinite",
            color: "#ffe6cc",
            textShadow: "0 0 15px rgba(255,180,120,0.9)",
            mx: "1px", // espace visuel
          }}
        >
          O
        </Box>
        {"GRAPH"}
      </Box>

      {/* Tagline */}
      {tagline && (
        <Box
          sx={{
            position: "absolute",
            bottom: -size * 0.15,
            fontSize: size * 0.07,
            color: "rgba(255,230,220,0.8)",
            letterSpacing: "2px",
            textShadow: "0 0 6px rgba(255,200,160,0.6)",
          }}
        >
          {tagline}
        </Box>
      )}

      <style>
        {`
          @keyframes pulseHalo {
            0% { transform: scale(0.9); opacity: 0.4; }
            50% { transform: scale(1.1); opacity: 0.7; }
            100% { transform: scale(0.9); opacity: 0.4; }
          }
          @keyframes ripple {
            0% { transform: scale(0.6); opacity: 0.5; }
            80% { transform: scale(1.5); opacity: 0; }
            100% { opacity: 0; transform: scale(1.5); }
          }
          @keyframes pulseO {
            0%, 100% { transform: scale(1); opacity: 1; }
            50% { transform: scale(1.3); opacity: 0.8; }
          }
        `}
      </style>
    </Box>
  );
}