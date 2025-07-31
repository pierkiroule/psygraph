// ProjectifPrompt.js
import OpenAI from "openai";

const client = new OpenAI({
  baseURL: "https://api.studio.nebius.com/v1/",
  apiKey: process.env.VITE_NEBIUS_API_KEY,
});

const cache = {};

export async function optimizePrompt(userPrompt, userSettings = {}) {
  const cacheKey = JSON.stringify({ userPrompt, userSettings });
  if (cache[cacheKey]) return cache[cacheKey];

  try {
    const res = await client.chat.completions.create({
      model: "meta-llama/Meta-Llama-3.1-8B-Instruct",
      temperature: 0.7,
      max_tokens: 400, // on limite le coût
      messages: [
        {
          role: "system",
          content: `Transforme ce texte pour une psychographie.
          Réponds UNIQUEMENT avec un JSON strict :
          {
            "lang": "fr",
            "prompt_text": "...",         // texte poétique (max 120 mots)
            "prompt_image": "...",        // prompt visuel anglais (max 60 mots)
            "tags": ["mot1","mot2","mot3","mot4","mot5","mot6"],
            "guide": [
              "Relance concrète 1",
              "Relance concrète 2",
              "Relance concrète 3",
              "Relance concrète 4",
              "Relance concrète 5"
            ]
          }`
        },
        {
          role: "user",
          content: [
            {
              type: "text",
              text: `Texte: ${userPrompt}
Style: ${userSettings.style || "poétique"}
ImageStyle: ${userSettings.imageStyle || "onirique"}
Projection: ${userSettings.intensity || "neutre"}
Ambiance: ${userSettings.mood || "calme"}.`
            }
          ]
        }
      ]
    });

    const raw = res.choices?.[0]?.message?.content || "{}";
    let parsed = {};
    try {
      parsed = JSON.parse(raw);
    } catch (e) {
      console.warn("⚠️ JSON IA invalide, utilisation de valeurs par défaut");
      parsed = {};
    }

    const result = {
      lang: parsed.lang || "fr",
      prompt_text: parsed.prompt_text || userPrompt,
      prompt_image: parsed.prompt_image || userPrompt,
      tags: Array.isArray(parsed.tags) ? parsed.tags.slice(0, 6) : [],
      guide: Array.isArray(parsed.guide) ? parsed.guide : []
    };

    cache[cacheKey] = result;
    return result;

  } catch (err) {
    console.error("Erreur optimizePrompt:", err);
    // On renvoie un objet valide même en cas de plantage
    return {
      lang: "fr",
      prompt_text: userPrompt,
      prompt_image: userPrompt,
      tags: [],
      guide: []
    };
  }
}