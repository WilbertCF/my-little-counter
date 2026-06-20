import { X } from "lucide-react";
import { cl, ef, ep } from "../utils/calculations.js";
import { FR, PBr, OBdg } from "./primitives.jsx";

// ──────────────────────────────────────────────────────
// ITEM CARDS
// ──────────────────────────────────────────────────────
export function DCd({d, S, upD, rmD}) { const pc = d.cap > 0 ? cl((d.cap - d.sal) / d.cap * 100, 0, 100) : 0; const co = d.color || "#f04060"; return (
  <div className="IC"><div className="IH"><div className="II" style={{background: co + "18"}}>{d.icon || "💳"}</div>
    <input className="INI" value={d.name} maxLength={30} onChange={e => upD(d.id, "name", e.target.value)} />
    <OBdg S={S} o={d.owner} /><button className="DB" onClick={() => rmD(d.id)}><X size={10} /></button></div>
  <div className="IB"><FR l="Capital (€)" v={d.cap} step={100} onChange={v => upD(d.id, "cap", v)} />
    <FR l="Saldo (€)" v={d.sal} step={100} onChange={v => upD(d.id, "sal", v)} />
    <FR l="Cuota/mes (€)" v={d.cuo} step={10} onChange={v => upD(d.id, "cuo", v)} />
    <FR l="TIN (%)" v={d.tin} step={0.1} onChange={v => upD(d.id, "tin", v)} />
    <FR l="Meses rest." v={d.mes} step={1} min={0} onChange={v => upD(d.id, "mes", v)} />
    <PBr l="Amortizado" p={pc} c={co} /></div>
  <div className="IF"><div><div className="ISV" style={{color: co}}>{ef(d.sal)}</div><div className="ISL">pendiente</div></div>
    <div><div className="ISV">{ef(d.cuo)}/m</div><div className="ISL">cuota</div></div>
    <div><div className="ISV">{ep(pc)}</div><div className="ISL">amortizado</div></div></div></div>); }

export function LCd({l, S, upL, rmL}) { const pc = l.pre > 0 ? cl(l.pag / l.pre * 100, 0, 100) : 0; const sa = Math.max(0, l.pre - l.pag); const pl = l.val - l.pre; const co = l.color || "#00e6a8"; return (
  <div className="IC"><div className="IH"><div className="II" style={{background: co + "18"}}>{l.icon || "🏡"}</div>
    <input className="INI" value={l.name} maxLength={30} onChange={e => upL(l.id, "name", e.target.value)} />
    <OBdg S={S} o={l.owner} /><button className="DB" onClick={() => rmL(l.id)}><X size={10} /></button></div>
  <div className="IB"><FR l="Precio (€)" v={l.pre} step={500} onChange={v => upL(l.id, "pre", v)} />
    <FR l="Pagado (€)" v={l.pag} step={100} onChange={v => upL(l.id, "pag", v)} />
    <FR l="Cuota/mes (€)" v={l.cuo} step={10} onChange={v => upL(l.id, "cuo", v)} />
    <FR l="Valor merc. (€)" v={l.val} step={500} onChange={v => upL(l.id, "val", v)} />
    <PBr l="Progreso" p={pc} c={co} /></div>
  <div className="IF"><div><div className="ISV" style={{color: co}}>{ef(l.pag)}</div><div className="ISL">pagado</div></div>
    <div><div className="ISV">{ef(sa)}</div><div className="ISL">pendiente</div></div>
    <div><div className="ISV" style={{color: pl >= 0 ? "#00e6a8" : "#f04060"}}>{pl >= 0 ? "+" : ""}{ef(pl)}</div><div className="ISL">plusvalía</div></div></div></div>); }

export function GCd({g, S, upG, rmG}) { const p = g.obj > 0 ? cl(g.act / g.obj * 100, 0, 100) : 0; const f = Math.max(0, g.obj - g.act);
  const m = g.apo > 0 ? Math.ceil(f / g.apo) : null; const ms = f <= 0 ? "✓ Alcanzada" : (m ? `${m} meses` : "—"); return (
  <div className="IC"><div className="IH"><div className="II" style={{background: (g.color || "#00e6a8") + "18"}}>{g.icon}</div>
    <input className="INI" value={g.name} maxLength={28} onChange={e => upG(g.id, "name", e.target.value)} />
    <div style={{textAlign: "right", flexShrink: 0}}><div style={{fontFamily: "var(--mn)", fontSize: 10, fontWeight: 500, color: g.color}}>{ef(g.act)}/{ef(g.obj)}</div>
    <div style={{fontSize: 8, color: "var(--t3)"}}>{ef(g.apo)}/mes</div></div>
    <OBdg S={S} o={g.owner} /><button className="DB" onClick={() => rmG(g.id)}><X size={10} /></button></div>
  <div className="IB"><FR l="Objetivo (€)" v={g.obj} step={100} onChange={v => upG(g.id, "obj", v)} />
    <FR l="Ahorrado (€)" v={g.act} step={100} onChange={v => upG(g.id, "act", v)} />
    <FR l="Aporte/mes (€)" v={g.apo} step={10} onChange={v => upG(g.id, "apo", v)} />
    <PBr l={ms} p={p} c={g.color || "#00e6a8"} /></div></div>); }
