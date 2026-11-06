import React, { useMemo, useState } from "react";
import {
  createConversationContext,
  decodeContext,
  encodeContext,
} from "../lib/qrsp-hcm";

export default function HarmonicContextMemory({
  history = [],
  topic = "",
  conversationType = "",
  participantOrder = "",
  extraContext = "",
}) {
  const [envelope, setEnvelope] = useState(null);
  const [status, setStatus] = useState("");
  const [restored, setRestored] = useState(null);
  const [busy, setBusy] = useState(false);

  const context = useMemo(() => createConversationContext({
    history,
    topic,
    conversationType,
    participantOrder: participantOrder.split(",").map((item) => item.trim()).filter(Boolean),
    extraContext,
  }), [history, topic, conversationType, participantOrder, extraContext]);

  const handleEncode = async () => {
    setBusy(true);
    setStatus("");
    try {
      const result = await encodeContext(context);
      setEnvelope(result);
      setRestored(null);
      setStatus("Context encoded and SHA-256 verified at creation.");
    } catch (error) {
      setStatus(error.message || "Unable to encode context.");
    } finally {
      setBusy(false);
    }
  };

  const handleDecode = async () => {
    if (!envelope) return;
    setBusy(true);
    setStatus("");
    try {
      const result = await decodeContext(envelope);
      setRestored(result);
      setStatus("Context decoded successfully. Integrity check passed.");
    } catch (error) {
      setStatus(error.message || "Unable to decode context.");
    } finally {
      setBusy(false);
    }
  };

  const downloadEnvelope = () => {
    if (!envelope) return;
    const blob = new Blob([JSON.stringify(envelope, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = "echome-harmonic-context.hcm.json";
    anchor.click();
    URL.revokeObjectURL(url);
  };

  const byteReduction = envelope?.rawBytes
    ? Math.round((1 - envelope.payloadBytes / envelope.rawBytes) * 100)
    : null;

  return (
    <section className="rounded-2xl border border-purple-300/20 bg-slate-950/40 p-5 text-white space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-xl font-bold">♫ QRSP-FBAI Harmonic Context Memory</h2>
          <p className="text-sm text-white/60">
            Portable, reversible context encoding for conversation continuity.
          </p>
        </div>
        <span className="rounded-full border border-purple-300/30 px-3 py-1 text-xs text-purple-200">
          HCM 0.1.0
        </span>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-sm">
        {[
          ["♯", "Identity"],
          ["♭", "Constraints"],
          ["♮", "Decisions"],
          ["♪", "Knowledge"],
          ["♫", "Relationships"],
          ["♬", "History"],
          ["𝄐", "Objectives"],
          ["𝆒", "Updates"],
        ].map(([symbol, label]) => (
          <div key={label} className="rounded-lg bg-white/5 p-2">
            <span className="text-lg mr-2">{symbol}</span>
            <span className="text-white/80">{label}</span>
          </div>
        ))}
      </div>

      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          onClick={handleEncode}
          disabled={busy}
          className="rounded-lg bg-purple-600 px-4 py-2 font-semibold hover:bg-purple-500 disabled:opacity-50"
        >
          {busy ? "Working…" : "Encode current context"}
        </button>
        <button
          type="button"
          onClick={handleDecode}
          disabled={busy || !envelope}
          className="rounded-lg bg-indigo-600 px-4 py-2 font-semibold hover:bg-indigo-500 disabled:opacity-50"
        >
          Verify & restore
        </button>
        <button
          type="button"
          onClick={downloadEnvelope}
          disabled={!envelope}
          className="rounded-lg border border-white/20 px-4 py-2 font-semibold hover:bg-white/10 disabled:opacity-50"
        >
          Export HCM
        </button>
      </div>

      {status && (
        <p role="status" className="rounded-lg bg-white/5 p-3 text-sm text-white/80">
          {status}
        </p>
      )}

      {envelope && (
        <div className="space-y-2 rounded-xl bg-black/20 p-3 text-sm">
          <div className="flex justify-between gap-3">
            <span className="text-white/60">Encoding</span>
            <strong>{envelope.encoding}</strong>
          </div>
          <div className="flex justify-between gap-3">
            <span className="text-white/60">Original bytes</span>
            <strong>{envelope.rawBytes}</strong>
          </div>
          <div className="flex justify-between gap-3">
            <span className="text-white/60">Payload bytes</span>
            <strong>{envelope.payloadBytes}</strong>
          </div>
          {byteReduction !== null && (
            <div className="flex justify-between gap-3">
              <span className="text-white/60">Payload byte change</span>
              <strong>{byteReduction}%</strong>
            </div>
          )}
          <div className="break-all text-xs text-white/50">
            SHA-256: {envelope.sha256}
          </div>
          <div className="text-xs text-white/50">
            Byte measurements are not LLM token savings. Measure with the target model tokenizer.
          </div>
          <details className="pt-2">
            <summary className="cursor-pointer text-purple-200">View symbolic manifest</summary>
            <pre className="mt-2 overflow-auto whitespace-pre-wrap text-xs text-white/70">
              {JSON.stringify(envelope.manifest, null, 2)}
            </pre>
          </details>
        </div>
      )}

      {restored && (
        <details className="rounded-xl bg-black/20 p-3">
          <summary className="cursor-pointer text-green-200">View verified restored context</summary>
          <pre className="mt-2 max-h-72 overflow-auto whitespace-pre-wrap text-xs text-white/70">
            {JSON.stringify(restored, null, 2)}
          </pre>
        </details>
      )}
      <p className="text-xs text-white/45">
        HCM stores a reversible canonical payload and a musical semantic index.
        SHA-256 checks byte integrity, not factual truth or semantic equivalence.
      </p>
    </section>
  );
}
