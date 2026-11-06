/**
 * QRSP-FBAI Harmonic Context Memory (HCM)
 * Browser-side, model-independent context envelope.
 *
 * Musical symbols classify semantic fields; they are not a replacement for
 * the canonical payload. The payload is losslessly recoverable JSON.
 */

export const HCM_VERSION = "qrsp-hcm/0.1.0";

export const HCM_SYMBOLS = Object.freeze({
  identity: "♯",
  constraints: "♭",
  decisions: "♮",
  knowledge: "♪",
  relationships: "♫",
  history: "♬",
  objectives: "𝄐",
  updates: "𝆒",
});

export const PROVENANCE = Object.freeze([
  "ESTABLISHED",
  "OBSERVED",
  "RETRIEVED",
  "DERIVED",
  "USER_REPORTED",
  "HYPOTHESIS",
  "SPECULATIVE",
  "UNKNOWN",
]);

function canonicalize(value) {
  if (value === null || typeof value !== "object") return value;
  if (Array.isArray(value)) return value.map(canonicalize);
  return Object.keys(value).sort().reduce((result, key) => {
    result[key] = canonicalize(value[key]);
    return result;
  }, {});
}

function stableStringify(value) {
  return JSON.stringify(canonicalize(value));
}

function toBase64(bytes) {
  let binary = "";
  const chunkSize = 0x8000;
  for (let offset = 0; offset < bytes.length; offset += chunkSize) {
    binary += String.fromCharCode(...bytes.subarray(offset, offset + chunkSize));
  }
  return btoa(binary);
}

function fromBase64(value) {
  const binary = atob(value);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i += 1) bytes[i] = binary.charCodeAt(i);
  return bytes;
}

async function sha256Hex(bytes) {
  if (!globalThis.crypto?.subtle) {
    throw new Error("SHA-256 is unavailable in this browser context.");
  }
  const digest = await globalThis.crypto.subtle.digest("SHA-256", bytes);
  return Array.from(new Uint8Array(digest), (byte) =>
    byte.toString(16).padStart(2, "0")
  ).join("");
}

async function transformStream(bytes, format, direction) {
  const StreamConstructor =
    direction === "compress" ? globalThis.CompressionStream : globalThis.DecompressionStream;
  if (!StreamConstructor) return null;

  try {
    const stream = new Blob([bytes]).stream().pipeThrough(new StreamConstructor(format));
    return new Uint8Array(await new Response(stream).arrayBuffer());
  } catch {
    return null;
  }
}

export function validateContext(context) {
  if (!context || typeof context !== "object" || Array.isArray(context)) {
    throw new TypeError("HCM context must be an object.");
  }
  if (!context.version) throw new Error("HCM context requires a version.");
  if (context.provenance !== undefined) {
    if (!Array.isArray(context.provenance)) {
      throw new TypeError("provenance must be an array.");
    }
    for (const item of context.provenance) {
      if (!item || typeof item !== "object" || !PROVENANCE.includes(item.status)) {
        throw new Error(`Invalid provenance entry: ${JSON.stringify(item)}`);
      }
    }
  }
  return true;
}

export function buildManifest(context) {
  return Object.entries(HCM_SYMBOLS)
    .filter(([field]) => {
      const value = context[field];
      return value !== undefined && value !== null && value !== "" &&
        (!Array.isArray(value) || value.length > 0) &&
        (typeof value !== "object" || Array.isArray(value) || Object.keys(value).length > 0);
    })
    .map(([field, symbol]) => ({
      field,
      symbol,
      itemCount: Array.isArray(context[field])
        ? context[field].length
        : context[field] && typeof context[field] === "object"
          ? Object.keys(context[field]).length
          : 1,
    }));
}

/**
 * Encode context to a portable envelope.
 * Compression is opportunistic; raw UTF-8 JSON remains the fallback.
 */
export async function encodeContext(context) {
  validateContext(context);
  const json = stableStringify(context);
  const rawBytes = new TextEncoder().encode(json);
  const compressed = await transformStream(rawBytes, "deflate", "compress");
  const payloadBytes = compressed || rawBytes;
  const digest = await sha256Hex(rawBytes);

  return {
    codec: HCM_VERSION,
    encoding: compressed ? "deflate+base64" : "utf8-json+base64",
    manifest: buildManifest(context),
    rawBytes: rawBytes.length,
    payloadBytes: payloadBytes.length,
    sha256: digest,
    payload: toBase64(payloadBytes),
  };
}

/** Decode an HCM envelope and verify its canonical payload digest. */
export async function decodeContext(envelope) {
  if (!envelope || envelope.codec !== HCM_VERSION) {
    throw new Error("Unsupported or missing HCM codec version.");
  }
  let payloadBytes = fromBase64(envelope.payload || "");
  if (envelope.encoding === "deflate+base64") {
    const decompressed = await transformStream(payloadBytes, "deflate", "decompress");
    if (!decompressed) throw new Error("This browser cannot decompress this HCM payload.");
    payloadBytes = decompressed;
  } else if (envelope.encoding !== "utf8-json+base64") {
    throw new Error("Unsupported HCM payload encoding.");
  }

  const actualDigest = await sha256Hex(payloadBytes);
  if (actualDigest !== envelope.sha256) {
    throw new Error("HCM integrity check failed: SHA-256 mismatch.");
  }

  const context = JSON.parse(new TextDecoder().decode(payloadBytes));
  validateContext(context);
  if (stableStringify(buildManifest(context)) !== stableStringify(envelope.manifest)) {
    throw new Error("HCM manifest does not match the decoded context.");
  }
  return context;
}

/**
 * Deterministic shallow patch. Arrays replace by default to prevent accidental
 * duplicate facts; callers can explicitly request append behavior.
 */
export function updateContext(current, patch, { appendArrays = false } = {}) {
  validateContext(current);
  if (!patch || typeof patch !== "object" || Array.isArray(patch)) {
    throw new TypeError("HCM patch must be an object.");
  }
  const next = { ...current };
  for (const [key, value] of Object.entries(patch)) {
    if (Array.isArray(value) && appendArrays && Array.isArray(next[key])) {
      next[key] = [...next[key], ...value];
    } else if (
      value && typeof value === "object" && !Array.isArray(value) &&
      next[key] && typeof next[key] === "object" && !Array.isArray(next[key])
    ) {
      next[key] = { ...next[key], ...value };
    } else {
      next[key] = value;
    }
  }
  validateContext(next);
  return next;
}

export function createConversationContext({
  topic = "",
  conversationType = "",
  participantOrder = [],
  history = [],
  extraContext = "",
} = {}) {
  return {
    version: "1.0",
    identity: "EchoMe Conversation Hub",
    objectives: topic ? [topic] : [],
    knowledge: extraContext ? [extraContext] : [],
    constraints: [
      "Treat provenance as part of every retained claim.",
      "Do not promote unverified statements to established facts.",
    ],
    decisions: [],
    relationships: [],
    history: history.map((entry, index) => ({
      sequence: index + 1,
      round: entry.round ?? null,
      model: entry.model ?? "unknown",
      message: entry.message ?? entry.context ?? "",
      success: typeof entry.success === "boolean" ? entry.success : null,
    })),
    updates: [],
    metadata: {
      conversationType,
      participantOrder,
      source: "EchoMe Conversation Hub",
      createdAt: new Date().toISOString(),
    },
    provenance: [],
  };
}
