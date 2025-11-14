import { SLIDER_DIMENSIONS } from "./constants";

export default function Sliders({ sliders, update, next, back }) {
  return (
    <div className="psy-card">
      <h2>Sliders projectifs</h2>
      <div className="slider-grid">
        {SLIDER_DIMENSIONS.map((dim) => (
          <div key={dim.key} className="slider-row">
            <div className="slider-label">
              <span className="emoji">{dim.icon}</span>
              <div>
                <strong>{dim.label}</strong>
                <p>{dim.hint}</p>
              </div>
              <span className="value">{sliders[dim.key]}</span>
            </div>
            <input
              type="range"
              min="1"
              max="5"
              value={sliders[dim.key]}
              onChange={(e) => update({ [dim.key]: Number(e.target.value) })}
            />
          </div>
        ))}
      </div>
      <div className="psy-actions spaced">
        <button className="psy-button ghost" onClick={back}>
          Retour
        </button>
        <button className="psy-button primary" onClick={next}>
          Style
        </button>
      </div>
    </div>
  );
}
