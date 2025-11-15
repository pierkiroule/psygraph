const DEFAULT_MAX_TAGS = 8;
const MIN_TAGS = 5;
const MAX_TAGS = 10;

const stopwords = new Set([
  "je",
  "tu",
  "il",
  "elle",
  "nous",
  "vous",
  "ils",
  "elles",
  "me",
  "te",
  "se",
  "moi",
  "toi",
  "lui",
  "leur",
  "eux",
  "on",
  "les",
  "des",
  "le",
  "la",
  "un",
  "une",
  "au",
  "aux",
  "du",
  "de",
  "ce",
  "ces",
  "cet",
  "cette",
  "dans",
  "sur",
  "sous",
  "par",
  "pour",
  "avec",
  "sans",
  "plus",
  "pas",
  "ne",
  "que",
  "qui",
  "quoi",
  "dont",
  "où",
  "mais",
  "ou",
  "et",
  "donc",
  "or",
  "ni",
  "car",
  "comme",
  "si",
  "tres",
  "très",
  "bien",
  "mal",
  "déjà",
  "encore",
  "fait",
  "faites",
  "faire",
  "être",
  "avoir"
]);

const clinicalToSymbolic = [
  { match: ["scarification", "coupure", "se taill"], tag: "trace intérieure douloureuse" },
  { match: ["suicid", "plus envie de vivre", "mettre fin"], tag: "ombre profonde" },
  { match: ["angoiss", "panique"], tag: "tempête intérieure" },
  { match: ["conflit", "tension", "dispute"], tag: "lien tendu" },
  { match: ["violence", "agression"], tag: "force menaçante" },
  { match: ["abus", "trauma", "traumat"], tag: "blessure ancienne" },
  { match: ["mère", "père", "famille", "fratrie"], tag: "enveloppe familiale" },
  { match: ["contrôle", "emprise", "domination"], tag: "étroitesse du paysage" },
  { match: ["fatigue", "epuis", "épuis", "lassitude"], tag: "brouillard persistant" },
  { match: ["colere", "colère"], tag: "feu contenu" },
  { match: ["culpabil", "honte"], tag: "poids intérieur" },
  { match: ["tristesse", "pleur"], tag: "pluie fine" },
  { match: ["peur", "terreur"], tag: "ombre menaçante" },
  { match: ["joie", "plaisir", "jeu"], tag: "élan lumineux" },
  { match: ["rêve", "reve", "imag"], tag: "horizon onirique" },
  { match: ["nuit", "sommeil"], tag: "ciel sombre" },
  { match: ["stress"], tag: "climat chargé" },
  { match: ["solitude", "isolement"], tag: "espace vide" },
  { match: ["liberte", "liberté"], tag: "besoin d'espace" },
  { match: ["respir", "souffle"], tag: "air rare" }
];

const toneAmplifiers = [
  { match: ["nuit", "sombre", "noir"], tag: "ciel sombre" },
  { match: ["jour", "clair", "lumiere", "lumière"], tag: "lumière douce" },
  { match: ["mer", "vague"], tag: "houle émotionnelle" },
  { match: ["montagne", "roc", "mur"], tag: "relief imposant" },
  { match: ["respir", "souffle"], tag: "besoin d'espace" },
  { match: ["douleur", "souffrance"], tag: "coeur serré" },
  { match: ["espoir", "envie"], tag: "lueur intérieure" },
  { match: ["calme", "paisible"], tag: "paysage apaisé" },
  { match: ["angoiss", "peur"], tag: "ciel chargé" }
];

const bannedLiteralTerms = ["scarification", "suicide", "abus", "violence", "alcoolisme", "toxicomanie", "inceste", "ts"];

