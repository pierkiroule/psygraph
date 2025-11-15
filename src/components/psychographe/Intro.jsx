export default function Intro({ onStart }) {
  return (
    <div className="psy-card intro-screen">
      <div className="psy-bubble breathing" aria-hidden="true" />
      <p className="psy-label">Bulle respirante</p>
        <h1>Psychographie</h1>
      <p className="psy-sub">
        L&apos;appli frugale de projection résonante. Respire, entre, laisse-toi surprendre.
      </p>
        <button className="psy-button primary" onClick={onStart}>
          Créer une psychographie
      </button>
    </div>
  );
}
