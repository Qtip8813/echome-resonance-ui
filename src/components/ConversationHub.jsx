import React, { useState, useEffect } from 'react';

const models = ['ChatGPT-4', 'Claude-3', 'Gemini-Pro'];

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
    'Claude-3': { times: [], success: 0 },
    'Gemini-Pro': { times: [], success: 0 },
  });
  const [context, setContext] = useState('');

  useEffect(() => {
    let interval;
    if (running && completedRounds < numRounds) {
      interval = setInterval(() => {
        runRound();
      }, 1000);
    } else if (completedRounds >= numRounds) {
      setRunning(false);
    }
    return () => clearInterval(interval);
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
      'Claude-3': { times: [], success: 0 },
      'Gemini-Pro': { times: [], success: 0 },
    });
  };

  const injectContext = () => {
    setHistory((h) => [...h, { round: 'context', model: 'inject', message: context }]);
    setContext('');
  };

  const exportJSON = () => {
    const blob = new Blob([JSON.stringify(history, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    download(url, 'conversation.json');
  };

  const exportCSV = () => {
    const header = 'round,model,time,success,context';
    const rows = history.map((h) => `${h.round},${h.model},${h.time},${h.success},${h.context || ''}`);
    const blob = new Blob([header + '\n' + rows.join('\n')], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    download(url, 'conversation.csv');
  };

  const exportPDF = () => {
    const text = history.map((h) => JSON.stringify(h)).join('\n');
    const blob = new Blob([text], { type: 'application/pdf' });
    const url = URL.createObjectURL(blob);
    download(url, 'conversation.pdf');
  };

  const download = (url, filename) => {
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  };

  const averageTime = (times) => {
    if (!times.length) return 0;
    return (times.reduce((a, b) => a + b, 0) / times.length).toFixed(0);
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block mb-1 font-semibold">AI Model</label>
          <select
            className="w-full p-2 border rounded"
            value={selectedModel}
            onChange={(e) => setSelectedModel(e.target.value)}
          >
            {models.map((m) => (
              <option key={m} value={m}>
                {m}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block mb-1 font-semibold">Conversation Type</label>
          <input
            className="w-full p-2 border rounded"
            value={conversationType}
            onChange={(e) => setConversationType(e.target.value)}
          />
        </div>
        <div>
          <label className="block mb-1 font-semibold">Topic</label>
          <input
            className="w-full p-2 border rounded"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
          />
        </div>
        <div>
          <label className="block mb-1 font-semibold">Number of Rounds</label>
          <input
            type="number"
            className="w-full p-2 border rounded"
            value={numRounds}
            onChange={(e) => setNumRounds(Number(e.target.value))}
          />
        </div>
        <div className="md:col-span-2">
          <label className="block mb-1 font-semibold">Participant Order (comma separated)</label>
          <input
            className="w-full p-2 border rounded"
            value={participantOrder}
            onChange={(e) => setParticipantOrder(e.target.value)}
          />
        </div>
      </div>

      <div className="flex items-center space-x-4">
        <button className="px-4 py-2 bg-green-500 text-white rounded" onClick={start} disabled={running}>
          Start
        </button>
        <button className="px-4 py-2 bg-yellow-500 text-white rounded" onClick={pause} disabled={!running}>
          Pause
        </button>
        <button className="px-4 py-2 bg-red-500 text-white rounded" onClick={reset}>
          Reset
        </button>
        <span>Rounds Completed: {completedRounds}</span>
      </div>

      <div className="space-y-2">
        <h2 className="text-xl font-semibold">Metrics</h2>
        {models.map((m) => (
          <div key={m} className="p-2 border rounded">
            <div className="font-semibold">{m}</div>
            <div>Avg Response Time: {averageTime(metrics[m].times)} ms</div>
            <div>Success Rate: {(metrics[m].success * 100).toFixed(0)}%</div>
          </div>
        ))}
      </div>

      <div className="space-y-2">
        <h2 className="text-xl font-semibold">Inject Context</h2>
        <textarea
          className="w-full p-2 border rounded"
          value={context}
          onChange={(e) => setContext(e.target.value)}
        />
        <button className="px-4 py-2 bg-blue-500 text-white rounded" onClick={injectContext}>
          Inject
        </button>
      </div>

      <div className="space-x-4">
        <button className="px-4 py-2 bg-gray-800 text-white rounded" onClick={exportJSON}>
          Export JSON
        </button>
        <button className="px-4 py-2 bg-gray-800 text-white rounded" onClick={exportCSV}>
          Export CSV
        </button>
        <button className="px-4 py-2 bg-gray-800 text-white rounded" onClick={exportPDF}>
          Export PDF
        </button>
      </div>
    </div>
  );
}

export default ConversationHub;
