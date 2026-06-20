import { useState, useEffect, useRef } from "react";
import { ep } from "../utils/calculations.js";
import { oInf } from "../lib/helpers.js";

// ──────────────────────────────────────────────────────
// FIXED NUMBER INPUT — local state + onBlur
// ──────────────────────────────────────────────────────
export function NI({value, onChange, step = 10, min = 0}) {
  const [loc, setLoc] = useState(String(value || 0));
  const ref = useRef(null);
  useEffect(() => { if (document.activeElement !== ref.current) setLoc(String(value || 0)); }, [value]);
  const commit = v => { const n = parseFloat(v); const val = isNaN(n) ? 0 : Math.max(min, n); setLoc(String(val)); onChange(val); };
  return <input ref={ref} className="FI" type="number" inputMode="decimal" value={loc} min={min} step={step}
    onChange={e => setLoc(e.target.value)} onBlur={e => commit(e.target.value)} onKeyDown={e => { if (e.key === "Enter") e.target.blur(); }} />;
}

// ──────────────────────────────────────────────────────
// TINY COMPONENTS
// ──────────────────────────────────────────────────────
export function Tst({msg, show}) { if (!show) return null; return <div className="TC"><div className="TO">{msg}</div></div>; }
export function Cfm({title, sub, onOk, onCancel}) { return (<div className="CFD" onClick={onCancel}><div className="CFB" onClick={e => e.stopPropagation()}>
  <div className="CFT">{title}</div><div className="CFS">{sub}</div>
  <div style={{display: "flex", gap: 8}}><button className="BS" onClick={onCancel}>No</button>
  <button className="BP" style={{background: "linear-gradient(135deg,#f04060,#d03050)"}} onClick={onOk}>Sí, eliminar</button></div></div></div>); }
export function OBdg({S, o}) { const i = oInf(S, o); return <span className="OB" style={{background: i.bg, color: i.color, border: `1px solid ${i.bd}`}}>{i.text}</span>; }
export function KPI({l, v, s, t = "ok"}) { return (<div className={`KP k${t}`}><div className="KL">{l}</div><div className="KV">{v}</div>{s && <div className="KS">{s}</div>}</div>); }
export function FR({l, v, onChange, step = 10, min = 0}) { return (<div className="DR"><span className="DL">{l}</span><NI value={v} onChange={onChange} step={step} min={min} /></div>); }
export function DRw({l, v, c}) { return <div className="DR"><span className="DL">{l}</span><span className="DV" style={c ? {color: c} : undefined}>{v}</span></div>; }
export function PBr({l, p, c}) { return (<div className="PW"><div className="PH"><span className="PLB">{l}</span><span className="PP">{ep(p)}</span></div>
  <div className="PT"><div className="PF" style={{width: `${p}%`, background: c, boxShadow: `0 0 6px ${c}44`}} /></div></div>); }
