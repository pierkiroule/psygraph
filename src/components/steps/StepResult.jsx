// src/components/steps/StepResult.jsx
import { Box, Typography, Button, Stack, Card } from "@mui/material";

export default function StepResult({ inputData, setInputData, setStep, loading, setLoading, setError }) {
  const handleGenerateImage = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/generate-image", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ imagePrompt: inputData.selectedImagePrompt }),
      });

      const text = await res.text();
      if (!text) throw new Error("Réponse vide du serveur");

      let data;
      try {
        data = JSON.parse(text);
      } catch {
        throw new Error("Format de réponse JSON invalide");
      }

      if (data.error) throw new Error(data.error);

      setInputData((prev) => ({ ...prev, imageUrl: data.image_url || "" }));
      setStep(5);
    } catch (e) {
      setError("❌ " + e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Stack spacing={3}>
      {inputData.poeticText && (
        <Card sx={{ p: 3, bgcolor: "rgba(255,255,255,0.03)", borderRadius: 3 }}>
          <Typography whiteSpace="pre-line" sx={{ color: "#ffffff" }}>
            {inputData.poeticText}
          </Typography>
        </Card>
      )}

      {inputData.imagePrompts?.length > 0 && !inputData.imageUrl && (
        <Box>
          <Typography variant="h6" gutterBottom>
            Choisis un style visuel :
          </Typography>
          <Stack direction="column" spacing={1} mb={2}>
            {inputData.imagePrompts.map((p, i) => (
              <Button
                key={i}
                variant={inputData.selectedImagePrompt === p ? "contained" : "outlined"}
                onClick={() => setInputData((prev) => ({ ...prev, selectedImagePrompt: p }))}
              >
                {p}
              </Button>
            ))}
          </Stack>
          <Button
            variant="contained"
            color="primary"
            disabled={!inputData.selectedImagePrompt || loading}
            onClick={handleGenerateImage}
          >
            Générer l'image
          </Button>
        </Box>
      )}

      {inputData.imageUrl && (
        <Box textAlign="center">
          <img
            src={inputData.imageUrl}
            alt="Psychographie"
            style={{ maxWidth: "100%", borderRadius: "12px", marginTop: "12px" }}
          />
        </Box>
      )}
    </Stack>
  );
}