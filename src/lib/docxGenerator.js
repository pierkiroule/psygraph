// src/lib/docxGenerator.js
import {
  Document,
  Packer,
  Paragraph,
  TextRun,
  AlignmentType,
} from "docx";
import JSZip from "jszip";
import { saveAs } from "file-saver";

// Crée un document Word pour une ou plusieurs psychographies
async function createDoc(psychographies) {
  const sections = [];

  for (const p of psychographies) {
    const titre = p.titre || "Sans titre";
    const pseudo = p.pseudo || "Anonyme";
    const date = new Date(p.created_at || new Date()).toLocaleDateString("fr-FR");
    const texte = p.texte || "";
    const tags = p.tags?.length ? p.tags.map((t) => `#${t}`).join("  ") : "";

    const children = [
      // Titre
      new Paragraph({
        alignment: AlignmentType.CENTER,
        children: [
          new TextRun({ text: titre, bold: true, size: 48, color: "3A6EA5" }),
        ],
        spacing: { after: 300 },
      }),

      // Auteur + date
      new Paragraph({
        alignment: AlignmentType.CENTER,
        children: [
          new TextRun({
            text: `Auteur : ${pseudo}  •  ${date}`,
            italics: true,
            size: 24,
            color: "7F8C8D",
          }),
        ],
        spacing: { after: 300 },
      }),
    ];

    // Tags
    if (tags) {
      children.push(
        new Paragraph({
          alignment: AlignmentType.CENTER,
          children: [
            new TextRun({
              text: `Mots-clés : ${tags}`,
              bold: true,
              size: 26,
              color: "2980B9",
            }),
          ],
          spacing: { after: 400 },
        })
      );
    }

    // Texte principal
    if (texte) {
      children.push(
        new Paragraph({
          alignment: AlignmentType.JUSTIFIED,
          spacing: { line: 360, after: 400 },
          children: [
            new TextRun({ text: texte, size: 28, color: "2C3E50" }),
          ],
        })
      );
    }

    // Image : pour l'instant on affiche un message
    if (p.image_url) {
      children.push(
        new Paragraph({
          alignment: AlignmentType.CENTER,
          children: [
            new TextRun({
              text: "[Image non intégrée dans cette version]",
              italics: true,
              size: 22,
              color: "FF0000",
            }),
          ],
        })
      );
    }

    sections.push({ children });
  }

  return new Document({ sections });
}

// Export d’une seule psychographie
export async function generateDocx(p) {
  const doc = await createDoc([p]);
  const blob = await Packer.toBlob(doc);
  saveAs(blob, `${p.titre || "psychographie"}.docx`);
}

// Export d’un pack ZIP (plusieurs psychographies)
export async function generatePackDocxZip(psychographies, pseudo = "anonyme") {
  const zip = new JSZip();

  for (const p of psychographies) {
    const doc = await createDoc([p]);
    const blob = await Packer.toBlob(doc);
    const safeTitle = (p.titre || `psy_${p.id}`).replace(/[^\w\d-_]/g, "_");
    zip.file(`${safeTitle}.docx`, blob);
  }

  const content = await zip.generateAsync({ type: "blob" });
  saveAs(content, `pack-psychographe-${pseudo}.zip`);
}