// @vitest-environment jsdom
import { describe, it, expect, vi } from "vitest";
import { render, screen, cleanup } from "@testing-library/react";

// Mock Firebase so the component never tries to connect during the smoke render.
// This is the same module finanzas-app.jsx imports (./src/firebase.js).
vi.mock("../firebase.js", () => ({
  auth: {},
  db: {},
}));

vi.mock("firebase/auth", () => ({
  onAuthStateChanged: () => () => {},
  signInWithEmailAndPassword: vi.fn(),
  createUserWithEmailAndPassword: vi.fn(),
  signOut: vi.fn(),
  updateProfile: vi.fn(),
}));

vi.mock("firebase/firestore", () => ({
  doc: vi.fn(),
  getDoc: vi.fn(async () => ({ exists: () => false, data: () => ({}) })),
  setDoc: vi.fn(async () => undefined),
}));

// The smoke test's main value: it imports the real App (and transitively every
// extracted module), so any identifier left un-imported during the refactor
// would throw here at render time.
import App from "../../finanzas-app.jsx";

describe("App smoke", () => {
  it("renders without throwing", () => {
    expect(() => render(<App />)).not.toThrow();
    // Initial auth-loading screen shows the spinner copy.
    expect(screen.getByText("Cargando...")).toBeTruthy();
    cleanup();
  });
});
