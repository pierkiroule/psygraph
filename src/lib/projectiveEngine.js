const SLIDER_LEXICON = {
  ambiguity: ["clair", "nuancé", "voilé", "brumeux", "mystique"],
  intensity: ["feutré", "pulsant", "ardent", "brûlant", "incandescent"],
  sensory: ["sobre", "tactile", "florissant", "immersif", "synesthésique"],
  surprise: ["prévisible", "décalé", "fulgurant", "électrique", "éruptif"],
  symbolic: ["concret", "allusif", "archétypal", "alchimique", "totémique"],
  temporal: ["présent", "oscillant", "spiralé", "intemporel", "cosmique"],
  space: ["ramassé", "aéré", "orbital", "constellé", "infini"],
  resonance: ["discret", "souterrain", "vibrant", "ample", "illimité"],
};

const ENERGY_LINES = {
  calme: "un souffle calme qui polit les contours",
  tendue: "une tension vive qui tremble dans la lumière",
  ouverte: "une brise ouverte prête à accueillir les imprévus",
  default: "un battement neutre qui attend son timbre",
};

const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const clampValue = (value) => Math.min(5, Math.max(1, Number(value) || 3));

function descriptorFor(key, value) {
  const lexicon = SLIDER_LEXICON[key] || [];
  const index = clampValue(value) - 1;
  return lexicon[index] || "fluide";
}

function svgDataUrl({ keyword, energy, style }) {
  const title = keyword || "Psychographe";
  const accent = style === "minimaliste" ? "#d0f0ff" : style === "surréaliste" ? "#ffd6ff" : "#d8ffdc";
  const base = energy === "tendue" ? "#1f2a4c" : energy === "ouverte" ? "#1c3a44" : "#17233c";
  const svg = `<svg width="720" height="480" viewBox="0 0 720 480" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="${base}" />
        <stop offset="100%" stop-color="#2b3e63" />
      </linearGradient>
    </defs>
    <rect width="720" height="480" fill="url(#grad)" rx="48" />
    <circle cx="520" cy="160" r="92" fill="${accent}" fill-opacity="0.15" />
    <circle cx="200" cy="340" r="120" fill="${accent}" fill-opacity="0.12" />
    <text x="50%" y="52%" fill="${accent}" font-family="Montserrat, 'Space Grotesk', sans-serif" font-size="36" text-anchor="middle">
      ${title.replace(/&/g, "&amp;")}
    </text>
    <text x="50%" y="62%" fill="${accent}" font-size="18" font-family="Montserrat" text-anchor="middle" opacity="0.75">
      ${style} · ${energy || "neutre"}
    </text>
  </svg>`;
  return `data:image/svg+xml,${encodeURIComponent(svg)}`;
}

function collectTokens(str) {
  return (str || "")
    .toLowerCase()
    .split(/[^a-zà-ü0-9]+/i)
    .filter(Boolean);
}

function buildHypnoText({ keyword, sensation, energyLine, sliderMap, styles, contributions }) {
  const duoBlend = contributions.duo.map((c) => c.keyword).filter(Boolean).join(" · ");
  const motif = [keyword, duoBlend].filter(Boolean).join(" / ") || "une trace sans nom";
  const imageLine = sensation || contributions.duo[0]?.sensation || "une image intérieure discrète";
  const surprise = sliderMap.surprise;
  const resonance = sliderMap.resonance;
  const temporal = sliderMap.temporal;

  return [
    `Je pénètre la bulle, ${energyLine}.`,
    `Le mot-clé ${motif} flotte doucement.`,
    `Je vois ${imageLine} et j'écarte les rideaux de ${sliderMap.ambiguity} clair-obscur.`,
    `Chaque souffle devient ${sliderMap.sensory}, ${sliderMap.intensity} dans mes veines.`,
    `Une lueur ${surprise} traverse l'espace narratif ${sliderMap.space}.`,
    `Le temps ${temporal} se plie, laissant surgir une symbolique ${sliderMap.symbolic}.`,
    `La résonance ${resonance} laisse place à un silence fertile.`,
  ].join("\n");
}

function buildGuide(sliders, styles) {
  const emphases = ["ambiguity", "symbolic", "resonance"]
    .map((key) => `${key}=${sliders[key]}`)
    .join(" · ");
  return [
    `Guide ${styles.guide}:`,
    "- Observer comment le mot-clé se diffuse dans le corps.",
    "- Explorer les zones où la symbolique devient palpable.",
    "- Relier l'énergie initiale à la résonance finale.",
    `Paramètres clés: ${emphases}.`,
  ].join("\n");
}

function buildTags({ inputs, styles, contributions }) {
  const tokens = [
    ...collectTokens(inputs.keyword),
    ...collectTokens(inputs.sensation),
    ...contributions.circle.map((c) => c.tag.toLowerCase()),
    styles.text,
    styles.image,
  ].filter(Boolean);
  const counts = tokens.reduce((acc, token) => {
    if (!token) return acc;
    acc[token] = (acc[token] || 0) + 1;
    return acc;
  }, {});
  return Object.entries(counts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 6)
    .map(([key]) => key);
}

function splitContributions(list = []) {
  return list.reduce(
    (acc, item) => {
      if (item.type === "circle") acc.circle.push(item);
      else acc.duo.push(item);
      return acc;
    },
    { duo: [], circle: [] }
  );
}

export async function projectiveEngine({ inputs, sliders, styles, contributions = [] }) {
  await wait(900 + Math.random() * 800);
  const grouped = splitContributions(contributions);
  const sliderMap = Object.entries(sliders).reduce((acc, [key, value]) => {
    acc[key] = descriptorFor(key, value);
    return acc;
  }, {});
  const energyLine = ENERGY_LINES[inputs.energy] || ENERGY_LINES.default;
  const text = buildHypnoText({
    keyword: inputs.keyword,
    sensation: inputs.sensation,
    energyLine,
    sliderMap,
    styles,
    contributions: grouped,
  });
  const guide = buildGuide(sliders, styles);
  const tags = buildTags({ inputs, styles, contributions: grouped });
  const image_url = svgDataUrl({
    keyword: inputs.keyword || "Psychographe",
    energy: inputs.energy,
    style: styles.image,
  });

  return {
    text,
    image_url,
    guide,
    tags,
    parameters: {
      sliders,
      styles,
      energy: inputs.energy,
    },
  };
}
