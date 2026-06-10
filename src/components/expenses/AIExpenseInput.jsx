import { useRef } from "react";
import { Form, Button, Alert, Spinner } from "react-bootstrap";

/**
 * AIExpenseInput — purely presentational AI input panel.
 *
 * Receives all state and callbacks via props; contains no Redux reads,
 * no dispatch calls, and no business logic. Any component can embed it.
 */
export default function AIExpenseInput({
  rawText           = "",
  onTextChange,
  onParse,
  onScanFile,
  onToggleRecording,
  onDismissParseError,
  onDismissScanError,
  isParseLoading    = false,
  isScanLoading     = false,
  isRecording       = false,
  isVoiceSupported  = null,
  voiceError        = null,
  interimTranscript = "",
  parseError        = null,
  scanError         = null,
  scanSentence      = null,
}) {
  const fileInputRef = useRef(null);
  const isBusy = isParseLoading || isScanLoading;

  return (
    <div>
      {/* ── Text input ────────────────────────────────────────────────────── */}
      <Form.Group className="mb-2">
        <Form.Label className="fw-semibold">
          Describe the expense{" "}
          <span className="text-muted fw-normal small">
            — or use voice / scan a bill
          </span>
        </Form.Label>
        <Form.Control
          as="textarea"
          rows={3}
          value={rawText}
          onChange={(e) => onTextChange(e.target.value)}
          placeholder={`e.g. "I paid ₹1500 for dinner, split with Alice and Bob"`}
          disabled={isBusy}
        />
        {interimTranscript && (
          <p className="text-muted small mb-0 mt-1">
            🎤 <em>{interimTranscript}</em>
          </p>
        )}
      </Form.Group>

      {/* ── Toolbar ───────────────────────────────────────────────────────── */}
      <div className="d-flex flex-wrap align-items-center gap-2 mt-2">
        {/* Voice */}
        <Button
          variant={isRecording ? "danger" : "outline-secondary"}
          size="sm"
          onClick={onToggleRecording}
          disabled={isBusy || isVoiceSupported === false}
          title={
            isVoiceSupported === false
              ? "Voice not supported in this browser"
              : isRecording
              ? "Stop recording"
              : "Start voice input"
          }
        >
          {isRecording ? "⏹ Stop" : "🎤 Voice"}
        </Button>

        {/* Scan Bill */}
        <Button
          variant="outline-secondary"
          size="sm"
          onClick={() => fileInputRef.current?.click()}
          disabled={isBusy}
          title="Upload a bill image to auto-fill amount and description"
        >
          {isScanLoading ? (
            <>
              <Spinner size="sm" animation="border" className="me-1" />
              Scanning…
            </>
          ) : (
            "📷 Scan Bill"
          )}
        </Button>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp"
          style={{ display: "none" }}
          onChange={onScanFile}
        />

        {/* Parse — right-aligned */}
        <Button
          size="sm"
          className="ms-auto"
          onClick={onParse}
          disabled={isBusy || !rawText.trim()}
          style={{ backgroundColor: "#e94560", border: "none" }}
        >
          {isParseLoading ? (
            <>
              <Spinner size="sm" animation="border" className="me-1" />
              Parsing…
            </>
          ) : (
            "✨ Parse"
          )}
        </Button>
      </div>

      {/* ── Feedback ──────────────────────────────────────────────────────── */}
      {isVoiceSupported === false && (
        <Alert variant="warning" className="mt-3 py-2 small mb-0">
          Voice input is not supported in this browser. Try Chrome or Edge.
        </Alert>
      )}
      {voiceError && (
        <Alert variant="warning" className="mt-3 py-2 small mb-0">
          {voiceError}
        </Alert>
      )}
      {scanSentence && (
        <Alert variant="success" className="mt-3 py-2 small mb-0">
          📄 {scanSentence}
        </Alert>
      )}
      {parseError && (
        <Alert
          variant="danger"
          className="mt-3 py-2 small mb-0"
          dismissible
          onClose={onDismissParseError}
        >
          {parseError}
        </Alert>
      )}
      {scanError && (
        <Alert
          variant="danger"
          className="mt-3 py-2 small mb-0"
          dismissible
          onClose={onDismissScanError}
        >
          {scanError}
        </Alert>
      )}
    </div>
  );
}
