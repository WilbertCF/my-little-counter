// @vitest-environment jsdom
//
// Cobertura de la capa de persistencia (src/lib/storage.js):
// localStorage (jsdom real) + Firestore (mockeado). Verifica rutas de colección,
// merge, normalización de email y el armado de perfil.
import { describe, it, expect, beforeEach, vi } from "vitest";

vi.mock("../firebase.js", () => ({ db: { __db: true } }));
vi.mock("firebase/firestore", () => ({
  doc: vi.fn((...args) => ({ __ref: args })),
  getDoc: vi.fn(),
  setDoc: vi.fn(() => Promise.resolve()),
}));

import { doc, getDoc, setDoc } from "firebase/firestore";
import {
  lsGet, lsSet, lsDel, emailKey,
  fsGet, fsSet, fsHouseGet, fsHouseSet, fsEmailGet, fsEmailSet, buildProfile,
} from "./storage.js";

const snap = (data) => ({ exists: () => data != null, data: () => data });

beforeEach(() => {
  localStorage.clear();
  vi.clearAllMocks();
  setDoc.mockResolvedValue(undefined);
});

describe("localStorage helpers", () => {
  it("lsSet + lsGet round-trip an object", () => {
    expect(lsSet("k", { a: 1 })).toBe(true);
    expect(lsGet("k")).toEqual({ a: 1 });
  });
  it("lsGet returns null for a missing key", () => {
    expect(lsGet("nope")).toBeNull();
  });
  it("lsGet returns null on invalid JSON", () => {
    localStorage.setItem("bad", "{not json");
    expect(lsGet("bad")).toBeNull();
  });
  it("lsDel removes the key", () => {
    lsSet("k", 1);
    lsDel("k");
    expect(lsGet("k")).toBeNull();
  });
});

describe("emailKey", () => {
  it("lowercases and trims", () => {
    expect(emailKey("  Ana@Example.COM ")).toBe("ana@example.com");
  });
  it("handles null/undefined", () => {
    expect(emailKey(null)).toBe("");
    expect(emailKey(undefined)).toBe("");
  });
});

describe("Firestore user docs", () => {
  it("fsGet returns data when the doc exists, targeting users/{uid}", async () => {
    getDoc.mockResolvedValue(snap({ appData: { x: 1 } }));
    expect(await fsGet("u1")).toEqual({ appData: { x: 1 } });
    expect(doc).toHaveBeenCalledWith(expect.anything(), "users", "u1");
  });
  it("fsGet returns null when the doc does not exist", async () => {
    getDoc.mockResolvedValue(snap(null));
    expect(await fsGet("u1")).toBeNull();
  });
  it("fsGet returns null on error", async () => {
    getDoc.mockRejectedValue(new Error("boom"));
    expect(await fsGet("u1")).toBeNull();
  });
  it("fsSet writes with merge and returns true", async () => {
    expect(await fsSet("u1", { appData: 1 })).toBe(true);
    expect(doc).toHaveBeenCalledWith(expect.anything(), "users", "u1");
    expect(setDoc).toHaveBeenCalledWith(expect.anything(), { appData: 1 }, { merge: true });
  });
  it("fsSet returns false on error", async () => {
    setDoc.mockRejectedValue(new Error("boom"));
    expect(await fsSet("u1", {})).toBe(false);
  });
});

describe("Firestore household docs", () => {
  it("fsHouseGet targets households/{sk}", async () => {
    getDoc.mockResolvedValue(snap({ appData: 2 }));
    expect(await fsHouseGet("a_b")).toEqual({ appData: 2 });
    expect(doc).toHaveBeenCalledWith(expect.anything(), "households", "a_b");
  });
  it("fsHouseSet writes households/{sk} with merge", async () => {
    expect(await fsHouseSet("a_b", { x: 1 })).toBe(true);
    expect(doc).toHaveBeenCalledWith(expect.anything(), "households", "a_b");
  });
});

describe("emailIndex", () => {
  it("fsEmailGet normalizes the email key", async () => {
    getDoc.mockResolvedValue(snap({ uid: "u1" }));
    expect(await fsEmailGet(" Ana@X.com ")).toEqual({ uid: "u1" });
    expect(doc).toHaveBeenCalledWith(expect.anything(), "emailIndex", "ana@x.com");
  });
  it("fsEmailSet stores uid + displayName under the normalized key", async () => {
    expect(await fsEmailSet(" Ana@X.com ", "u1", "Ana")).toBe(true);
    expect(doc).toHaveBeenCalledWith(expect.anything(), "emailIndex", "ana@x.com");
    expect(setDoc).toHaveBeenCalledWith(expect.anything(), { uid: "u1", displayName: "Ana" }, { merge: true });
  });
});

describe("buildProfile", () => {
  it("uses fbUser.displayName and seeds the email index", async () => {
    getDoc.mockResolvedValue(snap(null));
    const p = await buildProfile({ uid: "u1", email: "a@b.com", displayName: "Ana" });
    expect(p).toEqual({ uid: "u1", email: "a@b.com", name: "Ana", partnerId: null });
    expect(setDoc).toHaveBeenCalledWith(expect.anything(), { uid: "u1", displayName: "Ana" }, { merge: true });
  });
  it("falls back to stored displayName and carries partnerId", async () => {
    getDoc.mockResolvedValue(snap({ displayName: "Stored", partnerId: "p2" }));
    const p = await buildProfile({ uid: "u1", email: "a@b.com", displayName: null });
    expect(p.name).toBe("Stored");
    expect(p.partnerId).toBe("p2");
  });
  it("defaults name to 'Usuario' and skips seeding when there is no email", async () => {
    getDoc.mockResolvedValue(snap(null));
    const p = await buildProfile({ uid: "u1", email: null, displayName: null });
    expect(p.name).toBe("Usuario");
    expect(setDoc).not.toHaveBeenCalled();
  });
});
