// src/lib/pdfExporter.js
import { PDFDocument, rgb, StandardFonts } from "pdf-lib";

// Récupère une image via le proxy (Base64 -> Uint8Array)
async function fetchImageBytes(url) {
  try {
    const res = await fetch(`http://localhost:3001/proxy-image?url=${encodeURIComponent(url)}`);
    const json = await res.json();
    if (!json?.data) return null;
    const base64 = json.data.replace(/^data:image\/(png|jpeg);base64,/, "");
    const binary = atob(base64);
    const bytes = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
    return bytes;
  } catch (err) {
    console.error("Erreur récupération image:", err);
    return null;
  }
}

// Exporte une ou plusieurs psychographies en PDF
export async function exportPsychographiesPDF(psychographies, filename = "psychographies.pdf") {
  const pdfDoc = await PDFDocument.create();
  const font = await pdfDoc.embedFont(StandardFonts.Helvetica);

  for (const p of psychographies) {
    const page = pdfDoc.addPage([595, 842]); // A4 portrait
    const { width, height } = page.getSize();
    let y = height - 60;

    // Titre
    page.drawText(p.titre || "Sans titre", { x: 50, y, size: 24, font, color: rgb(0.1, 0.2, 0.5) });
    y -= 40;

    // Auteur + date
    const dateStr = new Date(p.created_at || new Date()).toLocaleDateString("fr-FR");
    page.drawText(`Auteur : ${p.pseudo || "Anonyme"} • ${dateStr}`, {
      x: 50, y, size: 12, font, color: rgb(0.4, 0.4, 0.4),
    });
    y -= 30;

    // Tags
    if (p.tags?.length) {
      page.drawText(`Mots-clés : ${p.tags.map(t => `#${t}`).join("  ")}`, {
        x: 50, y, size: 12, font, color: rgb(0.1, 0.4, 0.8),
      });
      y -= 30;
    }

    // Texte
    const text = p.texte || "";
    const textWidth = 500;
    const fontSize = 14;
    const lineHeight = fontSize * 1.5;
    const words = text.split(" ");
    let line = "";
    for (const word of words) {
      const testLine = line + word + " ";
      const testWidth = font.widthOfTextAtSize(testLine, fontSize);
      if (testWidth > textWidth && line !== "") {
        page.drawText(line, { x: 50, y, size: fontSize, font, color: rgb(0.2, 0.2, 0.2) });
        line = word + " ";
        y -= lineHeight;
      } else {
        line = testLine;
      }
    }
    if (line) page.drawText(line, { x: 50, y, size: fontSize, font, color: rgb(0.2, 0.2, 0.2) });
    y -= lineHeight * 2;

    // Image si dispo
    if (p.image_url) {
      const bytes = await fetchImageBytes(p.image_url);
      if (bytes) {
        try {
          const img = await pdfDoc.embedPng(bytes).catch(() => pdfDoc.embedJpg(bytes));
          const imgDims = img.scale(0.5);
          const imgX = (width - imgDims.width) / 2;
          const imgY = Math.max(50, y - imgDims.height);
          page.drawImage(img, { x: imgX, y: imgY, width: imgDims.width, height: imgDims.height });
        } catch (e) {
          console.warn("Image non intégrée:", e);
        }
      }
    }
  }

  const pdfBytes = await pdfDoc.save();
  const blob = new Blob([pdfBytes], { type: "application/pdf" });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = filename;
  link.click();
}