// @vitest-environment jsdom
//
// Smoke test de los componentes extraídos a src/components/ (refactor de cohesión).
// Monta cada uno con el estado inicial real (EMPTY) y verifica que renderiza sin
// lanzar. Esto cubre el hueco del smoke de App (que solo llega a "Cargando...") y
// caza cualquier símbolo usado pero no importado tras la extracción.
import { describe, it, expect, afterEach, vi } from "vitest";
import { render, cleanup } from "@testing-library/react";

vi.mock("../firebase.js", () => ({ auth: {}, db: {} }));
vi.mock("firebase/auth", () => ({
  onAuthStateChanged: () => () => {},
  signInWithEmailAndPassword: vi.fn(),
  createUserWithEmailAndPassword: vi.fn(),
  signOut: vi.fn(),
  updateProfile: vi.fn(),
}));
vi.mock("firebase/firestore", () => ({ doc: vi.fn(), getDoc: vi.fn(), setDoc: vi.fn() }));

import { EMPTY } from "../constants.js";
import { DashT, PersT, JntT, HistT, SvDlg } from "../components/tabs.jsx";
import { Login } from "../components/Login.jsx";
import { PLink } from "../components/PartnerLink.jsx";
import { AddM } from "../components/AddModal.jsx";

const noop = () => {};
const user = { uid: "u1", email: "ana@example.com", name: "Ana", partnerId: null };

afterEach(cleanup);

describe("componentes extraídos montan sin lanzar", () => {
  it("DashT (dashboard)", () => {
    expect(() => render(<DashT S={EMPTY} />)).not.toThrow();
  });
  it("PersT (tab persona)", () => {
    expect(() => render(<PersT S={EMPTY} idx={0} upS={noop} toast={noop} />)).not.toThrow();
  });
  it("JntT (tab conjunto)", () => {
    expect(() => render(<JntT S={EMPTY} upS={noop} toast={noop} />)).not.toThrow();
  });
  it("HistT (tab historial)", () => {
    expect(() => render(<HistT S={EMPTY} upS={noop} toast={noop} />)).not.toThrow();
  });
  it("SvDlg (diálogo guardar)", () => {
    expect(() => render(<SvDlg S={EMPTY} onClose={noop} onSave={noop} />)).not.toThrow();
  });
  it("Login", () => {
    expect(() => render(<Login onLogin={noop} onGuest={noop} />)).not.toThrow();
  });
  it("PLink (vincular pareja)", () => {
    expect(() => render(<PLink user={user} S={EMPTY} upS={noop} toast={noop} onPartnerLinked={noop} />)).not.toThrow();
  });
  it("AddM (modal añadir)", () => {
    expect(() => render(<AddM type="debt" defOwner="p0" S={EMPTY} onClose={noop} onAdd={noop} />)).not.toThrow();
  });
});
