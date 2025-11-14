import { STYLE_CHOICES } from "./constants";

export default function Styles({ styles, update, back, generate, loading }) {
  const handleSelect = (key) => (event) => update({ [key]: event.target.value });

  return (
    <div className="psy-card">
      <h2>Styles projectifs</h2>
      <div className="style-grid">
        {Object.entries(STYLE_CHOICES).map(([key, options]) => (
          <div key={key} className="psy-field">
            <label>Style {key}</label>
            <select value={styles[key]} onChange={handleSelect(key)}>
              {options.map((opt) => (
                <option key={opt} value={opt}>
                  {opt}
                </option>
              ))}
            </select>
          </div>
        ))}
      </div>
      <div className="psy-field">
        <label>Autre style / guide</label>
        <input value={styles.other} onChange={(e) => update({ other: e.target.value })} placeholder="notes, contraintes..." />
      </div>
      <div className="psy-actions spaced">
        <button className="psy-button ghost" onClick={back}>
          Retour
        </button>
        <button className="psy-button primary" onClick={generate} disabled={loading}>
          {loading ? "Projection..." : "Générer"}
        </button>
      </div>
    </div>
  );
}
