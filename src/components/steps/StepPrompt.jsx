// src/components/steps/StepPrompt.jsx
import { Stack, Typography, Button, CircularProgress } from "@mui/material";

export default function StepPrompt({ inputData, setInputData, setStep, loading, setLoading, setError }) {
  const handleGenerateText = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/generate-text-guide", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ finalPrompt: inputData.enrichedPrompt }),
      });

      const text = await res.text();
      if (!text) throw new Error("Réponse vide du serveur");

      let data;
      try {
        data = JSON.parse(text);
      } catch {
        throw new Error("Format JSON invalide");
      }

      if (data.error) throw new Error(data.error);

      setInputData((prev) => ({
        ...prev,
        poeticText: data.poetic_text || "",
        imagePrompts: data.image_prompts || [],
        tags: data.tags || [],
        guide: data.guide || {},
      }));
      setStep(2);
    } catch (e) {
      setError("❌ " + e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Stack spacing={3}>
      <Typography variant="h5">2. Valide et génère le contenu</Typography>

      <Typography sx={{ whiteSpace: "pre-line", color: "#fff" }}>
        <strong>Prompt enrichi :</strong>
        {"\n" + inputData.enrichedPrompt}
      </Typography>

      <Button
        variant="contained"
        color="primary"
        onClick={handleGenerateText}
        disabled={loading}
      >
        {loading ? <CircularProgress size={24} /> : "Générer le texte et les styles d'image"}
      </Button>
    </Stack>
  );
}