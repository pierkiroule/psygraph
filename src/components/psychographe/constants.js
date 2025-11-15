export const SLIDER_DIMENSIONS = [
  { key: "ambiguity", label: "Ambiguïté", icon: "🌫️", hint: "De clair à brumeux" },
  { key: "intensity", label: "Intensité", icon: "🔥", hint: "De murmure à brasier" },
  { key: "sensory", label: "Sensorialité", icon: "🌿", hint: "De minimal à immersif" },
  { key: "surprise", label: "Surprise", icon: "⚡", hint: "De attendu à fulgurant" },
  { key: "symbolic", label: "Symbolique", icon: "🜁", hint: "De concret à archétypal" },
  { key: "temporal", label: "Temporalité", icon: "🕰️", hint: "Du présent au spiralé" },
  { key: "space", label: "Espace narratif", icon: "🌌", hint: "Du point à la constellation" },
  { key: "resonance", label: "Résonance existentielle", icon: "✨", hint: "Du discret à l'infini" },
];

export const STYLE_CHOICES = {
  text: ["sobre", "poétique", "onirique", "autre"],
  image: ["minimaliste", "organique", "surréaliste", "autre"],
  guide: ["neutre", "symbolique", "thérapeutique", "autre"],
};

export const ENERGY_CHOICES = [
  { value: "", label: "Énergie…" },
  { value: "calme", label: "Calme" },
  { value: "tendue", label: "Tendue" },
  { value: "ouverte", label: "Ouverte" },
];

export const INITIAL_PSYCHOGRAPHE = {
  inputs: {
    keyword: "",
    sensation: "",
    energy: "",
  },
  sliders: {
    ambiguity: 3,
    intensity: 3,
    sensory: 3,
    surprise: 3,
    symbolic: 3,
    temporal: 3,
    space: 3,
    resonance: 3,
  },
  styles: {
    text: "poétique",
    image: "organique",
    guide: "symbolique",
    other: "",
  },
  output: {
    text: "",
    image_url: "",
    guide: "",
    tags: [],
    parameters: {},
  },
};

export const STEP_LABELS = [
  "Entrer",
  "Capturer",
  "Sliders",
  "Styles",
  "Projection",
  "Résultat",
];

export const STORAGE_KEY = "psychographie:last-session";
