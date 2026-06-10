import { useCallback, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useVoiceInput } from "./useVoiceInput";
import {
  parseExpenseFromText,
  scanBill,
  setInputMode,
  updateField,
  toggleParticipant,
  setRawText,
  setVoiceTranscript,
  setVoiceRecording,
  setVoiceSupported,
  resetForm,
  clearParseError,
  clearScanError,
} from "../reducers/aiSlice";

/**
 * useAIExpenseOrchestration
 *
 * Encapsulates all AI and voice orchestration for the group expense form:
 *   - Redux state reads and dispatch calls
 *   - Voice input integration
 *   - File-to-base64 conversion for bill scanning
 *   - Automatic mode switching after a successful parse or scan
 *
 * Components that use this hook receive a clean, stable interface and have
 * zero AI/Redux imports of their own.
 */
export const useAIExpenseOrchestration = (groupId = null) => {
  const dispatch = useDispatch();
  const { inputMode, form, parse, scan, voice } = useSelector((s) => s.ai);

  // ── Lifecycle ──────────────────────────────────────────────────────────────
  useEffect(() => {
    dispatch(resetForm());
    dispatch(setInputMode("ai"));
    return () => dispatch(resetForm());
  }, [dispatch]);

  // ── Voice input integration ────────────────────────────────────────────────
  const handleTranscript = useCallback(
    (text) => dispatch(setVoiceTranscript(text)),
    [dispatch]
  );

  const {
    isRecording,
    isSupported,
    error: voiceError,
    interimTranscript,
    toggleRecording,
  } = useVoiceInput({ onTranscript: handleTranscript });

  // Keep Redux voice state in sync (so other consumers can read it)
  useEffect(() => {
    if (isSupported !== null) dispatch(setVoiceSupported(isSupported));
  }, [isSupported, dispatch]);

  useEffect(() => {
    dispatch(setVoiceRecording(isRecording));
  }, [isRecording, dispatch]);

  // ── Automatic mode switching ───────────────────────────────────────────────
  useEffect(() => {
    if (!parse.loading && !parse.error && form.amount && inputMode !== "manual") {
      dispatch(setInputMode("manual"));
    }
  }, [parse.loading, parse.error, form.amount, inputMode, dispatch]);

  useEffect(() => {
    if (!scan.loading && scan.sentence && inputMode !== "manual") {
      dispatch(setInputMode("manual"));
    }
  }, [scan.loading, scan.sentence, inputMode, dispatch]);

  // ── Action handlers ────────────────────────────────────────────────────────

  const switchMode = useCallback(
    (mode) => dispatch(setInputMode(mode)),
    [dispatch]
  );

  const handleRawTextChange = useCallback(
    (text) => dispatch(setRawText(text)),
    [dispatch]
  );

  const handleParse = useCallback(() => {
    const text = parse.rawText.trim();
    if (!text) return;
    dispatch(clearParseError());
    dispatch(parseExpenseFromText({ text, groupId }));
  }, [dispatch, parse.rawText, groupId]);

  const handleScanFile = useCallback(
    (e) => {
      const file = e.target.files?.[0];
      if (!file) return;
      dispatch(clearScanError());
      const reader = new FileReader();
      reader.onload = () => {
        const base64 = reader.result.split(",")[1];
        dispatch(scanBill({ image: base64, mimeType: file.type || "image/jpeg" }));
      };
      reader.readAsDataURL(file);
      e.target.value = ""; // allow re-selecting the same file
    },
    [dispatch]
  );

  const handleFieldChange = useCallback(
    (field, value) => dispatch(updateField({ field, value })),
    [dispatch]
  );

  const handleToggleParticipant = useCallback(
    (userId) => dispatch(toggleParticipant(userId)),
    [dispatch]
  );

  const handleReset = useCallback(() => {
    dispatch(resetForm());
    dispatch(setInputMode("ai"));
  }, [dispatch]);

  const dismissParseError = useCallback(() => dispatch(clearParseError()), [dispatch]);
  const dismissScanError  = useCallback(() => dispatch(clearScanError()),  [dispatch]);

  // ── Exposed interface ──────────────────────────────────────────────────────
  return {
    inputMode,
    form,
    parse,
    scan,
    voice: {
      ...voice,
      isRecording,
      isSupported,
      error: voiceError,
      interimTranscript,
    },

    switchMode,
    handleRawTextChange,
    handleParse,
    handleScanFile,
    toggleRecording,
    handleFieldChange,
    handleToggleParticipant,
    handleReset,
    dismissParseError,
    dismissScanError,
  };
};
