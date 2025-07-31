import express from "express";
import fetch from "node-fetch";
import {
  buildPrompt,
  generateTextAndGuide,
  generateImage,
  savePsychographie,
} from "./services.js";

const router = express.Router();

router.post("/generate-prompt", async (req, res) => {
  try {
    const { idea, options } = req.body;
    if (!idea) return res.status(400).json({ error: "Idée manquante" });
    const prompt = buildPrompt(idea, options || {});
    return res.json({ enrichedPrompt: prompt || "" });
  } catch (err) {
    console.error("Erreur /generate-prompt:", err.message);
    return res.status(500).json({ error: err.message || "Erreur serveur" });
  }
});

router.post("/generate-text-guide", async (req, res) => {
  try {
    const { finalPrompt } = req.body;
    if (!finalPrompt) return res.status(400).json({ error: "Prompt manquant" });
    const result = await generateTextAndGuide(finalPrompt);
    return res.json(result || { poetic_text: "", image_prompts: [], tags: [], guide: {} });
  } catch (err) {
    console.error("Erreur /generate-text-guide:", err.message);
    return res.status(500).json({ error: err.message || "Erreur IA" });
  }
});

router.post("/generate-image", async (req, res) => {
  try {
    const { imagePrompt } = req.body;
    if (!imagePrompt) return res.status(400).json({ error: "Prompt image manquant" });

    const url = await generateImage(imagePrompt);
    return res.json({ image_url: url || "" });
  } catch (err) {
    console.error("Erreur /generate-image:", err.message);
    return res.status(500).json({ error: err.message || "Erreur IA image" });
  }
});

router.get("/proxy-image", async (req, res) => {
  const url = req.query.url;
  if (!url) return res.status(400).json({ error: "URL manquante" });

  try {
    const r = await fetch(url);
    if (!r.ok) throw new Error(`Échec téléchargement : ${url}`);
    const buffer = Buffer.from(await r.arrayBuffer());
    return res.json({ data: `data:image/png;base64,${buffer.toString("base64")}` });
  } catch (err) {
    console.error("Erreur proxy-image:", err.message);
    return res.json({ data: "" });
  }
});

export default router;