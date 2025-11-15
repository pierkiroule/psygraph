import { useMemo, useState } from "react";
import "./MinimalLandscapeExperience.css";

const STYLE_PROFILES = [
  {
    id: "mineral",
    label: "Minéral",
    palette: ["#0f0c29", "#302b63", "#24243e"],
    titleRoots: ["Crête claire", "Faille suspendue", "Orage lithique"],
    titleSuffix: "du socle intérieur",
    guideFragments: [
      "Suit les lignes nettes qui émergent et garde ce qui doit rester précis.",
      "Laisse la brume remplir les strates avant de choisir ce qui s'ancre.",
      "Dissous les falaises dans la lumière pour n'en garder que l'écho utile.",
    ],
    lexicon: ["quartz", "falaise", "moraine"],
  },
  {
    id: "organique",
    label: "Organique",
    palette: ["#0b486b", "#3b8686", "#79bd9a"],
    titleRoots: ["Delta vivant", "Canopée flottante", "Flux chlorophyllien"],
    titleSuffix: "des terres intérieures",
    guideFragments: [
      "Laisse les tiges se dessiner finement, écoute la pulsation qui naît.",
      "Dilue les contours, favorise les passages et les respirations lentes.",
      "Laisse les spores lumineuses diffuser le sens plutôt que les mots.",
    ],
    lexicon: ["sève", "canopée", "lichen"],
  },
  {
    id: "spectral",
    label: "Spectral",
    palette: ["#20002c", "#6f00ff", "#fcb045"],
    titleRoots: ["Halo synaptique", "Nébuleuse intime", "Aurore diffractée"],
    titleSuffix: "de l'horizon caché",
    guideFragments: [
      "Cadre la lumière pour qu'elle révèle les contours de l'invisible.",
      "Accepte l'ambiguïté, laisse les halos se répondre sans conclure.",
      "Ouvre le champ spectral jusqu'à l'abstraction qui parle d'elle-même.",
    ],
    lexicon: ["impulsion", "spectre", "phosphène"],
  },
];

const INTENSITY_BANDS = [
  { label: "Clair", token: "net", threshold: 34 },
  { label: "Brume", token: "brume", threshold: 67 },
  { label: "Abstrait", token: "spectral", threshold: 101 },
];

const AMPLITUDE_BANDS = [
  { label: "retenue", description: "chuchotée", threshold: 34 },
  { label: "ample", description: "ouverte", threshold: 67 },
  { label: "débordante", description: "vibrante", threshold: 101 },
];

const getStyleProfile = (styleId) =>
  STYLE_PROFILES.find((style) => style.id === styleId) ?? STYLE_PROFILES[0];

const createId = () => `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;

const hashTag = (label) => {
  let hash = 0;
  for (let i = 0; i < label.length; i += 1) {
    hash = (hash << 5) - hash + label.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash).toString(16).slice(0, 6);
};

const anonymizeTags = (tags) => tags.map((tag) => `#${hashTag(tag.toLowerCase())}`);

const gradientFromPalette = (palette, degree, amplitude) => {
  const angle = 25 + (degree / 100) * 70;
  const stopMid = 35 + (degree / 100) * 30;
  const stopEnd = 85 + (amplitude / 100) * 10;
  return `linear-gradient(${angle}deg, ${palette[0]} 0%, ${palette[1]} ${stopMid}%, ${palette[2]} ${stopEnd}%)`;
};

const createSeedEntry = ({ title, summary, guide, styleId, degree, amplitude, tags }) => {
  const profile = getStyleProfile(styleId);
  return {
    id: createId(),
    title,
    summary,
    guide,
    style: profile.label,
    gradient: gradientFromPalette(profile.palette, degree, amplitude),
    privacyTags: anonymizeTags(tags),
    timestamp: "collectif",
  };
};

const PSYCHOTHEQUE_SEED = [
  createSeedEntry({
    title: "Delta brumeux",
    summary: "Les racines flottent et se rejoignent dans une nappe vert émeraude.",
    guide: "Respire lentement, laisse la canopée traduire ce que tu n'oses pas dire.",
    styleId: "organique",
    degree: 58,
    amplitude: 64,
    tags: ["delta", "brume", "renaissance", "organique"],
  }),
  createSeedEntry({
    title: "Crête veillée",
    summary: "Une falaise cobalt se découpe puis se dissout en poussières dorées.",
    guide: "Reste sur la ligne d'horizon tant que le sens veut se déposer.",
    styleId: "mineral",
    degree: 32,
    amplitude: 42,
    tags: ["falaise", "quartz", "vigie", "minéral"],
  }),
  createSeedEntry({
    title: "Spectre feutré",
    summary: "Un halo mauve embrase la dune et laisse une traîne opaline.",
    guide: "Considère chaque reflet comme une réponse possible, sans hiérarchie.",
    styleId: "spectral",
    degree: 82,
    amplitude: 78,
    tags: ["spectre", "aurore", "intuition", "spectral"],
  }),
];

const bandIndex = (value, bands) => bands.findIndex((band) => value < band.threshold);

