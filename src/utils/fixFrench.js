// src/utils/fixFrench.js
// Micro-correcteur de ponctuation française (≈ 400 B)

export function fixText(text) {
  return text
    // Espaces avant ; : ! ? (règles typographiques FR)
    .replace(/ ?([;:!?])/g, ' $1')
    // Doubles espaces -> simples
    .replace(/\s{2,}/g, ' ')
    // Espaces après virgules
    .replace(/,(\S)/g, ', $1')
    // Guillemets FR
    .replace(/"([^"]*)"/g, '« $1 »')
    // Retrait des points ou virgules en double
    .replace(/([.,!?]){2,}/g, '$1')
    .trim();
}

// Correction rapide pour chunks (en live) – léger
export function quickFixChunk(text) {
  return text
    .replace(/,(\S)/g, ', $1')
    .replace(/\s{2,}/g, ' ');
}