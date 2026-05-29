import React, { useState, useEffect } from 'react';

const models = ['ChatGPT-4', 'Claude-3', 'Gemini-Pro'];

const MODEL_COLORS = {
  'ChatGPT-4': 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
  'Claude-3':  'bg-orange-500/20 text-orange-400 border-orange-500/30',
  'Gemini-Pro':'bg-sky-500/20 text-sky-400 border-sky-500/30',
};

const MODEL_DOT = {
  'ChatGPT-4': 'bg-emerald-400',
  'Claude-3':  'bg-orange-400',
  'Gemini-Pro':'bg-sky-400',
};

function Section({ title, children }) {
  return (
    <section className="border border-border rounded-xl bg-card overflow-hidden">
      <div className="px-4 py-3 border-b border-border bg-surface">
        <h3 className="text-xs font-semibold text-muted uppercase tracking-widest">{title}</h3>
      </div>
      <div className="p-4">{children}</div>
    </section>
  );
}

function Field({ label, children }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-xs font-medium text-muted">{label}</label>
      {children}
    </div>
  );
}

const inputCls =
  'w-full bg-surface border border-border rounded-md px-3 py-2 text-sm text-foreground placeholder:text-muted/50 focus:outline-none focus:ring-1 focus:ring-accent/50 focus:border-accent/50 transition-colors';

