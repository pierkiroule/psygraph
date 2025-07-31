// src/theme.js
import { createTheme } from "@mui/material";

const theme = createTheme({
  palette: {
    mode: "dark",
    primary: { main: "#a5c8ff" },
    secondary: { main: "#f0f4ff" },
    info: { main: "#7dafff" },
    warning: { main: "#ffcba4" },
    error: { main: "#ff8a8a" },
    background: {
      default: "#0f172a",
      paper: "rgba(255,255,255,0.06)",
    },
    text: {
      primary: "#ffffff",
      secondary: "#cbd5e1",
    },
  },
  shape: { borderRadius: 20 },
  typography: {
    fontFamily: "'Inter', 'SF Pro Display', Arial, sans-serif",
  },
  components: {
    MuiTextField: {
      styleOverrides: {
        root: {
          "& .MuiInputBase-input, & textarea": {
            color: "#ffffff !important",          // Texte écrit en blanc
          },
          "& .MuiInputBase-input::placeholder, & textarea::placeholder": {
            color: "rgba(255,255,255,0.5)",
            opacity: 1,
          },
          "& .MuiInputLabel-root": {
            color: "#a5c8ff",
          },
          "& .MuiOutlinedInput-root": {
            "& fieldset": {
              borderColor: "rgba(165,200,255,0.4)",
            },
            "&:hover fieldset": {
              borderColor: "#7dafff",
            },
            "&.Mui-focused fieldset": {
              borderColor: "#a5c8ff",
            },
          },
        },
      },
    },
  },
});

export default theme;