export async function extractTags(rawText, options = {}) {
  const { maxTags = DEFAULT_MAX_TAGS, useLLM = false } = options;

  if (typeof rawText !== "string") {
    return [];
  }

  const clampedMax = clampMaxTags(maxTags);
  const sanitized = sanitizeInput(rawText);

  if (!sanitized) {
    return generateFallbackTags([], clampedMax);
  }

  const normalized = sanitized.toLowerCase();

  if (useLLM) {
    const llmTags = await extractTagsWithLLM(normalized, clampedMax);
    if (Array.isArray(llmTags) && llmTags.length > 0) {
      return finalizeTags(llmTags, clampedMax);
    }
  }

  const keywords = extractKeywords(normalized);
  const symbolicTags = new Set();

  clinicalToSymbolic.forEach(({ match, tag }) => {
    if (match.some((needle) => includesPattern(normalized, keywords, needle))) {
      symbolicTags.add(tag);
    }
  });

  toneAmplifiers.forEach(({ match, tag }) => {
    if (match.some((needle) => includesPattern(normalized, keywords, needle))) {
      symbolicTags.add(tag);
    }
  });

  if (symbolicTags.size === 0) {
    const inferred = inferGenericFromKeywords(keywords);
    inferred.forEach((tag) => symbolicTags.add(tag));
  }

  return finalizeTags([...symbolicTags], clampedMax);
}

async function extractTagsWithLLM(cleanText, maxTags) {
  // TODO: implémenter plus tard avec un LLM local
  return [];
}

function sanitizeInput(text) {
  if (!text) {
    return "";
  }

  let cleaned = text.normalize("NFKC").trim();

  cleaned = cleaned.replace(/[A-ZÀ-Ý][\p{L}\-']{2,}/gu, " ");
  cleaned = cleaned.replace(/[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/gi, " ");
  cleaned = cleaned.replace(/https?:\/\/\S+/gi, " ");
  cleaned = cleaned.replace(/@\w+/g, " ");
  cleaned = cleaned.replace(/\b\d{1,2}[\/\-\.]\d{1,2}[\/\-\.]\d{2,4}\b/g, " ");
  cleaned = cleaned.replace(/\b\d{3,}\b/g, " ");
  cleaned = cleaned.replace(/\b(?:ville|hopital|hôpital|clinique|lyon|paris|marseille|lille|nantes|toulouse|nice)\b/gi, " ");
  cleaned = cleaned.replace(/\s+/g, " ");

  return cleaned.trim();
}

function extractKeywords(text) {
  const normalized = text.replace(/[^a-zàâçéèêëîïôöùûüÿœ\s]/g, " ");
  return normalized
    .split(/\s+/)
    .map(trimSuffix)
    .filter((word) => word && word.length > 2 && !stopwords.has(word));
}

function trimSuffix(word) {
  return word
    .replace(/(ations?|ments?|ement|tion|s|es)$/i, "")
    .replace(/é$/, "er");
}

function includesPattern(text, keywords, needle) {
  return text.includes(needle) || keywords.some((kw) => kw.includes(needle));
}

function inferGenericFromKeywords(keywords) {
  const cues = [
    { words: ["viol", "tension", "coler"], tag: "orages intérieurs" },
    { words: ["famill", "parent"], tag: "enveloppe familiale" },
    { words: ["jou", "envie", "plais"], tag: "élan vital" },
    { words: ["libert", "respir"], tag: "besoin d'espace" },
    { words: ["ango", "peur", "stress"], tag: "climat chargé" }
  ];

  const tags = new Set();
  cues.forEach(({ words, tag }) => {
    if (words.some((needle) => keywords.some((kw) => kw.includes(needle)))) {
      tags.add(tag);
    }
  });

  return tags.size > 0 ? [...tags] : [];
}

function generateFallbackTags(existingTags, maxTags) {
  const fallbackPool = [
    "paysage neutre",
    "climat calme",
    "lumière diffuse",
    "mouvement léger",
    "terrain ouvert",
    "présence douce",
    "horizon souple"
  ];

  const tags = [...existingTags];
  let idx = 0;

  while (tags.length < Math.max(MIN_TAGS, Math.min(maxTags, MAX_TAGS)) && idx < fallbackPool.length) {
    tags.push(fallbackPool[idx]);
    idx += 1;
  }

  return tags;
}

function finalizeTags(tags, maxTags) {
  const sanitized = tags
    .map((tag) => tag.trim().toLowerCase())
    .filter(Boolean)
    .filter((tag) => !bannedLiteralTerms.some((forbidden) => tag.includes(forbidden)));

  const deduped = [...new Set(sanitized)];

  if (deduped.length < MIN_TAGS) {
    return generateFallbackTags(deduped, maxTags);
  }

  return deduped.slice(0, maxTags);
}

export { extractTagsWithLLM };