function ConversationHub() {
  const [selectedModel, setSelectedModel] = useState(models[0]);
  const [conversationType, setConversationType] = useState('');
  const [topic, setTopic] = useState('');
  const [numRounds, setNumRounds] = useState(5);
  const [participantOrder, setParticipantOrder] = useState('ChatGPT-4, Claude-3, Gemini-Pro');
  const [running, setRunning] = useState(false);
  const [completedRounds, setCompletedRounds] = useState(0);
  const [history, setHistory] = useState([]);
  const [metrics, setMetrics] = useState({
    'ChatGPT-4': { times: [], success: 0 },
    'Claude-3':  { times: [], success: 0 },
    'Gemini-Pro':{ times: [], success: 0 },
  });
  const [context, setContext] = useState('');

  useEffect(() => {
    let interval;
    if (running && completedRounds < numRounds) {
      interval = setInterval(() => { runRound(); }, 1000);
    } else if (completedRounds >= numRounds) {
      setRunning(false);
    }
    return () => clearInterval(interval);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [running, completedRounds, numRounds]);

  const runRound = () => {
    const order = participantOrder.split(',').map((s) => s.trim());
    const model = order[completedRounds % order.length] || selectedModel;
    const time = Math.floor(Math.random() * 1000) + 500;
    const success = Math.random() > 0.2;
    const entry = { round: completedRounds + 1, model, time, success, context };
    setHistory((h) => [...h, entry]);
    setMetrics((m) => {
      const next = { ...m };
      const data = next[model] || { times: [], success: 0 };
      data.times = [...data.times, time];
      data.success = (data.success * (data.times.length - 1) + (success ? 1 : 0)) / data.times.length;
      next[model] = data;
      return next;
    });
    setCompletedRounds((r) => r + 1);
  };

  const start = () => setRunning(true);
  const pause = () => setRunning(false);
  const reset = () => {
    setRunning(false);
    setCompletedRounds(0);
    setHistory([]);
    setMetrics({
      'ChatGPT-4': { times: [], success: 0 },
      'Claude-3':  { times: [], success: 0 },
      'Gemini-Pro':{ times: [], success: 0 },
    });
  };

  const injectContext = () => {
    if (!context.trim()) return;
    setHistory((h) => [...h, { round: 'ctx', model: 'system', message: context }]);
    setContext('');
  };

  const download = (url, filename) => {
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  };

  const exportJSON = () => {
    const blob = new Blob([JSON.stringify(history, null, 2)], { type: 'application/json' });
    download(URL.createObjectURL(blob), 'conversation.json');
  };

  const exportCSV = () => {
    const header = 'round,model,time,success,context';
    const rows = history.map((h) => `${h.round},${h.model},${h.time},${h.success},${h.context || ''}`);
    const blob = new Blob([header + '\n' + rows.join('\n')], { type: 'text/csv' });
    download(URL.createObjectURL(blob), 'conversation.csv');
  };

  const exportPDF = () => {
    const text = history.map((h) => JSON.stringify(h)).join('\n');
    const blob = new Blob([text], { type: 'application/pdf' });
    download(URL.createObjectURL(blob), 'conversation.pdf');
  };

  const avg = (times) =>
    times.length ? (times.reduce((a, b) => a + b, 0) / times.length).toFixed(0) : '—';

  const progress = numRounds > 0 ? Math.min((completedRounds / numRounds) * 100, 100) : 0;

  return (
    <div className="space-y-4">
      {/* Configuration */}
      <Section title="Configuration">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Field label="AI Model">
            <select
              className={inputCls}
              value={selectedModel}
              onChange={(e) => setSelectedModel(e.target.value)}
            >
              {models.map((m) => (
                <option key={m} value={m}>{m}</option>
              ))}
            </select>
          </Field>

          <Field label="Conversation Type">
            <input
              className={inputCls}
              placeholder="e.g. debate, brainstorm…"
              value={conversationType}
              onChange={(e) => setConversationType(e.target.value)}
            />
          </Field>

          <Field label="Topic">
            <input
              className={inputCls}
              placeholder="Enter a topic…"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
            />
          </Field>

          <Field label="Number of Rounds">
            <input
              type="number"
              min="1"
              className={inputCls}
              value={numRounds}
              onChange={(e) => setNumRounds(Number(e.target.value))}
            />
          </Field>

          <Field label="Participant Order (comma-separated)" >
            <div className="sm:col-span-2">
              <input
                className={inputCls}
                value={participantOrder}
                onChange={(e) => setParticipantOrder(e.target.value)}
              />
            </div>
          </Field>
        </div>
      </Section>

      {/* Controls + Progress */}
      <Section title="Session Controls">
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-3 flex-wrap">
            <button
              onClick={start}
              disabled={running}
              className="flex items-center gap-2 px-4 py-2 rounded-md bg-accent text-black text-sm font-semibold disabled:opacity-40 hover:bg-accent/90 transition-colors"
            >
              {/* Play icon */}
              <svg width="12" height="12" viewBox="0 0 12 12" fill="currentColor" aria-hidden="true">
                <path d="M2 1.5l8 4.5-8 4.5V1.5z" />
              </svg>
              Start
            </button>

            <button
              onClick={pause}
              disabled={!running}
              className="flex items-center gap-2 px-4 py-2 rounded-md border border-border text-sm text-foreground disabled:opacity-40 hover:bg-card transition-colors"
            >
              {/* Pause icon */}
              <svg width="12" height="12" viewBox="0 0 12 12" fill="currentColor" aria-hidden="true">
                <rect x="2" y="1" width="3" height="10" rx="1" />
                <rect x="7" y="1" width="3" height="10" rx="1" />
              </svg>
              Pause
            </button>

            <button
              onClick={reset}
              className="flex items-center gap-2 px-4 py-2 rounded-md border border-border text-sm text-foreground hover:bg-card transition-colors"
            >
              {/* Reset icon */}
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
                <path d="M10 6A4 4 0 1 1 6 2" strokeLinecap="round" />
                <path d="M6 0l2 2-2 2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              Reset
            </button>

            <div className="ml-auto flex items-center gap-2 text-sm">
              <span className="text-muted">Round</span>
              <span className="font-mono text-foreground font-semibold">
                {completedRounds} / {numRounds}
              </span>
            </div>
          </div>

          {/* Progress bar */}
          <div className="h-1.5 w-full rounded-full bg-border overflow-hidden">
            <div
              className="h-full rounded-full bg-accent transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      </Section>

      {/* Metrics */}
      <Section title="Model Metrics">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {models.map((m) => (
            <div key={m} className="rounded-lg border border-border bg-surface p-3 flex flex-col gap-2">
              <div className="flex items-center gap-2">
                <span className={`w-2 h-2 rounded-full ${MODEL_DOT[m]}`} />
                <span className="text-xs font-semibold text-foreground">{m}</span>
              </div>
              <div className="flex flex-col gap-1">
                <div className="flex justify-between text-xs">
                  <span className="text-muted">Avg Response</span>
                  <span className="font-mono text-foreground">{avg(metrics[m].times)} ms</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-muted">Success Rate</span>
                  <span className="font-mono text-foreground">
                    {metrics[m].times.length ? `${(metrics[m].success * 100).toFixed(0)}%` : '—'}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </Section>

      {/* Conversation Log */}
      {history.length > 0 && (
        <Section title="Conversation Log">
          <div className="max-h-64 overflow-y-auto space-y-1 font-mono text-xs">
            {history.map((h, i) => (
              <div
                key={i}
                className={`flex items-start gap-3 px-3 py-2 rounded-md ${
                  h.model === 'system'
                    ? 'bg-accent/5 border border-accent/20'
                    : h.success === false
                    ? 'bg-red-500/5 border border-red-500/20'
                    : 'bg-surface'
                }`}
              >
                <span className="text-muted shrink-0 w-8 text-right">
                  {h.model === 'system' ? 'ctx' : `#${h.round}`}
                </span>
                {h.model !== 'system' ? (
                  <>
                    <span className={`shrink-0 px-1.5 py-0.5 rounded border text-[10px] font-semibold ${MODEL_COLORS[h.model] || 'bg-muted/20 text-muted border-border'}`}>
                      {h.model}
                    </span>
                    <span className="text-muted">{h.time}ms</span>
                    <span className={h.success ? 'text-emerald-400' : 'text-red-400'}>
                      {h.success ? 'ok' : 'fail'}
                    </span>
                  </>
                ) : (
                  <span className="text-accent">{h.message}</span>
                )}
              </div>
            ))}
          </div>
        </Section>
      )}

      {/* Context Injection */}
      <Section title="Inject Context">
        <div className="flex gap-2">
          <textarea
            rows={3}
            className={`${inputCls} resize-none flex-1`}
            placeholder="Type context to inject into the next round…"
            value={context}
            onChange={(e) => setContext(e.target.value)}
          />
          <button
            onClick={injectContext}
            className="px-4 py-2 rounded-md bg-card border border-border text-sm text-foreground hover:border-accent/50 transition-colors self-start"
          >
            Inject
          </button>
        </div>
      </Section>

      {/* Exports */}
      <section className="flex items-center gap-2 flex-wrap">
        <span className="text-xs text-muted mr-1">Export as:</span>
        {[['JSON', exportJSON], ['CSV', exportCSV], ['PDF', exportPDF]].map(([label, fn]) => (
          <button
            key={label}
            onClick={fn}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-md border border-border text-xs text-muted hover:text-foreground hover:border-accent/40 transition-colors font-mono"
          >
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
              <path d="M6 1v7M3.5 5.5L6 8l2.5-2.5" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M1 9v1a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1V9" strokeLinecap="round" />
            </svg>
            {label}
          </button>
        ))}
      </section>
    </div>
  );
}

export default ConversationHub;
