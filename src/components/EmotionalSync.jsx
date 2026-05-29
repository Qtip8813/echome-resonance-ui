import React, { useMemo, useState } from 'react';

const states = ['Calm', 'Focused', 'Curious', 'Overloaded', 'Creative', 'Reflective'];

const STATE_ACCENT = {
  Calm:       'text-sky-400',
  Focused:    'text-accent',
  Curious:    'text-amber-400',
  Overloaded: 'text-red-400',
  Creative:   'text-violet-400',
  Reflective: 'text-emerald-400',
};

const inputCls =
  'w-full bg-surface border border-border rounded-md px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-accent/50 focus:border-accent/50 transition-colors';

function EmotionalSync() {
  const [userState, setUserState] = useState('Focused');
  const [systemState, setSystemState] = useState('Calm');
  const [resonance, setResonance] = useState(0.425);

  const coherence = useMemo(() => {
    const sync = 1 - Math.abs(resonance - 0.425);
    return Math.max(0, Math.min(1, sync)).toFixed(3);
  }, [resonance]);

  const coherenceNum = parseFloat(coherence);
  const coherencePct = Math.round(coherenceNum * 100);

  // Color the coherence score by quality
  const coherenceColor =
    coherenceNum >= 0.8 ? 'text-emerald-400' :
    coherenceNum >= 0.5 ? 'text-accent' :
    'text-red-400';

  return (
    <div className="border border-border rounded-xl bg-card overflow-hidden">
      {/* Header */}
      <div className="px-4 py-3 border-b border-border bg-surface flex items-center justify-between">
        <div>
          <h2 className="text-xs font-semibold text-muted uppercase tracking-widest">emotionalSync</h2>
          <p className="text-[11px] text-muted/60 mt-0.5">Resonance-aligned coherence layer</p>
        </div>
        <div className="text-right">
          <div className="text-[10px] text-muted uppercase tracking-widest mb-0.5">Coherence</div>
          <div className={`text-2xl font-black font-mono ${coherenceColor}`}>{coherence}</div>
        </div>
      </div>

      <div className="p-4 space-y-5">
        {/* State selectors */}
        <div className="grid grid-cols-2 gap-3">
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium text-muted">User State</label>
            <select
              value={userState}
              onChange={(e) => setUserState(e.target.value)}
              className={inputCls}
            >
              {states.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
            <div className={`text-xs font-semibold ${STATE_ACCENT[userState]}`}>{userState}</div>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium text-muted">System State</label>
            <select
              value={systemState}
              onChange={(e) => setSystemState(e.target.value)}
              className={inputCls}
            >
              {states.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
            <div className={`text-xs font-semibold ${STATE_ACCENT[systemState]}`}>{systemState}</div>
          </div>
        </div>

        {/* Resonance slider */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-muted">Entanglement Signature</span>
            <span className="text-xs font-mono text-foreground">{resonance.toFixed(3)}</span>
          </div>

          <input
            type="range"
            min="0"
            max="1"
            step="0.001"
            value={resonance}
            onChange={(e) => setResonance(Number(e.target.value))}
            className="w-full accent-[var(--color-accent)] cursor-pointer"
            aria-label="Entanglement Signature"
          />

          <div className="flex justify-between text-[10px] text-muted">
            <span>0.000</span>
            <span>Optimal: 0.425</span>
            <span>1.000</span>
          </div>
        </div>

        {/* Coherence bar */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between text-xs">
            <span className="text-muted">Synchronization Quality</span>
            <span className={`font-mono font-semibold ${coherenceColor}`}>{coherencePct}%</span>
          </div>
          <div className="h-1.5 w-full rounded-full bg-border overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-500 ${
                coherenceNum >= 0.8 ? 'bg-emerald-400' :
                coherenceNum >= 0.5 ? 'bg-accent' :
                'bg-red-400'
              }`}
              style={{ width: `${coherencePct}%` }}
            />
          </div>
        </div>

        {/* Output description */}
        <div className="rounded-lg border border-accent/20 bg-accent/5 p-3">
          <div className="text-[10px] uppercase tracking-widest text-accent mb-1.5 font-semibold">
            Sync Output
          </div>
          <p className="text-xs text-muted leading-relaxed">
            emotionalSync maps resonance between the user and system, preserving agency while
            adapting cadence, tone, pacing, and contextual weighting.
          </p>
        </div>

        {/* State delta */}
        <div className="flex items-center gap-2 text-xs">
          <span className={`font-semibold ${STATE_ACCENT[userState]}`}>{userState}</span>
          <svg width="14" height="8" viewBox="0 0 14 8" fill="none" aria-hidden="true">
            <path d="M1 4h12M9 1l3 3-3 3" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" className="text-border" />
          </svg>
          <span className={`font-semibold ${STATE_ACCENT[systemState]}`}>{systemState}</span>
          <span className="ml-auto text-muted font-mono">{resonance.toFixed(3)}</span>
        </div>
      </div>
    </div>
  );
}

export default EmotionalSync;
