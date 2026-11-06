/**
 * QRSP-FBAI Harmonic Context Memory (HCM)
 * Browser-safe, reversible context envelope for EchoMe.
 *
 * Musical symbols classify semantic fields. The canonical JSON payload is
 * preserved losslessly; symbols are an index, not a substitute for meaning.
 * SHA-256 verifies byte integrity, not truth or semantic correctness.
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

export const HCM_PROVENANCE = Object.freeze([
  "ESTABLISHED",
  "OBSERVED",
  "RETRIEVED",
  "DERIVED",
  "USER_REPORTED",
  "HYPOTHESIS",
  "SPECULATIVE",
  "UNKNOWN",
]);

export class Base15Quadruple {
  static BASE = 15;
  static DIGITS = 4;
  static MAX_VALUE = 15 ** 4;

  static encodeInt(number) {
    if (!Number.isInteger(number) || number < 0 || number >= this.MAX_VALUE) {
      throw new RangeError(\`number must be an integer from 0 to \${this.MAX_VALUE - 1}\`);
    }
    let value = number;
    const digits = [];
    for (let i = 0; i < this.DIGITS; i += 1) {
      digits.unshift(value % this.BASE);
      value = Math.floor(value / this.BASE);
    }
    return digits;
  }

  static decodeDigits(digits) {
    if (!Array.isArray(digits) || digits.length !== this.DIGITS) {
      throw new TypeError("exactly four base-15 digits are required");
    }
    return digits.reduce((value, digit) => {
      if (!Number.isInteger(digit) || digit < 0 || digit >= this.BASE) {
        throw new RangeError("each base-15 digit must be an integer from 0 to 14");
      }
      return value * this.BASE + digit;
    }, 0);
  }

  // Four mapped fields are retained. This is a symbolic signature mapping,
  // not a claim that the original integer is a conventional sexagesimal value.
  static toBase60Signature(number) {
    return this.encodeInt(number).map((digit) => String(digit * 4).padStart(2, "0")).join(":");
  }
}

function isPlainObject(value) {
  return value !== null && typeof value === "object" && !Array.isArray(value);
}

function canonicalize(value) {
  if (Array.isArray(value)) return value.map(canonicalize);
  if (!isPlainObject(value)) return value;
  return Object.keys(value).sort().reduce((result, key) => {
    result[key] = canonicalize(value[key]);
    return result;
  }, {});
}

function canonicalJson(value) {
  return JSON.stringify(canonicalize(value));
}

function validateContext(context) {
  if (!isPlainObject(context)) throw new TypeError("context must be a plain object");
  if (typeof context.version !== "string" || !context.version.trim()) {
    throw new TypeError('context.version must be a non-empty string');
  }
  if (context.provenance !== undefined) {
    if (!Array.isArray(context.provenance)) {
      throw new TypeError("context.provenance must be an array");
    }
    for (const item of context.provenance) {
      if (!isPlainObject(item) || !HCM_PROVENANCE.includes(item.status)) {
        throw new TypeError("each provenance item needs a supported status");
      }
    }
  }
}

function buildManifest(context) {
  return Object.entries(HCM_SYMBOLS)
    .filter(([field]) => Object.prototype.hasOwnProperty.call(context, field))
    .map(([field, symbol], index) => ({
      field,
      symbol,
      symbol_index: index,
      base15: Base15Quadruple.encodeInt(index),
      base60_signature: Base15Quadruple.toBase60Signature(index),
    }));
}

function bytesToBase64Url(bytes) {
  let binary = "";
  const chunkSize = 0x8000;
  for (let offset = 0; offset < bytes.length; offset += chunkSize) {
    binary += String.fromCharCode(...bytes.subarray(offset, offset + chunkSize));
  }
  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/g, "");
}

function base64UrlToBytes(value) {
  if (typeof value !== "string" || !/^[A-Za-z0-9_-]*$/.test(value)) {
    throw new TypeError("payload is not valid base64url");
  }
  const base64 = value.replace(/-/g, "+").replace(/_/g, "/");
  const padded = base64 + "=".repeat((4 - (base64.length % 4)) % 4);
  const binary = atob(padded);
  return Uint8Array.from(binary, (character) => character.charCodeAt(0));
}

async function sha256Hex(bytes) {
  if (!globalThis.crypto?.subtle) {
    throw new Error("Web Crypto SHA-256 is unavailable; use HTTPS or localhost");
  }
  const digest = await globalThis.crypto.subtle.digest("SHA-256", bytes);
  return Array.from(new Uint8Array(digest), (byte) => byte.toString(16).padStart(2, "0")).join("");
}

async function compress(bytes) {
  if (typeof CompressionStream === "undefined") {
    return { encoding: "identity+base64url", bytes };
  }
  const stream = new Blob([bytes]).stream().pipeThrough(new CompressionStream("gzip"));
  return {
    encoding: "gzip+base64url",
    bytes: new Uint8Array(await new Response(stream).arrayBuffer()),
  };
}

async function decompress(bytes, encoding) {
  if (encoding === "identity+base64url") return bytes;
  if (encoding !== "gzip+base64url") throw new TypeError("unsupported HCM encoding");
  if (typeof DecompressionStream === "undefined") {
    throw new Error("This browser cannot decompress the HCM gzip payload");
  }
  const stream = new Blob([bytes]).stream().pipeThrough(new DecompressionStream("gzip"));
  return new Uint8Array(await new Response(stream).arrayBuffer());
}

/**
 * Build a portable structured context object from EchoMe's current UI fields.
 * The original text is retained verbatim in context_text.
 */
