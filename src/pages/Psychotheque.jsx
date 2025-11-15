// src/pages/Psychotheque.jsx
import { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Grid,
  Card,
  CardMedia,
  IconButton,
  Button,
  Dialog,
  DialogContent,
  Stack,
  Rating,
  Checkbox,
  FormControlLabel,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import DownloadIcon from "@mui/icons-material/Download";
import FolderZipIcon from "@mui/icons-material/FolderZip";
import { supabase, isSupabaseConfigured } from "../lib/supabaseClient";
import { generateDocx, generatePackDocxZip } from "../lib/docxGenerator";

export default function Psychotheque() {
  const [psychographies, setPsychographies] = useState([]);
  const [selectedForPack, setSelectedForPack] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(null); // pour modale
  const [topFive, setTopFive] = useState([]);

  // Charger depuis la vue SQL (psychotheque_view) pour éviter les calculs côté client
  const supabaseEnabled = isSupabaseConfigured && !!supabase;

  useEffect(() => {
    async function fetchPsychos() {
      if (!supabaseEnabled) return;
      const { data, error } = await supabase
        .from("psychotheque_view")
        .select("*")
        .eq("is_public", true)
        .order("avg_stars", { ascending: false })
        .limit(50);

      if (!error && data) {
        const top = data.slice(0, 5); // top 5
        setTopFive(top);
        setPsychographies(data);
      } else {
        console.error("Erreur chargement Psychothèque:", error);
      }
    }
    fetchPsychos();
  }, [supabaseEnabled]);

  const openModal = (index) => setCurrentIndex(index);
  const closeModal = () => setCurrentIndex(null);
  const prevImage = () => setCurrentIndex((i) => (i > 0 ? i - 1 : i));
  const nextImage = () =>
    setCurrentIndex((i) => (i < psychographies.length - 1 ? i + 1 : i));

  const toggleSelectForPack = (id) => {
    setSelectedForPack((prev) => {
      if (prev.includes(id)) return prev.filter((p) => p !== id);
      if (prev.length >= 10) {
        alert("Maximum 10 psychographies par pack.");
        return prev;
      }
      return [...prev, id];
    });
  };

  const handleExportPack = async () => {
    const packItems = psychographies.filter((p) =>
      selectedForPack.includes(p.id),
    );
    if (!packItems.length)
      return alert("Sélectionne au moins une psychographie !");
    await generatePackDocxZip(packItems);
    setSelectedForPack([]);
  };

  const handleExportSingle = async (p) => {
    await generateDocx(p);
  };

  const handleDownloadImage = async (url, titre) => {
    try {
      const res = await fetch(url);
      const blob = await res.blob();
      const a = document.createElement("a");
      a.href = URL.createObjectURL(blob);
      a.download = `${titre || "psychographie"}.jpg`;
      a.click();
    } catch {
      alert("Impossible de télécharger l'image.");
    }
  };

  if (!supabaseEnabled) {
    return (
      <Box sx={{ p: { xs: 2, md: 4 } }}>
        <Typography variant="h4" fontWeight={700} textAlign="center" mb={2}>
          Psychothèque indisponible
        </Typography>
        <Typography textAlign="center" color="text.secondary">
          La connexion Supabase est désactivée sur cet environnement. Impossible
          d’afficher la bibliothèque publique.
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ p: { xs: 2, md: 4 } }}>
      <Typography variant="h3" fontWeight={700} textAlign="center" mb={4}>
        Psychothèque publique
      </Typography>

      {/* Bandeau Top 5 */}
      {topFive.length > 0 && (
        <Box sx={{ mb: 4, display: "flex", overflowX: "auto", gap: 2, pb: 1 }}>
          {topFive.map((p) => (
            <Card
              key={p.id}
              sx={{
                minWidth: 220,
                cursor: "pointer",
                borderRadius: 3,
                boxShadow: "0 4px 20px rgba(0,0,0,0.4)",
              }}
              onClick={() => openModal(psychographies.indexOf(p))}
            >
              {p.image_url && (
                <CardMedia
                  component="img"
                  image={p.image_url}
                  alt={p.titre || "Psychographie"}
                  sx={{ height: 160, objectFit: "cover" }}
                />
              )}
            </Card>
          ))}
        </Box>
      )}

      {/* Bouton Export Pack */}
      {selectedForPack.length > 0 && (
        <Box textAlign="center" mb={3}>
          <Button
            variant="contained"
            startIcon={<FolderZipIcon />}
            color="warning"
            onClick={handleExportPack}
          >
            Exporter {selectedForPack.length} éléments en ZIP
          </Button>
        </Box>
      )}

      {/* Grille responsive de vignettes façon Instagram */}
      <Grid container spacing={2}>
        {psychographies.map((p, index) => (
          <Grid item xs={6} sm={4} md={3} key={p.id}>
            <Card
              sx={{
                position: "relative",
                cursor: "pointer",
                borderRadius: 2,
                overflow: "hidden",
                "&:hover": { opacity: 0.9 },
              }}
              onClick={() => openModal(index)}
            >
              {p.image_url && (
                <CardMedia
                  component="img"
                  image={p.image_url}
                  alt={p.titre || "Psychographie"}
                  sx={{ height: 180, objectFit: "cover" }}
                />
              )}
              {/* Sélecteur pour pack */}
              <FormControlLabel
                control={
                  <Checkbox
                    checked={selectedForPack.includes(p.id)}
                    onChange={(e) => {
                      e.stopPropagation();
                      toggleSelectForPack(p.id);
                    }}
                    sx={{
                      position: "absolute",
                      top: 6,
                      left: 6,
                      color: "#fff",
                      "&.Mui-checked": { color: "warning.main" },
                    }}
                  />
                }
                label=""
              />
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Modale plein écran */}
      <Dialog open={currentIndex !== null} onClose={closeModal} fullScreen>
        {currentIndex !== null && psychographies[currentIndex] && (
          <DialogContent sx={{ bgcolor: "#000", position: "relative", p: 0 }}>
            <IconButton
              onClick={closeModal}
              sx={{ position: "absolute", top: 16, right: 16, color: "#fff" }}
            >
              <CloseIcon />
            </IconButton>
            <IconButton
              onClick={prevImage}
              sx={{ position: "absolute", top: "50%", left: 16, color: "#fff" }}
            >
              <ArrowBackIosIcon />
            </IconButton>
            <IconButton
              onClick={nextImage}
              sx={{
                position: "absolute",
                top: "50%",
                right: 16,
                color: "#fff",
              }}
            >
              <ArrowForwardIosIcon />
            </IconButton>

            <Box sx={{ textAlign: "center" }}>
              {psychographies[currentIndex].image_url && (
                <img
                  src={psychographies[currentIndex].image_url}
                  alt={psychographies[currentIndex].titre || ""}
                  style={{
                    maxHeight: "80vh",
                    maxWidth: "90vw",
                    marginTop: "4vh",
                  }}
                />
              )}
              <Stack spacing={1} alignItems="center" mt={2} color="#fff">
                <Typography variant="h5">
                  {psychographies[currentIndex].titre || "Sans titre"}
                </Typography>
                <Typography variant="body2" sx={{ maxWidth: "80%" }}>
                  {psychographies[currentIndex].texte || ""}
                </Typography>
                <Rating
                  value={psychographies[currentIndex].avg_stars || 0}
                  max={4}
                  readOnly
                />
                <Stack direction="row" spacing={2} mt={2}>
                  <Button
                    variant="contained"
                    color="primary"
                    startIcon={<DownloadIcon />}
                    onClick={() =>
                      handleDownloadImage(
                        psychographies[currentIndex].image_url,
                        psychographies[currentIndex].titre,
                      )
                    }
                  >
                    Télécharger image
                  </Button>
                  <Button
                    variant="outlined"
                    color="secondary"
                    onClick={() =>
                      handleExportSingle(psychographies[currentIndex])
                    }
                  >
                    Exporter DOCX
                  </Button>
                </Stack>
              </Stack>
            </Box>
          </DialogContent>
        )}
      </Dialog>
    </Box>
  );
}
