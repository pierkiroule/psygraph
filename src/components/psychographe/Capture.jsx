import { ENERGY_CHOICES } from "./constants";

export default function Capture({ data, update, next }) {
  const disabled = !data.keyword || !data.sensation || !data.energy;

  const handleChange = (key) => (event) => {
    update({ [key]: event.target.value });
  };

  return (
    <div className="psy-card">
      <h2>Capturer le vécu</h2>
      <div className="psy-field">
        <label>Mot-clé du vécu</label>
        <input value={data.keyword} onChange={handleChange("keyword")} placeholder="mot-clé" />
      </div>
      <div className="psy-field">
        <label>Sensation / image intérieure</label>
        <input value={data.sensation} onChange={handleChange("sensation")} placeholder="image intérieure" />
      </div>
      <div className="psy-field">
        <label>Énergie du moment</label>
        <div className="energy-options">
          {ENERGY_CHOICES.filter((opt) => opt.value).map((choice) => (
            <button
              key={choice.value}
              type="button"
              className={`energy-chip ${data.energy === choice.value ? "active" : ""}`}
              onClick={() => update({ energy: choice.value })}
            >
              {choice.value === "calme" && "🫧"}
              {choice.value === "tendue" && "⚡"}
              {choice.value === "ouverte" && "🌬️"}
              <span>{choice.label}</span>
            </button>
          ))}
        </div>
      </div>
      <div className="psy-actions">
        <button className="psy-button primary" onClick={next} disabled={disabled}>
          Continuer
        </button>
      </div>
    </div>
  );
}