const buildExperience = ({ degree, amplitude, styleId }) => {
  const profile = getStyleProfile(styleId);
  const intensityIdx = Math.max(0, bandIndex(degree, INTENSITY_BANDS));
  const amplitudeIdx = Math.max(0, bandIndex(amplitude, AMPLITUDE_BANDS));
  const intensity = INTENSITY_BANDS[intensityIdx];
  const amplitudeMood = AMPLITUDE_BANDS[amplitudeIdx];
  const rawTags = [
    profile.label,
    intensity.token,
    amplitudeMood.label,
    profile.lexicon[Math.min(profile.lexicon.length - 1, intensityIdx)],
  ];

  return {
    id: createId(),
    title: `${profile.titleRoots[intensityIdx]} ${profile.titleSuffix}`,
    summary: `Un paysage ${profile.label.toLowerCase()} ${amplitudeMood.description} se déploie dans une ambiance ${intensity.token}. Les matières répondent à ton intention et conservent seulement ce qui est nécessaire.`,
    guide: profile.guideFragments[intensityIdx],
    style: profile.label,
    gradient: gradientFromPalette(profile.palette, degree, amplitude),
    privacyTags: anonymizeTags(rawTags),
    timestamp: new Date().toLocaleTimeString("fr-FR", {
      hour: "2-digit",
      minute: "2-digit",
    }),
  };
};

const Scene = ({ style }) => (
  <div className="mle-scene">
    <div className="mle-scene__visual" style={style} />
    <div className="mle-scene__grid" />
  </div>
);

