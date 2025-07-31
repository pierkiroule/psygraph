import { useState } from "react";
import PsychographeUI from "../components/PsychographeUI";

export default function Psychographe() {
  const [inputData, setInputData] = useState({
    idea: "",
    options: {
      projection: 3,
      surprise: 3,
      ambiguity: 3,
      sensory: 3,
      emotional: 3,
      depth: 3,
      public: [],
      usage: [],
    },
    enrichedPrompt: "",
    finalPrompt: "",
    poeticText: "",
    imagePrompts: [],
    selectedImagePrompt: "",
    imageUrl: "",
    tags: [],
    guide: {},
  });

  const [step, setStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  return (
    <div style={{ padding: "2rem", maxWidth: "900px", margin: "0 auto" }}>
      <PsychographeUI
        inputData={inputData}
        setInputData={setInputData}
        step={step}
        setStep={setStep}
        loading={loading}
        setLoading={setLoading}
        error={error}
        setError={setError}
      />
      {error && (
        <div style={{ color: "red", marginTop: "1rem" }}>
          ❌ {error}
        </div>
      )}
    </div>
  );
}