import React, { useMemo, useState } from 'react';

const states = [
  'Calm',
  'Focused',
  'Curious',
  'Overloaded',
  'Creative',
  'Reflective'
];

function EmotionalSync() {
  const [userState, setUserState] = useState('Focused');
  const [systemState, setSystemState] = useState('Calm');
  const [resonance, setResonance] = useState(0.425);

  const coherence = useMemo(() => {
    const sync = 1 - Math.abs(resonance - 0.425);
    return Math.max(0, Math.min(1, sync)).toFixed(3);
  }, [resonance]);

  return (
    <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-6 text-white shadow-2xl">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold bg-gradient-to-r from-pink-400 to-cyan-400 bg-clip-text text-transparent">
            emotionalSync
          </h2>
          <p className="text-white/60 text-sm mt-1">
            Resonance-aligned emotional coherence layer
          </p>
        </div>

        <div className="text-right">
          <div className="text-xs text-white/50 uppercase tracking-widest">Coherence</div>
          <div className="text-3xl font-black text-cyan-300">{coherence}</div>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-4 mb-6">
        <div>
          <label className="block text-sm text-white/70 mb-2">User State</label>
          <select
            value={userState}
            onChange={(e) => setUserState(e.target.value)}
            className="w-full bg-black/20 border border-white/10 rounded-xl p-3"
          >
            {states.map((state) => (
              <option key={state} value={state} className="text-black">
                {state}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm text-white/70 mb-2">System State</label>
          <select
            value={systemState}
            onChange={(e) => setSystemState(e.target.value)}
            className="w-full bg-black/20 border border-white/10 rounded-xl p-3"
          >
            {states.map((state) => (
              <option key={state} value={state} className="text-black">
                {state}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="mb-4">
        <div className="flex justify-between text-sm text-white/70 mb-2">
          <span>Entanglement Signature</span>
          <span>{resonance.toFixed(3)}</span>
        </div>

        <input
          type="range"
          min="0"
          max="1"
          step="0.001"
          value={resonance}
          onChange={(e) => setResonance(Number(e.target.value))}
          className="w-full"
        />
      </div>

      <div className="mt-6 rounded-2xl border border-cyan-500/20 bg-cyan-500/5 p-4">
        <div className="text-sm uppercase tracking-wider text-cyan-300 mb-2">
          Synchronization Output
        </div>

        <p className="text-white/80 leading-relaxed">
          emotionalSync dynamically maps emotional resonance between the user and the system,
          preserving agency while adapting cadence, tone, pacing, and contextual weighting.
        </p>
      </div>
    </div>
  );
}

export default EmotionalSync;
