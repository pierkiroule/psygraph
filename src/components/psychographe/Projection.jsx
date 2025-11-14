export default function Projection({ message = "Résonance en cours…" }) {
  return (
    <div className="psy-card projection">
      <div className="pulse-wrapper">
        <div className="pulse-bubble" />
        <div className="pulse-bubble delay" />
        <div className="pulse-bubble delay-2" />
      </div>
      <p className="projection-text">{message}</p>
      <p className="projection-sub">Gemma 9B (texte) · Flux Schnell (image) · tags locaux</p>
    </div>
  );
}
