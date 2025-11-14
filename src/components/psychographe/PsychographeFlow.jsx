import { useEffect, useMemo, useState } from "react";
import Intro from "./Intro";
import Capture from "./Capture";
import Sliders from "./Sliders";
import Styles from "./Styles";
import Projection from "./Projection";
import Result from "./Result";
import CocreationPanel from "./CocreationPanel";
import { INITIAL_PSYCHOGRAPHE, STEP_LABELS, STORAGE_KEY } from "./constants";
import { projectiveEngine } from "../../lib/projectiveEngine";
import { useCocreation } from "../../hooks/useCocreation";

const cloneInitial = () => JSON.parse(JSON.stringify(INITIAL_PSYCHOGRAPHE));

const loadInitial = () => {
  if (typeof window === "undefined") return cloneInitial();
  try {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (!stored) return cloneInitial();
    return { ...cloneInitial(), ...JSON.parse(stored) };
  } catch {
    return cloneInitial();
  }
};

const freshOutput = () => ({ ...INITIAL_PSYCHOGRAPHE.output });

const escapeHtml = (value) =>
  (value || "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
export default function PsychographeFlow() {
  const [step, setStep] = useState(0);
  const [data, setData] = useState(loadInitial);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState("");
  const [showCocreation, setShowCocreation] = useState(false);
  const sessionId = useMemo(() => {
    const hasCrypto =
      typeof globalThis !== "undefined" &&
      globalThis.crypto &&
      typeof globalThis.crypto.randomUUID === "function";
    return hasCrypto ? globalThis.crypto.randomUUID() : `session-${Date.now()}`;
  }, []);

  const { room, contributions, link, createRoom, joinRoom, leaveRoom, addContribution, ready } =
    useCocreation(sessionId);

  useEffect(() => {
    if (typeof window === "undefined") return;
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  }, [data]);

  useEffect(() => {
    if (!ready || room || typeof window === "undefined") return;
    const params = new URLSearchParams(window.location.search);
    const code = params.get("psy");
    if (code) {
      const ok = joinRoom(code);
      if (ok) setShowCocreation(true);
    }
  }, [joinRoom, ready, room]);

  const updateInputs = (patch) =>
    setData((prev) => ({ ...prev, inputs: { ...prev.inputs, ...patch }, output: freshOutput() }));

  const updateSliders = (patch) =>
    setData((prev) => ({ ...prev, sliders: { ...prev.sliders, ...patch }, output: freshOutput() }));

  const updateStyles = (patch) =>
    setData((prev) => ({ ...prev, styles: { ...prev.styles, ...patch }, output: freshOutput() }));

  const resetAll = () => {
    setData(cloneInitial());
    setStep(0);
    setError("");
  };

  const exportHtml = () => {
    const imageBlock = data.output.image_url
      ? `<img src="${data.output.image_url}" alt="Psychographe" style="max-width:100%; border-radius:24px; margin:24px 0;" />`
      : "";
      const html = `<!doctype html><html lang="fr"><meta charset="utf-8"/><title>Psychographe</title><body style="font-family: 'Space Grotesk', sans-serif; background:#0f182c; color:#f8f9ff; padding:40px;">
      <h1>Psychographe</h1>
      <p><strong>Mot-clé:</strong> ${data.inputs.keyword || "-"}</p>
      <p><strong>Sensation:</strong> ${data.inputs.sensation || "-"}</p>
      ${imageBlock}
      <h2>Texte hypnopoétique</h2>
        <pre style="white-space:pre-wrap; background:#111a30; padding:16px; border-radius:16px;">${escapeHtml(
          data.output.text
        )}</pre>
      <h2>Guide</h2>
        <pre style="white-space:pre-wrap; background:#111a30; padding:16px; border-radius:16px;">${escapeHtml(
          data.output.guide
        )}</pre>
      <p><strong>Tags:</strong> ${(data.output.tags || []).join(", ")}</p>
    </body></html>`;
    const blob = new Blob([html], { type: "text/html;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const linkEl = document.createElement("a");
    linkEl.href = url;
    linkEl.download = "psychographe.html";
    linkEl.click();
    URL.revokeObjectURL(url);
  };

  const exportPng = () => {
    const canvas = document.createElement("canvas");
    canvas.width = 960;
    canvas.height = 540;
    const ctx = canvas.getContext("2d");
    const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
    gradient.addColorStop(0, "#111a30");
    gradient.addColorStop(1, "#233558");
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "rgba(255,255,255,0.2)";
    ctx.beginPath();
    ctx.arc(720, 140, 120, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = "#f7fbff";
    ctx.font = "32px 'Space Grotesk', sans-serif";
    ctx.fillText(data.inputs.keyword || "Psychographe", 60, 80);
    ctx.font = "20px 'Space Grotesk', sans-serif";
    ctx.fillText(data.inputs.sensation || "", 60, 120);
    ctx.font = "18px 'Space Grotesk', sans-serif";
    const text = data.output.text || "";
    const lines = text.split("\n");
    lines.forEach((line, idx) => {
      ctx.fillText(line, 60, 180 + idx * 28);
    });
    const finalize = () => {
      canvas.toBlob((blob) => {
        if (!blob) return;
        const url = URL.createObjectURL(blob);
        const linkEl = document.createElement("a");
        linkEl.href = url;
        linkEl.download = "psychographe.png";
        linkEl.click();
        URL.revokeObjectURL(url);
      });
    };
    if (data.output.image_url) {
      const img = new Image();
      img.crossOrigin = "anonymous";
      img.onload = () => {
        ctx.drawImage(img, 540, 220, 360, 240);
        finalize();
      };
      img.onerror = finalize;
      img.src = data.output.image_url;
    } else {
      finalize();
    }
  };

  const generate = async () => {
    setIsGenerating(true);
    setError("");
    setStep(4);
    try {
      const output = await projectiveEngine({
        inputs: data.inputs,
        sliders: data.sliders,
        styles: data.styles,
        contributions,
      });
      setData((prev) => ({ ...prev, output }));
      setStep(5);
    } catch (err) {
      setError(err.message || "Impossible de générer.");
      setStep(3);
    } finally {
      setIsGenerating(false);
    }
  };

  const screens = [
    <Intro onStart={() => setStep(1)} />,
    <Capture data={data.inputs} update={updateInputs} next={() => setStep(2)} />,
    <Sliders sliders={data.sliders} update={updateSliders} next={() => setStep(3)} back={() => setStep(1)} />,
    <Styles
      styles={data.styles}
      update={updateStyles}
      back={() => setStep(2)}
      generate={generate}
      loading={isGenerating}
    />,
    <Projection />,
    <Result
      data={data}
      onExportHtml={exportHtml}
      onExportPng={exportPng}
      onCocreate={() => setShowCocreation(true)}
      onRegenerate={generate}
      onReset={resetAll}
      loading={isGenerating}
    />,
  ];

  return (
    <div className="psychographe-flow">
      <ol className="stepper">
        {STEP_LABELS.map((label, index) => (
          <li key={label} className={index === step ? "active" : index < step ? "done" : ""}>
            <span>{label}</span>
          </li>
        ))}
      </ol>
      {screens[step]}
      {error && <p className="psy-error">{error}</p>}
      {showCocreation && (
        <CocreationPanel
          room={room}
          contributions={contributions}
          link={link}
          createRoom={createRoom}
          joinRoom={joinRoom}
          leaveRoom={leaveRoom}
          addContribution={addContribution}
          close={() => setShowCocreation(false)}
        />
      )}
    </div>
  );
}
