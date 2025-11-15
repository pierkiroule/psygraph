export default function Result({
  data,
  onExportHtml,
  onExportPng,
  onCocreate,
  onRegenerate,
  onReset,
  loading,
}) {
  const { output, sliders, styles } = data;
  const tags = output.tags || [];

  return (
    <div className="psy-card result-screen">
      <div className="result-image">
        {output.image_url ? <img src={output.image_url} alt="Projection projective" /> : <div className="image-placeholder">Image projective</div>}
      </div>
      <section>
        <h3>Texte hypnopoétique</h3>
        <pre>{output.text || "Le texte apparaîtra ici."}</pre>
      </section>
      <section>
        <h3>Guide interprétatif</h3>
        <pre>{output.guide || "Guide à venir."}</pre>
      </section>
      <section>
        <h3>Tags projectifs</h3>
        <div className="tag-row">
          {tags.length === 0 && <span className="chip">à générer</span>}
          {tags.map((tag) => (
            <span key={tag} className="chip">
              #{tag}
            </span>
          ))}
        </div>
      </section>
      <section>
        <h3>Paramètres visibles</h3>
        <div className="param-grid">
          {Object.entries(sliders).map(([key, value]) => (
            <span key={key} className="param-pill">
              {key} · {value}
            </span>
          ))}
          <span className="param-pill">texte · {styles.text}</span>
          <span className="param-pill">image · {styles.image}</span>
          <span className="param-pill">guide · {styles.guide}</span>
        </div>
      </section>
      <div className="psy-actions wrap">
        <button className="psy-button ghost" onClick={onExportHtml}>
          Exporter HTML
        </button>
        <button className="psy-button ghost" onClick={onExportPng}>
          Exporter PNG
        </button>
        <button className="psy-button" onClick={onCocreate}>
          Cocréer
        </button>
        <button className="psy-button" onClick={onRegenerate} disabled={loading}>
          {loading ? "Projection..." : "Regénérer"}
        </button>
          <button className="psy-button primary" onClick={onReset}>
            Nouvelle Psychographie
        </button>
      </div>
    </div>
  );
}
