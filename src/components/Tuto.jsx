import { Box, Card, CardContent, Typography, Button } from "@mui/material";
import { Link as RouterLink } from "react-router-dom";

export default function Tuto() {
  return (
    <Box minHeight="80vh" display="flex" alignItems="center" justifyContent="center">
      <Card sx={{ maxWidth: 560, width: "100%", p: 3 }}>
        <CardContent>
          <Typography variant="h4" color="primary" fontWeight={700} gutterBottom>
            🧭 Tuto interactif
          </Typography>
          <Typography color="text.secondary" sx={{ mb: 2 }}>
            Découvre comment utiliser le Psychographe étape par étape.
          </Typography>
          <ol style={{ color: "inherit", fontSize: 17, lineHeight: 1.8, marginBottom: 16 }}>
            <li>Saisis une idée, une émotion ou une question personnelle.</li>
            <li>Laisse-toi guider par le prompt enrichi généré.</li>
            <li>Découvre le texte poétique et l’image personnalisée.</li>
            <li>Explore la galerie (Psychothèque) ou partage tes créations.</li>
          </ol>
          <Button
            variant="contained"
            color="primary"
            size="large"
            component={RouterLink}
            to="/psychographe"
            fullWidth
            sx={{ mt: 2 }}
          >
            Tester maintenant
          </Button>
        </CardContent>
      </Card>
    </Box>
  );
}