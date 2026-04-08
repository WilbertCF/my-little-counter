import { describe, it, expect } from "vitest";
import { cl, ef, ep, ini, pInc, pExp, pDC, pGA, jTot, pBal } from "./calculations.js";

// ──────────────────────────────────────────────────────
// UTILITY FUNCTIONS
// ──────────────────────────────────────────────────────

describe("cl (clamp)", () => {
  it("returns value when within range", () => {
    expect(cl(5, 0, 10)).toBe(5);
  });

  it("clamps to minimum when below range", () => {
    expect(cl(-3, 0, 10)).toBe(0);
  });

  it("clamps to maximum when above range", () => {
    expect(cl(15, 0, 10)).toBe(10);
  });

  it("handles boundary values", () => {
    expect(cl(0, 0, 10)).toBe(0);
    expect(cl(10, 0, 10)).toBe(10);
  });
});

describe("ef (euro formatter)", () => {
  it("starts with € symbol", () => {
    expect(ef(1000)).toMatch(/^€/);
  });

  it("rounds decimals up", () => {
    // Strip € and locale thousand separators before comparing
    const clean = s => s.replace("€", "").replace(/\./g, "").replace(/,/g, "");
    expect(clean(ef(1234.7))).toBe("1235");
    expect(clean(ef(1234.3))).toBe("1234");
  });

  it("handles zero", () => {
    expect(ef(0)).toBe("€0");
  });

  it("handles null/undefined as zero", () => {
    expect(ef(null)).toBe("€0");
    expect(ef(undefined)).toBe("€0");
  });

  it("handles negative values — rounds correctly", () => {
    const result = ef(-500);
    expect(result).toMatch(/^€/);
    expect(result).toMatch(/-?500/);
  });
});

describe("ep (percent formatter)", () => {
  it("formats a positive integer", () => {
    expect(ep(75)).toBe("75%");
  });

  it("rounds decimals", () => {
    expect(ep(74.6)).toBe("75%");
    expect(ep(74.4)).toBe("74%");
  });

  it("handles zero", () => {
    expect(ep(0)).toBe("0%");
  });

  it("handles null/undefined as zero", () => {
    expect(ep(null)).toBe("0%");
    expect(ep(undefined)).toBe("0%");
  });
});

describe("ini (initials)", () => {
  it("extracts initials from a two-word name", () => {
    expect(ini("Juan García")).toBe("JG");
  });

  it("extracts initials from a single-word name", () => {
    expect(ini("María")).toBe("M");
  });

  it("handles multiple words — takes only first two", () => {
    expect(ini("Ana María López")).toBe("AM");
  });

  it("returns ? for empty string", () => {
    expect(ini("")).toBe("?");
  });

  it("returns ? for null/undefined", () => {
    expect(ini(null)).toBe("?");
    expect(ini(undefined)).toBe("?");
  });

  it("trims surrounding whitespace", () => {
    expect(ini("  Carlos  ")).toBe("C");
  });
});

// ──────────────────────────────────────────────────────
// FINANCIAL CALCULATIONS
// ──────────────────────────────────────────────────────

describe("pInc (person income)", () => {
  it("calculates mensual income correctly", () => {
    const p = { mode: "mensual", sal: 2000, extra: 300 };
    expect(pInc(p)).toBe(2300);
  });

  it("calculates diario income correctly", () => {
    const p = { mode: "diario", rate: 80, days: 22, extraD: 100 };
    expect(pInc(p)).toBe(1860); // 80*22 + 100
  });

  it("handles zero mensual values", () => {
    const p = { mode: "mensual", sal: 0, extra: 0 };
    expect(pInc(p)).toBe(0);
  });

  it("handles zero diario values", () => {
    const p = { mode: "diario", rate: 0, days: 0, extraD: 0 };
    expect(pInc(p)).toBe(0);
  });

  it("handles missing fields as zero (mensual)", () => {
    const p = { mode: "mensual" };
    expect(pInc(p)).toBe(0);
  });

  it("handles missing fields as zero (diario)", () => {
    const p = { mode: "diario" };
    expect(pInc(p)).toBe(0);
  });
});

describe("pExp (person expenses)", () => {
  it("sums all expense fields", () => {
    const p = { exp: { movil: 30, ocio: 100, ropa: 50, otros: 20 } };
    expect(pExp(p)).toBe(200);
  });

  it("returns 0 when exp is empty", () => {
    const p = { exp: {} };
    expect(pExp(p)).toBe(0);
  });

  it("returns 0 when exp is missing", () => {
    const p = {};
    expect(pExp(p)).toBe(0);
  });

  it("handles partial expense fields", () => {
    const p = { exp: { movil: 25 } };
    expect(pExp(p)).toBe(25);
  });
});

