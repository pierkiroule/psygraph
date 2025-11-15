// src/App.jsx
import { CssBaseline } from "@mui/material";
import { ThemeProvider } from "@mui/material/styles";
import { UserProvider } from "./context/UserContext";
import theme from "./theme";
import MinimalLandscapeExperience from "./components/psychographe/MinimalLandscapeExperience";

export default function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <UserProvider>
        <MinimalLandscapeExperience />
      </UserProvider>
    </ThemeProvider>
  );
}