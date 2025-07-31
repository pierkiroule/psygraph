// src/components/PsychographeUI.jsx
import StepIdea from "./steps/StepIdea";
import StepPrompt from "./steps/StepPrompt";
import StepResult from "./steps/StepResult";

export default function PsychographeUI({
  inputData,
  setInputData,
  step,
  setStep,
  loading,
  setLoading,
  error,
  setError,
}) {
  // Nettoyage automatique des erreurs réseau
  const safeSetError = (msg) => {
    if (typeof msg === "string" && !msg.startsWith("<!DOCTYPE")) {
      setError(msg);
    } else {
      setError("Erreur réseau/API : réponse invalide du serveur.");
    }
  };

  if (step === 0) {
    return (
      <StepIdea
        inputData={inputData}
        setInputData={setInputData}
        setStep={setStep}
        loading={loading}
        setLoading={setLoading}
        setError={safeSetError}
      />
    );
  }
  if (step === 1) {
    return (
      <StepPrompt
        inputData={inputData}
        setInputData={setInputData}
        setStep={setStep}
        loading={loading}
        setLoading={setLoading}
        setError={safeSetError}
      />
    );
  }
  return (
    <StepResult
      inputData={inputData}
      setInputData={setInputData}
      setStep={setStep}
      loading={loading}
      setLoading={setLoading}
      setError={safeSetError}
    />
  );
}