export default function MinimalLandscapeExperience() {
  const [degree, setDegree] = useState(48);
  const [styleId, setStyleId] = useState(STYLE_PROFILES[0].id);
  const [amplitude, setAmplitude] = useState(58);
  const [currentReveal, setCurrentReveal] = useState(null);
  const [publicEntries, setPublicEntries] = useState(() => PSYCHOTHEQUE_SEED);
  const [selectedEntry, setSelectedEntry] = useState(null);
  const [shareStatus, setShareStatus] = useState(null);
  const [accountModal, setAccountModal] = useState(false);
  const [tutoModal, setTutoModal] = useState(false);

  const activeProfile = getStyleProfile(styleId);

  const sceneStyle = useMemo(() => {
    const blurStrength = (degree / 100) * 8;
    const saturation = 0.9 + amplitude / 160;
    const brightness = 0.85 + amplitude / 400;
    return {
      backgroundImage: gradientFromPalette(activeProfile.palette, degree, amplitude),
      filter: `blur(${blurStrength}px) saturate(${saturation}) brightness(${brightness})`,
      transform: `scale(${1 + amplitude / 500})`,
    };
  }, [activeProfile.palette, degree, amplitude]);

  const handleReveal = () => {
    const experience = buildExperience({ degree, amplitude, styleId });
    setCurrentReveal(experience);
    setPublicEntries((prev) => [experience, ...prev].slice(0, 9));
    setSelectedEntry(experience);
    setShareStatus(null);
  };

  const handleShare = async () => {
    if (!currentReveal) return;
    const payload = `${currentReveal.title} — ${currentReveal.summary} ${currentReveal.privacyTags.join(" ")}`;
    const canShare = typeof navigator !== "undefined" && navigator.share;
    const canCopy = typeof navigator !== "undefined" && navigator.clipboard;

    try {
      if (canShare) {
        await navigator.share({ title: currentReveal.title, text: payload });
        setShareStatus("Partagé ✔");
      } else if (canCopy && navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(payload);
        setShareStatus("Copié dans le presse-papiers");
      } else {
        setShareStatus("Partage indisponible sur ce navigateur");
      }
    } catch (error) {
      setShareStatus("Partage annulé");
    } finally {
      setTimeout(() => setShareStatus(null), 4000);
    }
  };

  return (
    <div className="mle-page">
      <header className="mle-header">
        <div className="mle-logo">
          <span className="mle-logo__mark">PSYCHOGRAPHE</span>
          <span className="mle-logo__title">Paysages inconscients</span>
        </div>
        <div className="mle-header__actions">
          <button type="button" className="mle-button" onClick={() => setAccountModal(true)}>
            Mon compte
          </button>
          <button type="button" className="mle-button" onClick={() => setTutoModal(true)}>
            Tuto
          </button>
        </div>
      </header>

      <section className="mle-intro">
        Bienvenue, psychographe des paysages inconscients. Compose un horizon unique, capture-le en un
        geste, partage-le si tu le souhaites. Les paramètres sont réduits à l’essentiel.
      </section>

      <Scene style={sceneStyle} />

      <section className="mle-controls">
        <div className="mle-control">
          <label>
            Degré projectif
            <span>{degree}%</span>
          </label>
          <input
            type="range"
            min="0"
            max="100"
            value={degree}
            onChange={(event) => setDegree(Number(event.target.value))}
          />
        </div>
        <div className="mle-control">
          <label>Style projectif</label>
          <select
            className="mle-select"
            value={styleId}
            onChange={(event) => setStyleId(event.target.value)}
          >
            {STYLE_PROFILES.map((profile) => (
              <option key={profile.id} value={profile.id}>
                {profile.label}
              </option>
            ))}
          </select>
        </div>
        <div className="mle-control">
          <label>
            Amplitude émotionnelle
            <span>{amplitude}%</span>
          </label>
          <input
            type="range"
            min="0"
            max="100"
            value={amplitude}
            onChange={(event) => setAmplitude(Number(event.target.value))}
          />
        </div>
      </section>

      <section className="mle-action-row">
        <button type="button" className="mle-button mle-button--primary" onClick={handleReveal}>
          Révéler
        </button>
        <div className="mle-privacy">
          <span className="mle-privacy__badge">Confidentialité RGPD++</span>
          Chaque prompt est transformé en tags anonymisés.
        </div>
      </section>

      {currentReveal && (
        <section className="mle-result">
          <div className="mle-result__visual" style={{ backgroundImage: currentReveal.gradient }} />
          <div className="mle-result__content">
            <h2 className="mle-result__title">{currentReveal.title}</h2>
            <p>{currentReveal.summary}</p>
            <p className="mle-guide">{currentReveal.guide}</p>
            <div className="mle-tags">
              {currentReveal.privacyTags.map((tag) => (
                <span key={tag} className="mle-tag">
                  {tag}
                </span>
              ))}
            </div>
            <div>
              <button type="button" className="mle-button" onClick={handleShare}>
                Partager sur les réseaux
              </button>
              {shareStatus && <div className="mle-share-status">{shareStatus}</div>}
            </div>
          </div>
        </section>
      )}

      <section className="mle-library">
        <div className="mle-action-row">
          <h3 style={{ margin: 0 }}>Psychothèque publique</h3>
          <span style={{ fontSize: 13, color: "rgba(255,255,255,0.6)" }}>
            Archives anonymes en libre exploration
          </span>
        </div>
        <div className="mle-library__list">
          {publicEntries.map((entry) => (
            <button
              type="button"
              key={entry.id}
              className="mle-library__card"
              onClick={() => setSelectedEntry(entry)}
            >
              <div className="mle-card__visual" style={{ backgroundImage: entry.gradient }} />
              <h4 className="mle-card__title">{entry.title}</h4>
              <div className="mle-card__tags">
                {entry.privacyTags.map((tag) => (
                  <span key={`${entry.id}-${tag}`} className="mle-tag">
                    {tag}
                  </span>
                ))}
              </div>
            </button>
          ))}
        </div>
      </section>

      {selectedEntry && (
        <div className="mle-drawer">
          <button type="button" className="mle-drawer__close" onClick={() => setSelectedEntry(null)}>
            fermer ✕
          </button>
          <span className="mle-drawer__meta">{selectedEntry.style}</span>
          <h4 style={{ margin: 0 }}>{selectedEntry.title}</h4>
          <p>{selectedEntry.summary}</p>
          <p className="mle-guide">{selectedEntry.guide}</p>
          <div className="mle-tags">
            {selectedEntry.privacyTags.map((tag) => (
              <span key={`${selectedEntry.id}-${tag}`} className="mle-tag">
                {tag}
              </span>
            ))}
          </div>
        </div>
      )}

      {accountModal && (
        <div className="mle-modal" onClick={() => setAccountModal(false)}>
          <div
            className="mle-modal__content"
            onClick={(event) => {
              event.stopPropagation();
            }}
          >
            <button
              type="button"
              className="mle-modal__close"
              onClick={() => setAccountModal(false)}
            >
              ✕
            </button>
            <h3 className="mle-modal__title">Espace personnel</h3>
            <p>
              Tu es identifié·e via un hash anonyme. Toutes les générations sont stockées sous forme de
              tags irrécupérables. Exporter tes paysages supprime instantanément la trace brute côté
              serveur.
            </p>
            <div className="mle-tags">
              <span className="mle-tag">Hash utilisateur : actif</span>
              <span className="mle-tag">Suppression à la demande</span>
            </div>
            <button
              type="button"
              className="mle-button"
              onClick={() => setAccountModal(false)}
            >
              Compris
            </button>
          </div>
        </div>
      )}

      {tutoModal && (
        <div className="mle-modal" onClick={() => setTutoModal(false)}>
          <div
            className="mle-modal__content"
            onClick={(event) => {
              event.stopPropagation();
            }}
          >
            <button type="button" className="mle-modal__close" onClick={() => setTutoModal(false)}>
              ✕
            </button>
            <h3 className="mle-modal__title">Tutoriel express</h3>
            <ol style={{ margin: 0, paddingLeft: "18px", lineHeight: 1.5 }}>
              <li>Choisis la clarté du paysage avec le degré projectif.</li>
              <li>Change de style (minéral, organique, spectral) selon la métaphore souhaitée.</li>
              <li>Dose l'amplitude émotionnelle pour ouvrir ou resserrer le champ.</li>
              <li>Révèle : titre, image, texte et tags sortent d'un seul geste.</li>
              <li>Partage ou conserve dans la psychothèque publique, toujours anonymisée.</li>
            </ol>
          </div>
        </div>
      )}
    </div>
  );
}