export function buildConversationContext({
  identity = "EchoMe Conversation Hub",
  conversationType = "",
  topic = "",
  contextText = "",
  participantOrder = [],
  objectives = [],
  constraints = [],
  decisions = [],
} = {}) {
  const clean = (value) => String(value ?? "").trim();
  return {
    version: "1.0",
    identity: clean(identity),
    conversation_type: clean(conversationType),
    topic: clean(topic),
    context_text: String(contextText ?? ""),
    participants: Array.isArray(participantOrder)
      ? participantOrder.map(clean).filter(Boolean)
      : String(participantOrder).split(",").map(clean).filter(Boolean),
    objectives: [...objectives, ...(clean(topic) ? [clean(topic)] : [])],
    constraints: [...constraints],
    decisions: [...decisions],
    provenance: contextText
      ? [{ field: "context_text", status: "USER_REPORTED" }]
      : [],
  };
}

/**
 * Encode a context object into a reversible HCM envelope.
 * Compression is optional and the selected transport is recorded explicitly.
 */
export async function encodeHcmContext(context) {
  validateContext(context);
  const raw = new TextEncoder().encode(canonicalJson(context));
  const packed = await compress(raw);
  const manifest = buildManifest(context);

  return {
    codec: HCM_VERSION,
    symbolic_layer: "QRSP-FBAI-HCM",
    encoding: packed.encoding,
    manifest,
    raw_bytes: raw.byteLength,
    payload_bytes: packed.bytes.byteLength,
    byte_reduction_percent: raw.byteLength
      ? Number(((1 - packed.bytes.byteLength / raw.byteLength) * 100).toFixed(2))
      : 0,
    sha256: await sha256Hex(raw),
    payload: bytesToBase64Url(packed.bytes),
  };
}

/**
 * Decode and integrity-check an HCM envelope.
 * The canonical context object is returned only after its digest and manifest
 * have both been verified.
 */
export async function decodeHcmContext(envelope) {
  if (!isPlainObject(envelope) || envelope.codec !== HCM_VERSION) {
    throw new TypeError("unsupported or malformed HCM envelope");
  }
  const packed = base64UrlToBytes(envelope.payload);
  const raw = await decompress(packed, envelope.encoding);
  const digest = await sha256Hex(raw);
  if (digest !== envelope.sha256) throw new Error("HCM SHA-256 integrity check failed");

  let context;
  try {
    context = JSON.parse(new TextDecoder().decode(raw));
  } catch {
    throw new Error("HCM payload is not valid UTF-8 JSON");
  }
  validateContext(context);

  if (JSON.stringify(envelope.manifest) !== JSON.stringify(buildManifest(context))) {
    throw new Error("HCM semantic manifest does not match decoded context");
  }
  return context;
}

/**
 * Deterministic shallow update. Object fields merge; arrays replace by default
 * so corrections do not silently duplicate facts.
 */
export function updateHcmContext(current, patch) {
  validateContext(current);
  if (!isPlainObject(patch)) throw new TypeError("patch must be a plain object");
  const updated = { ...current };
  for (const [key, value] of Object.entries(patch)) {
    updated[key] = isPlainObject(value) && isPlainObject(updated[key])
      ? { ...updated[key], ...value }
      : value;
  }
  validateContext(updated);
  return updated;
}
