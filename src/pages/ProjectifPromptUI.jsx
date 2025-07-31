import { useState } from "react";
import { optimizePrompt } from "../lib/ProjectifPrompt";

export default function ProjectifPromptUI({ onConfirm }) {
  const [userPrompt, setUserPrompt] = useState("");
  const [style, setStyle] = useState("poétique");
  const [imageStyle, setImageStyle] = useState("onirique");
  const [intensity, setIntensity] = useState("neutre");
  const [mood, setMood] = useState("calme");
  const [promptText, setPromptText] = useState("");
  const [imagePrompt, setImagePrompt] = useState("");
  const [guide, setGuide] = useState([]);
  const [tags, setTags] = useState([]);
  const [manualTag, setManualTag] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleOptimize = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await optimizePrompt(userPrompt, { style, imageStyle, intensity, mood });
      setPromptText(res.prompt_text || "");
      setImagePrompt(res.prompt_image || "");
      setGuide(Array.isArray(res.guide) ? res.guide : []);
      setTags(Array.isArray(res.tags) ? res.tags.slice(0, 6) : []);
    } catch {
      setError("Erreur : impossible de contacter le serveur");
    }
    setLoading(false);
  };

  const handleConfirm = () => {
    onConfirm({
      prompt_text: promptText,
      prompt_image: imagePrompt,
      guide,
      tags,
      settings: { style, imageStyle, intensity, mood }
    });
  };

  const addTag = () => {
    if (manualTag && tags.length < 6) {
      setTags([...tags, manualTag.trim()]);
      setManualTag("");
    }
  };

  const removeTag = (tagToRemove) => {
    setTags(tags.filter((t) => t !== tagToRemove));
  };

  return (
    <div style={{ padding: "1rem", maxWidth: "700px", margin: "auto", fontFamily: "sans-serif" }}>
      <h3>Préparer ma Psychographie</h3>

      <textarea
        value={userPrompt}
        onChange={(e) => setUserPrompt(e.target.value)}
        placeholder="Décris ton idée ou ton ressenti..."
        rows={4}
        style={{ width: "100%", marginBottom: "1rem" }}
      />

      {/* Options */}
      <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
        <div>
          <label>Style du texte</label>
          <select value={style} onChange={(e) => setStyle(e.target.value)}>
            <option value="poétique">Poétique</option>
            <option value="narratif">Narratif</option>
            <option value="surréaliste">Surréaliste</option>
            <option value="neutre">Neutre</option>
          </select>
        </div>
        <div>
          <label>Style visuel</label>
          <select value={imageStyle} onChange={(e) => setImageStyle(e.target.value)}>
            <option value="onirique">Onirique</option>
            <option value="aquarelle">Aquarelle</option>
            <option value="cinématique">Cinématique</option>
            <option value="clair">Clair</option>
            <option value="sombre">Sombre</option>
          </select>
        </div>
        <div>
          <label>Projection</label>
          <select value={intensity} onChange={(e) => setIntensity(e.target.value)}>
            <option value="ouverte">Ouverte</option>
            <option value="neutre">Neutre</option>
            <option value="dirigée">Dirigée</option>
          </select>
        </div>
        <div>
          <label>Ambiance</label>
          <select value={mood} onChange={(e) => setMood(e.target.value)}>
            <option value="calme">Calme</option>
            <option value="rêveuse">Rêveuse</option>
            <option value="dramatique">Dramatique</option>
            <option value="lumineuse">Lumineuse</option>
          </select>
        </div>
      </div>

      <button
        onClick={handleOptimize}
        disabled={!userPrompt || loading}
        style={{ marginTop: "1rem", padding: "0.6rem 1rem", background: "#4f46e5", color: "#fff", borderRadius: "5px" }}
      >
        Générer le prompt
      </button>

      {loading && <p>Optimisation en cours...</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}

      {promptText && (
        <div style={{ marginTop: "1.5rem" }}>
          <h4>Prompt généré (modifiable)</h4>
          <textarea
            value={promptText}
            onChange={(e) => setPromptText(e.target.value)}
            rows={4}
            style={{ width: "100%", marginBottom: "1rem" }}
          />

          <h4>Tags (6 max)</h4>
          <div style={{ marginBottom: "0.5rem" }}>
            {tags.map((tag, i) => (
              <span
                key={i}
                style={{
                  marginRight: "0.5rem",
                  padding: "0.2rem 0.5rem",
                  background: "#eee",
                  borderRadius: "4px",
                  display: "inline-flex",
                  alignItems: "center"
                }}
              >
                {tag}
                <button
                  onClick={() => removeTag(tag)}
                  style={{
                    marginLeft: "0.3rem",
                    background: "transparent",
                    border: "none",
                    cursor: "pointer",
                    color: "#c00"
                  }}
                >
                  ×
                </button>
              </span>
            ))}
          </div>

          <input
            type="text"
            value={manualTag}
            onChange={(e) => setManualTag(e.target.value)}
            placeholder="Ajouter un tag"
          />
          <button onClick={addTag}>Ajouter</button>

          <h4>Guide Écho°</h4>
          {guide.length > 0 ? (
            <ol>
              {guide.map((g, i) => <li key={i}>{g}</li>)}
            </ol>
          ) : (
            <p>(Aucune relance générée)</p>
          )}

          <button
            onClick={handleConfirm}
            style={{ marginTop: "1rem", padding: "0.6rem 1rem", background: "#10b981", color: "#fff", borderRadius: "5px" }}
          >
            Valider et Générer
          </button>
        </div>
      )}
    </div>
  );
}