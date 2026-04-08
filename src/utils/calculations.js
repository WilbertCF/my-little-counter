// ──────────────────────────────────────────────────────
// PURE UTILITY FUNCTIONS
// ──────────────────────────────────────────────────────

/** Clamp value v between a and b */
export const cl = (v, a, b) => Math.min(Math.max(v, a), b);

/** Format number as euro string */
export const ef = n => "€" + Math.round(n || 0).toLocaleString("es-ES");

/** Format number as percent string */
export const ep = n => Math.round(n || 0) + "%";

/** Extract initials from a name string */
export const ini = n =>
  (n || "?").trim().split(/\s+/).slice(0, 2).map(w => w[0]?.toUpperCase() || "").join("") || "?";

// ──────────────────────────────────────────────────────
// FINANCIAL CALCULATIONS
// ──────────────────────────────────────────────────────

/**
 * Calculate a person's income.
 * - "diario" mode: rate * days + extraD
 * - "mensual" mode: sal + extra
 */
export const pInc = p =>
  p.mode === "diario"
    ? (p.rate || 0) * (p.days || 0) + (p.extraD || 0)
    : (p.sal || 0) + (p.extra || 0);

/**
 * Calculate a person's personal expenses (sum of exp object values).
 */
export const pExp = p => Object.values(p.exp || {}).reduce((a, b) => a + b, 0);

/**
 * Calculate total debt cuotas assigned to a person.
 */
export const pDC = (debts, pid) =>
  debts.filter(x => x.owner === pid).reduce((a, x) => a + (x.cuo || 0), 0);

/**
 * Calculate total goal contributions assigned to a person.
 */
export const pGA = (goals, pid) =>
  goals.filter(x => x.owner === pid).reduce((a, x) => a + (x.apo || 0), 0);

/**
 * Calculate joint totals (fixed, variable, debts, lands, goals).
 */
export function jTot(S) {
  const jf = Object.values(S.joint.fixed).reduce((a, b) => a + b, 0);
  const jv = Object.values(S.joint.variable).reduce((a, b) => a + b, 0);
  const jdc = S.debts.filter(d => d.owner === "joint").reduce((a, d) => a + (d.cuo || 0), 0);
  const jlc = S.lands.filter(l => l.owner === "joint").reduce((a, l) => a + (l.cuo || 0), 0);
  const jgc = S.goals.filter(g => g.owner === "joint").reduce((a, g) => a + (g.apo || 0), 0);
  return { jf, jv, jdc, jlc, jgc, total: jf + jv + jdc + jlc + jgc };
}

/**
 * Calculate balance for person at index i in the state.
 * Returns { inc, exp, dc, gc, net }.
 */
export function pBal(S, i) {
  const p = S.persons[i];
  const inc = pInc(p);
  const exp = pExp(p);
  const dc = pDC(S.debts, p.id);
  const gc = pGA(S.goals, p.id);
  return { inc, exp, dc, gc, net: inc - exp - dc - gc };
}
