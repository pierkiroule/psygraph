import {
  Box,
  Typography,
  TextField,
  Slider,
  Stack,
  Button,
  FormGroup,
  FormControlLabel,
  Checkbox,
} from "@mui/material";

const DIMENSIONS = [
  { key: "projection", label: "Projection", qualia: ["Réalisme", "Symbolique léger", "Équilibré", "Métaphorique", "Surréaliste"] },
  { key: "surprise", label: "Étonnement", qualia: ["Prévisible", "Décalé", "Équilibré", "Surprenant", "Onirique"] },
  { key: "ambiguity", label: "Ambiguïté", qualia: ["Clair", "Nuancé", "Équilibré", "Flou", "Abstrait"] },
  { key: "sensory", label: "Sensorialité", qualia: ["Sobre", "Léger", "Équilibré", "Riche", "Immersif"] },
  { key: "emotional", label: "Émotion", qualia: ["Neutre", "Léger", "Équilibré", "Intense", "Transcendant"] },
  { key: "depth", label: "Profondeur", qualia: ["Superficiel", "Exploratoire", "Équilibré", "Profond", "Existential"] },
];

export default function StepIdea({ inputData, setInputData, setStep, loading, setLoading, setError }) {
  const updateOption = (key, val) =>
    setInputData((prev) => ({ ...prev, options: { ...prev.options, [key]: val } }));

  const handleGeneratePrompt = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/generate-prompt", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ idea: inputData.idea, options: inputData.options }),
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

      setInputData((prev) => ({ ...prev, enrichedPrompt: data.enrichedPrompt || "" }));
      setStep(1);
    } catch (e) {
      setError("❌ " + e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Stack spacing={3}>
      <Typography variant="h5">1. Décris ton idée</Typography>
      <TextField
        label="Ton idée ou sensation"
        value={inputData.idea}
        onChange={(e) => setInputData((p) => ({ ...p, idea: e.target.value }))}
        fullWidth
        multiline
        rows={3}
        sx={{ "& .MuiInputBase-input": { color: "#fff" } }}
      />

      <Typography variant="subtitle1">Réglages projectifs</Typography>
      {DIMENSIONS.map((dim) => (
        <Box key={dim.key} mb={2}>
          <Typography>
            {dim.label}: {dim.qualia[(inputData.options[dim.key] || 3) - 1]}
          </Typography>
          <Slider
            value={inputData.options[dim.key] || 3}
            min={1}
            max={5}
            step={1}
            marks
            onChange={(e, v) => updateOption(dim.key, v)}
          />
        </Box>
      ))}

      <Typography variant="subtitle1">Public cible :</Typography>
      <FormGroup row>
        {["Enfants", "Ados", "Adultes", "Thérapeutes", "Créatifs"].map((opt) => (
          <FormControlLabel
            key={opt}
            control={
              <Checkbox
                checked={inputData.options.public.includes(opt)}
                onChange={(e) =>
                  updateOption(
                    "public",
                    e.target.checked
                      ? [...inputData.options.public, opt]
                      : inputData.options.public.filter((x) => x !== opt)
                  )
                }
              />
            }
            label={opt}
          />
        ))}
      </FormGroup>

      <Typography variant="subtitle1">Usage visé :</Typography>
      <FormGroup row>
        {["Inspiration", "Auto-réflexion", "Atelier", "Thérapie", "Jeu créatif"].map((opt) => (
          <FormControlLabel
            key={opt}
            control={
              <Checkbox
                checked={inputData.options.usage.includes(opt)}
                onChange={(e) =>
                  updateOption(
                    "usage",
                    e.target.checked
                      ? [...inputData.options.usage, opt]
                      : inputData.options.usage.filter((x) => x !== opt)
                  )
                }
              />
            }
            label={opt}
          />
        ))}
      </FormGroup>

      <Button
        variant="contained"
        color="primary"
        disabled={!inputData.idea || loading}
        onClick={handleGeneratePrompt}
      >
        Générer un prompt enrichi
      </Button>
    </Stack>
  );
}