import { webcrypto } from "node:crypto";
if (!globalThis.crypto?.subtle) {
  Object.defineProperty(globalThis, "crypto", { value: webcrypto, configurable: true });
}
import { describe, expect, it } from "vitest";
import {
  buildManifest,
  decodeContext,
  encodeContext,
  updateContext,
  validateContext,
} from "./qrsp-hcm";

const sample = {
  version: "1.0",
  identity: "Agent Hub",
  objectives: ["Reduce context drift"],
  constraints: ["Human authorization remains authoritative"],
  decisions: ["Use modular memory"],
  knowledge: ["QRSP-FBAI symbolic context"],
  relationships: [{ from: "Agent Hub", to: "HCM" }],
  history: [{ sequence: 1, message: "Prototype initiated" }],
  provenance: [{ claim: "Human approval is required", status: "ESTABLISHED" }],
};

describe("QRSP-FBAI HCM", () => {
  it("validates provenance labels", () => {
    expect(validateContext(sample)).toBe(true);
    expect(() => validateContext({
      version: "1.0",
      provenance: [{ claim: "x", status: "MADE_UP" }],
    })).toThrow(/Invalid provenance/);
  });

  it("builds a semantic musical manifest", () => {
    expect(buildManifest(sample).map((item) => item.symbol)).toEqual([
      "♯", "♭", "♮", "♪", "♫", "♬",
    ]);
  });

  it("round-trips context without losing fields", async () => {
    const envelope = await encodeContext(sample);
    await expect(decodeContext(envelope)).resolves.toEqual(sample);
  });

  it("rejects payload tampering", async () => {
    const envelope = await encodeContext(sample);
    const altered = {
      ...envelope,
      payload: (envelope.payload[0] === "A" ? "B" : "A") + envelope.payload.slice(1),
    };
    await expect(decodeContext(altered)).rejects.toThrow(/integrity check failed|manifest/);
  });

  it("replaces arrays by default and supports explicit append", () => {
    const replaced = updateContext(sample, { objectives: ["New objective"] });
    expect(replaced.objectives).toEqual(["New objective"]);
    const appended = updateContext(
      sample,
      { objectives: ["Another objective"] },
      { appendArrays: true }
    );
    expect(appended.objectives).toEqual(["Reduce context drift", "Another objective"]);
  });
});
