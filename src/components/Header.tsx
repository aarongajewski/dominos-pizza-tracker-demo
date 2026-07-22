interface HeaderProps {
  theme: "light" | "dark";
  onToggleTheme: () => void;
  onOpenDebug: () => void;
  onHome: () => void;
}

export function Header({ theme, onToggleTheme, onOpenDebug, onHome }: HeaderProps) {
  return (
    <header className="header">
      <button className="brand" onClick={onHome} aria-label="Demo Pizza home">
        <span className="brand-mark" aria-hidden>
          <span className="brand-mark-half brand-mark-red" />
          <span className="brand-mark-half brand-mark-blue" />
        </span>
        <span className="brand-text">
          Demo Pizza <span className="brand-sub">Tracker</span>
        </span>
        <span className="demo-badge">DEMO</span>
      </button>

      <div className="header-actions">
        <button
          className="icon-btn"
          onClick={onToggleTheme}
          aria-label="Toggle dark mode"
          title="Toggle dark mode"
        >
          {theme === "light" ? "🌙" : "☀️"}
        </button>
        <button
          className="icon-btn"
          onClick={onOpenDebug}
          aria-label="Open debug panel"
          title="Debug / reset demo"
        >
          ⚙︎
        </button>
      </div>
    </header>
  );
}