describe("pDC (person debt cuotas)", () => {
  const debts = [
    { owner: "p0", cuo: 200 },
    { owner: "p0", cuo: 100 },
    { owner: "p1", cuo: 150 },
    { owner: "joint", cuo: 300 },
  ];

  it("sums cuotas for matching owner", () => {
    expect(pDC(debts, "p0")).toBe(300);
    expect(pDC(debts, "p1")).toBe(150);
  });

  it("returns 0 when no debts belong to person", () => {
    expect(pDC(debts, "p2")).toBe(0);
  });

  it("returns 0 for empty debts array", () => {
    expect(pDC([], "p0")).toBe(0);
  });

  it("treats missing cuo as 0", () => {
    const d = [{ owner: "p0" }];
    expect(pDC(d, "p0")).toBe(0);
  });

  it("does not include joint debts in person totals", () => {
    expect(pDC(debts, "joint")).toBe(300);
    expect(pDC(debts, "p0")).toBe(300); // should not include joint's 300
  });
});

describe("pGA (person goal contributions)", () => {
  const goals = [
    { owner: "p0", apo: 100 },
    { owner: "p0", apo: 50 },
    { owner: "p1", apo: 75 },
  ];

  it("sums apo for matching owner", () => {
    expect(pGA(goals, "p0")).toBe(150);
    expect(pGA(goals, "p1")).toBe(75);
  });

  it("returns 0 when no goals belong to person", () => {
    expect(pGA(goals, "p2")).toBe(0);
  });

  it("returns 0 for empty goals array", () => {
    expect(pGA([], "p0")).toBe(0);
  });

  it("treats missing apo as 0", () => {
    const g = [{ owner: "p0" }];
    expect(pGA(g, "p0")).toBe(0);
  });
});

describe("jTot (joint totals)", () => {
  const baseState = {
    joint: {
      fixed: { alquiler: 800, suministros: 100, internet: 40, seguros: 60, streaming: 20, sus: 0 },
      variable: { compras: 300, higiene: 50, restaurantes: 150, transporte: 80, otros: 20 },
    },
    debts: [
      { owner: "joint", cuo: 200 },
      { owner: "p0", cuo: 100 },
    ],
    lands: [
      { owner: "joint", cuo: 150 },
    ],
    goals: [
      { owner: "joint", apo: 100 },
      { owner: "p1", apo: 50 },
    ],
  };

  it("calculates fixed total correctly", () => {
    const result = jTot(baseState);
    expect(result.jf).toBe(1020); // 800+100+40+60+20+0
  });

  it("calculates variable total correctly", () => {
    const result = jTot(baseState);
    expect(result.jv).toBe(600); // 300+50+150+80+20
  });

  it("sums only joint debts", () => {
    const result = jTot(baseState);
    expect(result.jdc).toBe(200);
  });

  it("sums only joint lands", () => {
    const result = jTot(baseState);
    expect(result.jlc).toBe(150);
  });

  it("sums only joint goals", () => {
    const result = jTot(baseState);
    expect(result.jgc).toBe(100);
  });

  it("calculates grand total correctly", () => {
    const result = jTot(baseState);
    expect(result.total).toBe(1020 + 600 + 200 + 150 + 100); // 2070
  });

  it("handles empty arrays", () => {
    const emptyState = {
      joint: { fixed: {}, variable: {} },
      debts: [],
      lands: [],
      goals: [],
    };
    const result = jTot(emptyState);
    expect(result.total).toBe(0);
  });
});

describe("pBal (person balance)", () => {
  const state = {
    persons: [
      { id: "p0", mode: "mensual", sal: 2000, extra: 0, exp: { movil: 30, ocio: 50 } },
      { id: "p1", mode: "mensual", sal: 1800, extra: 200, exp: { movil: 20, ocio: 80 } },
    ],
    debts: [{ owner: "p0", cuo: 150 }],
    goals: [{ owner: "p0", apo: 100 }],
  };

  it("calculates income correctly", () => {
    const result = pBal(state, 0);
    expect(result.inc).toBe(2000);
  });

  it("calculates expenses correctly", () => {
    const result = pBal(state, 0);
    expect(result.exp).toBe(80); // 30+50
  });

  it("calculates debt cuotas correctly", () => {
    const result = pBal(state, 0);
    expect(result.dc).toBe(150);
  });

  it("calculates goal contributions correctly", () => {
    const result = pBal(state, 0);
    expect(result.gc).toBe(100);
  });

  it("calculates net balance correctly", () => {
    const result = pBal(state, 0);
    expect(result.net).toBe(2000 - 80 - 150 - 100); // 1670
  });

  it("works for second person with no debts or goals", () => {
    const result = pBal(state, 1);
    expect(result.inc).toBe(2000); // 1800+200
    expect(result.exp).toBe(100); // 20+80
    expect(result.dc).toBe(0);
    expect(result.gc).toBe(0);
    expect(result.net).toBe(1900);
  });
});
