// src/pages/MentionsLegales.jsx
import { Box, Typography, Card, Divider, Stack, Button } from "@mui/material";
import { Link } from "react-router-dom";

export default function MentionsLegales() {
  return (
    <Box minHeight="100vh" display="flex" alignItems="center" justifyContent="center" p={3}>
      <Card
        sx={{
          maxWidth: 720,
          width: "100%",
          p: { xs: 3, sm: 5 },
          borderRadius: 4,
          bgcolor: "rgba(255,255,255,0.05)",
          backdropFilter: "blur(12px)",
          boxShadow: "0 4px 24px rgba(0,0,0,0.3)",
        }}
      >
        <Typography variant="h4" mb={2} fontWeight={700} textAlign="center">
          Mentions légales & Conditions d’utilisation
        </Typography>
        <Divider sx={{ mb: 3 }} />

        <Stack spacing={3}>
          <section>
            <Typography variant="h6" fontWeight={600}>
              1. Données personnelles et anonymisation
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Le Psychographe respecte le RGPD. Les utilisateurs doivent veiller à anonymiser les données 
              qu’ils saisissent (pas de noms réels, adresses ou données sensibles).  
              Les adresses email collectées ne sont utilisées que pour la connexion et la réinitialisation du mot de passe.  
              Aucune utilisation commerciale ou publicitaire.
            </Typography>
          </section>

          <section>
            <Typography variant="h6" fontWeight={600}>
              2. Contenus générés par l’I.A
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Les textes et images générés par l’application sont produits automatiquement par des systèmes d’intelligence artificielle.  
              Leur contenu est purement créatif et ne constitue pas un avis médical, psychologique ou juridique.  
              L’utilisateur est seul responsable de l’usage des contenus générés.
            </Typography>
          </section>

          <section>
            <Typography variant="h6" fontWeight={600}>
              3. Responsabilité et usage
            </Typography>
            <Typography variant="body1" color="text.secondary">
              L’équipe du Psychographe décline toute responsabilité concernant :  
              les interprétations des contenus générés, leur diffusion ou toute conséquence découlant de leur utilisation.  
              En utilisant l’application, l’utilisateur accepte de l’utiliser sous sa propre responsabilité.
            </Typography>
          </section>

          <section>
            <Typography variant="h6" fontWeight={600}>
              4. Suppression des données
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Conformément au RGPD, chaque utilisateur peut demander la suppression de ses données personnelles 
              (profil, créations et informations de compte) via la page Profil ou en nous contactant à :  
              <a href="mailto:support@psychographe.app" style={{ color: "#5aa8ff" }}>support@psychographe.app</a>.
            </Typography>
          </section>

          <section>
            <Typography variant="h6" fontWeight={600}>
              5. Acceptation des CGU
            </Typography>
            <Typography variant="body1" color="text.secondary">
              En créant un compte ou en utilisant l’application, l’utilisateur reconnaît avoir lu et accepté 
              les présentes mentions légales et conditions d’utilisation.
            </Typography>
          </section>
        </Stack>

        <Stack direction="row" justifyContent="center" mt={4}>
          <Button component={Link} to="/" variant="contained" color="primary">
            Retour à l’accueil
          </Button>
        </Stack>
      </Card>
    </Box>
  );
}