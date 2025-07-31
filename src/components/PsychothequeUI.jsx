// src/components/PsychothequeUI.jsx
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

export default function PsychothequeUI({
  psychographies = [],
  topFive = [],
  currentIndex,
  setCurrentIndex,
  selectedForPack = [],
  toggleSelectForPack,
  handleExportPack,
  handleExportSingle,
  handleDownloadImage,
}) {
  const openModal = (index) => setCurrentIndex(index);
  const closeModal = () => setCurrentIndex(null);
  const prevImage = () =>
    setCurrentIndex((i) => (i > 0 ? i - 1 : i));
  const nextImage = () =>
    setCurrentIndex((i) => (i < psychographies.length - 1 ? i + 1 : i));

  return (
    <Box sx={{ p: { xs: 2, md: 4 } }}>
      <Typography variant="h3" fontWeight={700} textAlign="center" mb={4}>
        Psychothèque
      </Typography>

      {/* Bandeau Top 5 */}
      {topFive.length > 0 && (
        <Box
          sx={{
            mb: 4,
            display: "flex",
            overflowX: "auto",
            gap: 2,
            pb: 1,
          }}
        >
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
              <CardMedia component="img" image={p.image_url} alt={p.titre} />
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

      {/* Mur de vignettes (style Instagram) */}
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
              <CardMedia component="img" image={p.image_url} alt={p.titre} />
              {/* Sélecteur de pack */}
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
        {currentIndex !== null && (
          <DialogContent sx={{ bgcolor: "#000", position: "relative", p: 0 }}>
            {/* Boutons de navigation */}
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
              sx={{ position: "absolute", top: "50%", right: 16, color: "#fff" }}
            >
              <ArrowForwardIosIcon />
            </IconButton>

            {/* Contenu de la modale */}
            <Box sx={{ textAlign: "center" }}>
              <img
                src={psychographies[currentIndex].image_url}
                alt={psychographies[currentIndex].titre}
                style={{ maxHeight: "80vh", maxWidth: "90vw", marginTop: "4vh" }}
              />
              <Stack spacing={1} alignItems="center" mt={2} color="#fff">
                <Typography variant="h5">
                  {psychographies[currentIndex].titre}
                </Typography>
                <Typography variant="body2" sx={{ maxWidth: "80%" }}>
                  {psychographies[currentIndex].texte}
                </Typography>
                <Rating
                  value={psychographies[currentIndex].stars || 0}
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
                        psychographies[currentIndex].titre
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