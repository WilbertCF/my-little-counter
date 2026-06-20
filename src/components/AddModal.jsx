import { useState } from "react";
import { ini } from "../utils/calculations.js";
import { DICONS, LICONS, GICONS, ICOLORS, C } from "../constants.js";
import { uid } from "../lib/helpers.js";
import { FR } from "./primitives.jsx";

// ──────────────────────────────────────────────────────
// ADD MODAL
// ──────────────────────────────────────────────────────
export function AddM({type, defOwner, S, onClose, onAdd}) {
  const cfg = {debt: {t: "Nueva deuda", icons: DICONS, di: "💳", dc: "#f04060", f: [{k: "cap", l: "Capital (€)", s: 100}, {k: "sal", l: "Saldo (€)", s: 100}, {k: "cuo", l: "Cuota/mes (€)", s: 10}, {k: "tin", l: "TIN (%)", s: 0.1, d: 5}, {k: "mes", l: "Meses", s: 1, d: 36}]},
    land: {t: "Nuevo terreno", icons: LICONS, di: "🏡", dc: "#00e6a8", f: [{k: "pre", l: "Precio (€)", s: 500}, {k: "pag", l: "Pagado (€)", s: 100}, {k: "cuo", l: "Cuota/mes (€)", s: 10}, {k: "val", l: "Valor (€)", s: 500}]},
    goal: {t: "Nuevo objetivo", icons: GICONS, di: "🛡", dc: "#00e6a8", f: [{k: "obj", l: "Objetivo (€)", s: 100}, {k: "act", l: "Ahorrado (€)", s: 100}, {k: "apo", l: "Aporte/mes (€)", s: 10}]}}[type];
  const [nm, setNm] = useState(""); const [ic, setIc] = useState(cfg.di); const [co, setCo] = useState(cfg.dc); const [ow, setOw] = useState(defOwner || "joint");
  const [vs, setVs] = useState(() => { const o = {}; cfg.f.forEach(f => o[f.k] = f.d || 0); return o; });
  return (<div className="OV" onClick={onClose}><div className="MS" onClick={e => e.stopPropagation()}>
    <div className="MHn" /><div className="MTT">{cfg.t}</div>
    <div className="MSC">Nombre</div><input className="MIN" placeholder="Nombre..." maxLength={32} value={nm} onChange={e => setNm(e.target.value)} autoFocus />
    <div className="MSC">Icono</div><div className="PKR">{cfg.icons.map(i => <button key={i} className={`PKI ${ic === i ? "on" : ""}`} onClick={() => setIc(i)}>{i}</button>)}</div>
    <div className="MSC">Color</div><div className="PKR">{ICOLORS.map(c => <button key={c} className={`PKC ${co === c ? "on" : ""}`} style={{background: c}} onClick={() => setCo(c)} />)}</div>
    <div className="MSC">Asignar a</div>
    <div className="OWR">{S.persons.map(p => { const pc = C[p.ci]; return (<button key={p.id} className={`OWB ${ow === p.id ? "on" : ""}`}
      style={ow === p.id ? {background: pc.d, borderColor: pc.m, color: pc.main} : {}} onClick={() => setOw(p.id)}>
      <div className="OWA" style={{background: pc.d, color: pc.main}}>{ini(p.name)}</div>{p.name.split(" ")[0]}</button>); })}
      <button className={`OWB ${ow === "joint" ? "on" : ""}`} onClick={() => setOw("joint")}>🏠 Conjunto</button></div>
    <div className="MSC">Datos</div>
    {cfg.f.map(f => <FR key={f.k} l={f.l} v={vs[f.k]} step={f.s} onChange={v => setVs({...vs, [f.k]: v})} />)}
    <div style={{display: "flex", gap: 8, marginTop: 16}}><button className="BS" onClick={onClose}>Cancelar</button>
      <button className="BP" onClick={() => { if (!nm.trim()) return; onAdd({id: uid(), name: nm, icon: ic, color: co, owner: ow, ...vs}); onClose(); }}>Crear</button></div>
  </div></div>);
}
