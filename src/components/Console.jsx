import { Box, Slider, Typography, Stack, TextField, Chip } from "@mui/material";
import { DIMENSIONS } from "../config/dimensions";

export default function Console({ inputData, setInputData }) {
  const updateDimension = (key, value) => {
    const dim = DIMENSIONS.find((d) => d.key === key);
    const textAdjs = dim?.text[value - 1] || [];
    const imageAdjs = dim?.image[value - 1] || [];

    setInputData((prev) => ({
      ...prev,
      options: {
        ...prev.options,
        [key]: value,
        [`${key}_textAdjs`]: textAdjs,
        [`${key}_imageAdjs`]: imageAdjs,
      },
    }));
  };

  return (
    <Box sx={{ mt: 2 }}>
      <Typography fontWeight={600} mb={2} sx={{ color: "white" }}>
        Réglages Psychographiques
      </Typography>

      <Stack direction="row" spacing={2} justifyContent="center" flexWrap="wrap">
        {DIMENSIONS.map((dim) => (
          <Box key={dim.key} sx={{ width: 70, textAlign: "center" }}>
            <Typography variant="caption" sx={{ color: "#aef", display: "block", mb: 1 }}>
              {dim.label}
            </Typography>
            <Slider
              orientation="vertical"
              min={1}
              max={5}
              step={1}
              marks
              value={inputData.options[dim.key] || dim.default}
              onChange={(e, val) => updateDimension(dim.key, val)}
              sx={{ height: 140, color: "#7dafff" }}
            />
            <Typography variant="caption" sx={{ display: "block", mt: 1, color: "#ffecb3" }}>
              {DIMENSIONS.find((d) => d.key === dim.key)?.text[(inputData.options[dim.key] || dim.default) - 1].join(", ")}
            </Typography>
          </Box>
        ))}
      </Stack>

      <Box mt={3}>
        <TextField
          label="Personnalisation"
          value={inputData.options.custom || ""}
          onChange={(e) =>
            setInputData((prev) => ({
              ...prev,
              options: { ...prev.options, custom: e.target.value },
            }))
          }
          fullWidth
          multiline
          rows={2}
          InputProps={{ sx: { color: "white" } }}
        />
      </Box>

      {inputData.tags?.length > 0 && (
        <Box mt={2}>
          <Typography variant="subtitle2" mb={1} sx={{ color: "#fff" }}>
            Tags générés :
          </Typography>
          <Stack direction="row" spacing={1} flexWrap="wrap">
            {inputData.tags.map((tag, i) => (
              <Chip key={i} label={`#${tag}`} size="small" color="info" />
            ))}
          </Stack>
        </Box>
      )}
    </Box>
  );
}