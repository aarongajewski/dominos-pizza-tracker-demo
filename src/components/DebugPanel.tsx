import { TRACKER_STEPS } from "../lib/tracker";
import type { Screen, TrackerStatus } from "../types";

interface DebugPanelProps {
  screen: Screen;
  status: TrackerStatus;
  autoAdvance: boolean;
  onClose: () => void;
  onReset: () => void;
  onLoadCanned: () => void;
  onSetStatus: (status: TrackerStatus) => void;
  onGoto: (screen: Screen) => void;
  onToggleAutoAdvance: () => void;
}

export function DebugPanel({
  screen,
  status,
  autoAdvance,
  onClose,
  onReset,
  onLoadCanned,
  onSetStatus,
  onGoto,
  onToggleAutoAdvance,
}: DebugPanelProps) {
  return (
    <div className="debug-overlay" role="dialog" aria-label="Debug panel">
      <div className="debug-panel">
        <div className="debug-head">
          <h2>Demo controls</h2>
          <button className="icon-btn" onClick={onClose} aria-label="Close">
            ✕
          </button>
        </div>

        <p className="muted small">
          Quick controls for driving the live demo. Nothing here hits a server.
        </p>

        <div className="debug-section">
          <span className="debug-label">Reset</span>
          <button className="btn btn-outline btn-block" onClick={onReset}>
            ♻︎ Reset demo (fresh menu)
          </button>
          <button className="btn btn-outline btn-block" onClick={onLoadCanned}>
            ⚡ Load canned order → tracker
          </button>
        </div>

        <div className="debug-section">
          <span className="debug-label">Jump to screen</span>
          <div className="chip-row">
            {(["menu", "checkout", "tracker"] as Screen[]).map((s) => (
              <button
                key={s}
                className={`chip ${screen === s ? "chip-active" : ""}`}
                onClick={() => onGoto(s)}
              >
                {s}
              </button>
            ))}
          </div>
        </div>

        <div className="debug-section">
          <span className="debug-label">Set tracker status</span>
          <div className="chip-row chip-row-wrap">
            {TRACKER_STEPS.map((step) => (
              <button
                key={step.status}
                className={`chip ${status === step.status ? "chip-active" : ""}`}
                onClick={() => onSetStatus(step.status)}
              >
                {step.label}
              </button>
            ))}
          </div>
        </div>

        <div className="debug-section">
          <label className="switch">
            <input type="checkbox" checked={autoAdvance} onChange={onToggleAutoAdvance} />
            <span className="switch-track" aria-hidden />
            <span className="switch-label">Auto-advance every 6s</span>
          </label>
        </div>
      </div>
    </div>
  );
}
