import { useState } from "react";
import { SLIDER_DIMENSIONS } from "./constants";

export default function CocreationPanel({
  room,
  contributions,
  link,
  createRoom,
  joinRoom,
  leaveRoom,
  addContribution,
  close,
}) {
  const [codeInput, setCodeInput] = useState("");
  const [feedback, setFeedback] = useState("");
  const [duoForm, setDuoForm] = useState({
    keyword: "",
    sensation: "",
    sliderKey: "ambiguity",
    sliderValue: 3,
  });
  const [circleTag, setCircleTag] = useState("");

  const handleCreate = (mode) => {
    const code = createRoom(mode);
    if (!code) {
      setFeedback("Impossible de créer la session.");
      return;
    }
    setFeedback(`Session ${mode} créée · code ${code}`);
  };

  const handleJoin = () => {
    const cleaned = codeInput.trim();
    if (!cleaned) return;
    const ok = joinRoom(cleaned);
    setFeedback(ok ? `Connecté au code ${cleaned}` : "Code introuvable.");
  };

  const copyLink = () => {
    if (!link) return;
    navigator.clipboard?.writeText(link);
    setFeedback("Lien copié.");
  };

  const submitDuo = () => {
    if (!duoForm.keyword) return;
    addContribution({
      type: "duo",
      keyword: duoForm.keyword,
      sensation: duoForm.sensation,
      sliderKey: duoForm.sliderKey,
      sliderValue: duoForm.sliderValue,
    });
    setDuoForm((prev) => ({ ...prev, keyword: "", sensation: "" }));
  };

  const submitCircle = () => {
    if (!circleTag) return;
    addContribution({ type: "circle", tag: circleTag });
    setCircleTag("");
  };

  return (
    <div className="cocreation-panel">
      <div className="panel-card">
        <div className="panel-head">
          <h3>Cocréation instantanée</h3>
          <button className="close-btn" onClick={close}>
            ×
          </button>
        </div>
        {!room && (
          <>
            <div className="panel-section">
              <p>Créer une session</p>
              <div className="panel-actions">
                <button onClick={() => handleCreate("duo")}>Mode duo</button>
                <button onClick={() => handleCreate("circle")}>Cercle (jusqu&apos;à 7)</button>
              </div>
            </div>
            <div className="panel-section">
              <p>Rejoindre par code</p>
              <div className="join-row">
                <input value={codeInput} onChange={(e) => setCodeInput(e.target.value)} placeholder="1234" />
                <button onClick={handleJoin}>Entrer</button>
              </div>
            </div>
          </>
        )}
        {room && (
          <>
            <div className="panel-section room-info">
              <p>
                Mode <strong>{room.mode}</strong> · code <strong>{room.code}</strong>
              </p>
              <div className="panel-actions">
                <button onClick={copyLink} disabled={!link}>
                  Copier le lien
                </button>
                <button onClick={leaveRoom}>Quitter</button>
              </div>
            </div>
            {room.mode === "duo" && (
              <div className="panel-section">
                <h4>Ajouter ta trace</h4>
                <input
                  value={duoForm.keyword}
                  onChange={(e) => setDuoForm((prev) => ({ ...prev, keyword: e.target.value }))}
                  placeholder="mot"
                />
                <input
                  value={duoForm.sensation}
                  onChange={(e) => setDuoForm((prev) => ({ ...prev, sensation: e.target.value }))}
                  placeholder="image intérieure"
                />
                <div className="join-row">
                  <select
                    value={duoForm.sliderKey}
                    onChange={(e) => setDuoForm((prev) => ({ ...prev, sliderKey: e.target.value }))}
                  >
                    {SLIDER_DIMENSIONS.map((dim) => (
                      <option key={dim.key} value={dim.key}>
                        {dim.label}
                      </option>
                    ))}
                  </select>
                  <input
                    type="number"
                    min="1"
                    max="5"
                    value={duoForm.sliderValue}
                    onChange={(e) =>
                      setDuoForm((prev) => ({ ...prev, sliderValue: Number(e.target.value) || 3 }))
                    }
                  />
                </div>
                <button onClick={submitDuo}>Partager</button>
              </div>
            )}
            {room.mode === "circle" && (
              <div className="panel-section">
                <h4>Tags du cercle</h4>
                <div className="join-row">
                  <input value={circleTag} onChange={(e) => setCircleTag(e.target.value)} placeholder="tag" />
                  <button onClick={submitCircle}>Ajouter</button>
                </div>
              </div>
            )}
          </>
        )}
        <div className="panel-section">
          <h4>Contributions</h4>
          <div className="contrib-list">
            {contributions.length === 0 && <p>Aucune contribution pour l&apos;instant.</p>}
            {contributions.map((item) => (
              <div key={item.id} className="contrib-item">
                <span className="chip">{item.type}</span>
                {item.type === "circle" ? (
                  <span>#{item.tag}</span>
                ) : (
                  <span>
                    {item.keyword} · {item.sliderKey} → {item.sliderValue}
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>
        {feedback && <p className="feedback">{feedback}</p>}
      </div>
    </div>
  );
}
