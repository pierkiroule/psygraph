import { Box, Card, CardContent, Typography } from "@mui/material";

export default function Theorie() {
  return (
    <Box minHeight="80vh" display="flex" alignItems="center" justifyContent="center">
      <Card sx={{ maxWidth: 560, width: "100%", p: 3 }}>
        <CardContent>
          <Typography variant="h4" color="primary" fontWeight={700} gutterBottom>
            📚 Théorie & Modèle
          </Typography>
            <Typography color="text.secondary" sx={{ mb: 2 }}>
              Les principes de Psychographie :
          </Typography>
          <ul style={{ color: "inherit", fontSize: 17, lineHeight: 1.8 }}>
            <li>
              <strong>Résonance :</strong> chaque création est une projection singulière, inspirée de la subjectivité de l’utilisateur.
            </li>
            <li>
              <strong>Exploration :</strong> le cheminement passe par la métaphore, la narration, et l’image mentale.
            </li>
            <li>
              <strong>Transformation :</strong> chaque expérience vise à déclencher une prise de conscience ou un nouveau regard sur soi.
            </li>
            <li>
              <strong>Modèle 6D :</strong> morphose, sémiose, ontose, technose, chronose, hypnose (cf. documentation détaillée sur le modèle).
            </li>
          </ul>
        </CardContent>
      </Card>
    </Box>
  );
}