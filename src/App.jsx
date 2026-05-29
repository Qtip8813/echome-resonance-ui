import { useState } from 'react';
import ConversationHub from './components/ConversationHub';
import EmotionalSync from './components/EmotionalSync';

function App() {
  const [pro] = useState(false);
  const [exportsUsed] = useState(0);

  const handlePro = () => {
    window.open('https://buy.stripe.com/00weVd16be835Cr57Q8Zq00', '_blank');
  };

  return (
    <div className="min-h-screen bg-surface font-sans">
      {/* Top nav */}
      <header className="border-b border-border px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          {/* Logo mark */}
          <div className="w-6 h-6 rounded bg-accent flex items-center justify-center">
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
              <circle cx="7" cy="7" r="5" stroke="black" strokeWidth="2" />
              <circle cx="7" cy="7" r="2" fill="black" />
            </svg>
          </div>
          <span className="text-sm font-semibold text-foreground tracking-tight">EchoMe</span>
          <span className="text-border">/</span>
          <span className="text-sm text-muted">Resonance</span>
        </div>

        <div className="flex items-center gap-3">
          {/* Status pill */}
          <div className="flex items-center gap-2 px-3 py-1 rounded-full border border-accent/30 bg-accent/5">
            <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
            <span className="text-xs text-accent font-mono tracking-widest uppercase">emotionalSync</span>
          </div>

          {!pro && (
            <button
              onClick={handlePro}
              className="text-xs font-semibold px-3 py-1.5 rounded-md bg-accent text-black hover:bg-accent/90 transition-colors"
            >
              Upgrade to Pro
            </button>
          )}
        </div>
      </header>

      {/* Page header */}
      <div className="border-b border-border px-6 py-6">
        <h1 className="text-xl font-semibold text-foreground">Conversation Orchestration</h1>
        <p className="text-sm text-muted mt-1 max-w-xl leading-relaxed">
          QRFT-inspired coherence across multi-model AI sessions with contextual memory weighting
          and adaptive emotional synchronization.
        </p>
      </div>

      {/* Main content */}
      <main className="px-6 py-6">
        {exportsUsed < 3 || pro ? (
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 items-start">
            <div className="xl:col-span-2">
              <ConversationHub />
            </div>
            <div>
              <EmotionalSync />
            </div>
          </div>
        ) : (
          /* Paywall */
          <div className="flex flex-col items-center justify-center min-h-[400px] border border-border rounded-xl p-12 bg-card">
            <div className="w-10 h-10 rounded-full border border-border flex items-center justify-center mb-6">
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
                <rect x="4" y="8" width="10" height="8" rx="1" stroke="currentColor" strokeWidth="1.5" className="text-muted" />
                <path d="M6 8V6a3 3 0 0 1 6 0v2" stroke="currentColor" strokeWidth="1.5" className="text-muted" />
              </svg>
            </div>
            <h2 className="text-lg font-semibold text-foreground mb-2">Unlimited exports with Pro</h2>
            <p className="text-sm text-muted mb-6 text-center max-w-sm leading-relaxed">
              You&apos;ve used your 3 free exports. Upgrade to Pro for unlimited conversation exports
              and advanced resonance features.
            </p>
            <button
              onClick={handlePro}
              className="px-6 py-2.5 bg-accent text-black text-sm font-semibold rounded-md hover:bg-accent/90 transition-colors"
            >
              Unlock Pro — $9.99 / mo
            </button>
            <p className="text-xs text-muted mt-3">Cancel anytime</p>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-border px-6 py-4 mt-8">
        <p className="text-xs text-muted">
          © 2026 Rod&apos;s AI Consulting LLC &nbsp;·&nbsp; EchoMe &nbsp;·&nbsp; QRFT &nbsp;·&nbsp; emotionalSync
        </p>
      </footer>
    </div>
  );
}

export default App;
