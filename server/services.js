export function buildPrompt(idea, options) {
  return `Transforme l'idée "${idea}" en une exploration poétique ${JSON.stringify(options)}`;
}

export async function generateTextAndGuide(prompt) {
  // Simulation
  return {
    poetic_text: `🌌 Voici un texte inspiré par : ${prompt}`,
    image_prompts: [
      "forêt onirique baignée de lumière",
      "arbre cosmique vibrant d’émotions",
      "paysage symbolique entre rêve et réalité"
    ],
    tags: ["nature", "onirique", "symbolique"],
    guide: {
      intention: "exploration émotionnelle",
      symbolique: "liens entre racines et ciel",
      usage: "pour séance de visualisation",
    },
  };
}

export async function generateImage(prompt) {
  // Simulation
  return `https://dummyimage.com/600x400/111/fff&text=${encodeURIComponent(prompt.slice(0, 20))}`;
}

export async function savePsychographie(data) {
  // Stub pour extension future
  return { success: true, message: "Enregistrement simulé" };
}