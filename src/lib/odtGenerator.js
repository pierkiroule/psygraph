// src/lib/odtGenerator.js
import carbone from "carbone";
import JSZip from "jszip";
import { saveAs } from "file-saver";

// Template ODT vide par défaut (Carbone peut générer sans modèle)
const baseTemplate = null;

// Génère un document ODT pour une psychographie
export async function generateOdt(p) {
  const data = {
    titre: p.titre || "Sans titre",
    auteur: p.pseudo || "Anonyme",
    date: new Date(p.created_at || new Date()).toLocaleDateString("fr-FR"),
    texte: p.texte || "",
    tags: p.tags?.length ? p.tags.join(", ") : "",
    image_url: p.image_url || null,
  };

  return new Promise((resolve, reject) => {
    carbone.render(baseTemplate, data, { convertTo: "odt" }, (err, result) => {
      if (err) return reject(err);
      const blob = new Blob([result], { type: "application/vnd.oasis.opendocument.text" });
      saveAs(blob, `${p.titre || "psychographie"}.odt`);
      resolve(blob);
    });
  });
}

// Génère un pack ZIP de plusieurs psychographies en ODT
export async function generatePackOdtZip(psychographies, pseudo = "anonyme") {
  const zip = new JSZip();

  for (const p of psychographies) {
    const odt = await generateOdtBlob(p);
    const safeTitle = (p.titre || `psy_${p.id}`).replace(/[^\w\d-_]/g, "_");
    zip.file(`${safeTitle}.odt`, odt);
  }

  const content = await zip.generateAsync({ type: "blob" });
  saveAs(content, `pack-psychographe-${pseudo}.zip`);
}

// Génère juste le blob ODT (utilisé par la fonction ZIP)
async function generateOdtBlob(p) {
  const data = {
    titre: p.titre || "Sans titre",
    auteur: p.pseudo || "Anonyme",
    date: new Date(p.created_at || new Date()).toLocaleDateString("fr-FR"),
    texte: p.texte || "",
    tags: p.tags?.length ? p.tags.join(", ") : "",
    image_url: p.image_url || null,
  };

  return new Promise((resolve, reject) => {
    carbone.render(baseTemplate, data, { convertTo: "odt" }, (err, result) => {
      if (err) return reject(err);
      resolve(new Blob([result], { type: "application/vnd.oasis.opendocument.text" }));
    });
  });
}