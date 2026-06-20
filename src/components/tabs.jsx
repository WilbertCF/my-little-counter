import { useState, lazy, Suspense } from "react";
import { Plus } from "lucide-react";
import { ef, ep, ini, pInc, pExp, pDC, pGA, jTot, pBal } from "../utils/calculations.js";
import { C, M3, MES } from "../constants.js";
import { KPI, FR, DRw, Cfm } from "./primitives.jsx";
import { DCd, LCd, GCd } from "./cards.jsx";
import { AddM } from "./AddModal.jsx";

const DashPie = lazy(() => import("./DashCharts.jsx").then(m => ({ default: m.DashPie })));
const DashBar = lazy(() => import("./DashCharts.jsx").then(m => ({ default: m.DashBar })));

// ──────────────────────────────────────────────────────
// ALL TABS (Dashboard, Personal, Joint, History)
// ──────────────────────────────────────────────────────
export function DashT({S}) { const b0 = pBal(S, 0), b1 = pBal(S, 1), jt = jTot(S); const tI = b0.inc + b1.inc, tE = b0.exp + b1.exp + jt.total, tA = b0.gc + b1.gc + jt.jgc, bal = tI - tE;
  const ta = tI > 0 ? tA / tI * 100 : 0; const rd = tI > 0 ? S.debts.reduce((a, d) => a + (d.cuo || 0), 0) / tI * 100 : 0; const dT = S.debts.reduce((a, d) => a + (d.sal || 0), 0); const cuD = S.debts.reduce((a, d) => a + (d.cuo || 0), 0);
  const p0 = S.persons[0], p1 = S.persons[1], c0 = C[p0.ci], c1 = C[p1.ci]; const pc0 = tI > 0 ? Math.round(b0.inc / tI * 100) : 50, pc1 = 100 - pc0;
  const dn = [{n: p0.name.split(" ")[0], v: Math.max(b0.inc, 1), c: c0.main}, {n: p1.name.split(" ")[0], v: Math.max(b1.inc, 1), c: c1.main}];
  const bars = M3.map((m, i) => ({n: m, v: Math.round(tA * (i + 1))}));
  const sms = [{l: "Tasa ahorro", v: ep(ta), ok: ta >= 20, wn: ta >= 10, lb: ta >= 20 ? "Excelente" : ta >= 10 ? "Buena" : "Mejorar"},
    {l: "Gastos/ingreso", v: ep(tI > 0 ? tE / tI * 100 : 0), ok: tI > 0 && tE / tI < .8, wn: tI > 0 && tE / tI < .9, lb: tI > 0 && tE / tI < .8 ? "Controlado" : "Alto"},
    {l: "Deuda/ingreso", v: ep(rd), ok: rd < 10, wn: rd < 20, lb: rd < 10 ? "Saludable" : rd < 20 ? "Atención" : "Alto"},
    {l: "Balance", v: ef(bal), ok: bal >= 0, wn: false, lb: bal >= 0 ? "Positivo" : "Revisar"}];
  return (<div style={{animation: "fu .3s ease"}}><div className="ST">Indicadores clave</div>
    <div className="KG"><KPI l="Ingresos" v={ef(tI)} s={`${p0.name.split(" ")[0]} ${ef(b0.inc)} · ${p1.name.split(" ")[0]} ${ef(b1.inc)}`} t="ok" />
      <KPI l="Tasa ahorro" v={ep(ta)} s="objetivo ≥ 20%" t={ta >= 20 ? "ok" : ta >= 10 ? "wn" : "ng"} />
      <KPI l="Balance" v={ef(bal)} s={bal >= 0 ? "superávit" : "revisar"} t={bal >= 0 ? "ok" : "ng"} />
      <KPI l="Deuda pend." v={ef(dT)} s={`${ef(cuD)}/mes`} t="wn" /></div>
    <div className="CD"><div className="CH"><span className="CT">Ingresos</span><span className="BG bgok">{ep(ta)} ahorro</span></div>
      <div style={{display: "flex", gap: 6, marginBottom: 6}}>{dn.map(d => <div key={d.n} style={{display: "flex", alignItems: "center", gap: 4}}>
        <div style={{width: 7, height: 7, borderRadius: 2, background: d.c}} /><span style={{fontSize: 10, color: "var(--t2)"}}>{d.n}</span>
        <span style={{fontFamily: "var(--mn)", fontSize: 10, fontWeight: 500}}>{ef(d.v)}</span></div>)}</div>
      {tI > 0 && <Suspense fallback={<div style={{height: 130}} />}><DashPie dn={dn} /></Suspense>}</div>
    <div className="CD"><div className="CH"><span className="CT">Semáforo</span></div>
      {sms.map((s, i) => { const t = s.ok ? "ok" : s.wn ? "wn" : "ng"; const cs = {ok: "#00e6a8", wn: "#f5a020", ng: "#f04060"}; const bs = {ok: "rgba(0,230,168,.06)", wn: "rgba(245,160,32,.06)", ng: "rgba(240,64,96,.06)"};
        return <div key={i} className="SR"><div className="SD" style={{background: cs[t]}} /><span className="SL">{s.l}</span>
          <span className="SVl" style={{color: cs[t]}}>{s.v}</span><span className="SP" style={{background: bs[t], color: cs[t]}}>{s.lb}</span></div>; })}</div>
    <div className="CD"><div className="CH"><span className="CT">Balance hogar</span></div>
      <DRw l={p0.name} v={ef(b0.inc)} /><DRw l={p1.name} v={ef(b1.inc)} /><DRw l="– Gastos pers." v={`-${ef(b0.exp + b1.exp)}`} />
      <DRw l="– Gastos hogar" v={`-${ef(jt.jf + jt.jv)}`} /><DRw l="– Deudas" v={`-${ef(cuD + jt.jlc)}`} /><DRw l="– Ahorros" v={`-${ef(tA)}`} />
      <div className="TR"><span className="TRl">Disponible</span><span className="TRv" style={{color: bal >= 0 ? "#00e6a8" : "#f04060"}}>{ef(bal)}</span></div></div>
    <div className="CD"><div className="CH"><span className="CT">Contribución</span></div>
      <div style={{display: "flex", justifyContent: "space-between", fontSize: 9, color: "var(--t3)", marginBottom: 4}}>
        <span style={{color: c0.main}}>{p0.name.split(" ")[0]} {ep(pc0)}</span><span style={{color: c1.main}}>{ep(pc1)} {p1.name.split(" ")[0]}</span></div>
      <div className="CB"><div className="CS" style={{width: `${pc0}%`, background: c0.main}} /><div className="CS" style={{width: `${pc1}%`, background: c1.main}} /></div></div>
    {tA > 0 && <div className="CD"><div className="CH"><span className="CT">Proyección ahorro</span></div>
      <Suspense fallback={<div style={{height: 110}} />}><DashBar bars={bars} /></Suspense></div>}
  </div>); }

export function PersT({S, idx, upS, toast}) { const p = S.persons[idx], c = C[p.ci]; const inc = pInc(p), exp = pExp(p), dc = pDC(S.debts, p.id), gc = pGA(S.goals, p.id), net = inc - exp - dc - gc;
  const mD = S.debts.filter(d => d.owner === p.id), mG = S.goals.filter(g => g.owner === p.id); const [modal, setModal] = useState(null); const [cfm, setCfm] = useState(null);
  const upP = (f, v) => { const np = [...S.persons]; np[idx] = {...np[idx], [f]: v}; upS({persons: np}); };
  const upE = (f, v) => { const np = [...S.persons]; np[idx] = {...np[idx], exp: {...np[idx].exp, [f]: v}}; upS({persons: np}); };
  const upI = (k, id, f, v) => upS({[k]: S[k].map(x => x.id === id ? {...x, [f]: v} : x)});
  const rmI = (k, id) => { upS({[k]: S[k].filter(x => x.id !== id)}); toast("Eliminado"); setCfm(null); };
  return (<div style={{animation: "fu .3s ease"}}>
    <div className="PC" style={{borderColor: c.m}}><div className="PTp" style={{background: `linear-gradient(135deg,${c.d},transparent)`}}>
      <div className="PAV" style={{background: c.d, color: c.main, borderColor: c.m}}>{ini(p.name)}</div>
      <div style={{flex: 1, minWidth: 0}}><input className="PNI" value={p.name} maxLength={22} onChange={e => upP("name", e.target.value || "?")} />
        <div style={{fontSize: 8, color: "var(--t3)", marginTop: 2}}>✏ Toca para editar</div></div>
      <div style={{textAlign: "right", flexShrink: 0}}><div className="PIV" style={{color: c.main}}>{ef(inc)}</div><div className="PIL">ingreso</div></div></div>
    <div style={{display: "flex", justifyContent: "space-between", alignItems: "center", padding: "8px 14px", borderTop: "1px solid var(--b0)"}}>
      <span style={{fontSize: 9, fontWeight: 600, letterSpacing: ".4px", textTransform: "uppercase", color: "var(--t3)"}}>Tipo ingreso</span>
      <div className="SC"><button className={`SBt ${p.mode === "mensual" ? "on" : ""}`} onClick={() => upP("mode", "mensual")}>Mensual</button>
        <button className={`SBt ${p.mode === "diario" ? "on" : ""}`} onClick={() => upP("mode", "diario")}>Por día</button></div></div>
    <div style={{padding: "8px 14px"}}>{p.mode === "mensual" ? (<><FR l="Salario (€)" v={p.sal} step={50} onChange={v => upP("sal", v)} />
        <FR l="Extras" v={p.extra} step={50} onChange={v => upP("extra", v)} /></>) :
      (<><FR l="Tarifa/día (€)" v={p.rate} step={5} onChange={v => upP("rate", v)} /><FR l="Días" v={p.days} step={1} onChange={v => upP("days", v)} />
        <FR l="Extras" v={p.extraD} step={50} onChange={v => upP("extraD", v)} />
        <div style={{fontSize: 9, color: "var(--t3)", padding: "3px 0", fontFamily: "var(--mn)"}}>{ef(p.rate || 0)} × {p.days || 0} = <span style={{color: c.main}}>{ef((p.rate || 0) * (p.days || 0))}</span></div></>)}</div></div>
    <div className="CD"><div className="CH"><span className="CT">Gastos personales</span><span className="BG bgwn">{ef(exp)}</span></div>
      <FR l="Teléfono" v={p.exp.movil} step={5} onChange={v => upE("movil", v)} /><FR l="Ocio" v={p.exp.ocio} step={10} onChange={v => upE("ocio", v)} />
      <FR l="Ropa" v={p.exp.ropa} step={10} onChange={v => upE("ropa", v)} /><FR l="Otros" v={p.exp.otros} step={10} onChange={v => upE("otros", v)} /></div>
    <div className="SHD" style={{borderColor: c.m}}><div className="SI" style={{background: c.d, color: c.main}}>💳</div><div><div className="STT">Deudas</div><div className="SSB">{mD.length} activa{mD.length === 1 ? "" : "s"}</div></div></div>
    {mD.map(d => <DCd key={d.id} d={d} S={S} upD={(id, f, v) => upI("debts", id, f, v)} rmD={id => setCfm({k: "debts", id})} />)}
    {!mD.length && <div className="EM"><div className="EMI">💳</div><div className="EMT">Sin deudas</div></div>}
    <div className="AB" onClick={() => setModal("debt")}><Plus size={13} /> Añadir deuda</div>
    <div className="SHD" style={{borderColor: c.m}}><div className="SI" style={{background: c.d, color: c.main}}>🎯</div><div><div className="STT">Ahorros</div><div className="SSB">{mG.length} objetivo{mG.length === 1 ? "" : "s"}</div></div></div>
    {mG.map(g => <GCd key={g.id} g={g} S={S} upG={(id, f, v) => upI("goals", id, f, v)} rmG={id => setCfm({k: "goals", id})} />)}
    {!mG.length && <div className="EM"><div className="EMI">🎯</div><div className="EMT">Sin objetivos</div></div>}
    <div className="AB" onClick={() => setModal("goal")}><Plus size={13} /> Añadir objetivo</div>
    <div className="CD" style={{background: "var(--lf)", border: "1px solid var(--b1)"}}><div style={{fontSize: 9, fontWeight: 600, letterSpacing: ".5px", textTransform: "uppercase", color: "var(--t3)", marginBottom: 6}}>Balance — {MES[S.month]}</div>
      <DRw l="Ingreso" v={ef(inc)} c={c.main} /><DRw l="– Gastos" v={`-${ef(exp)}`} c="#f5a020" /><DRw l="– Deudas" v={`-${ef(dc)}`} c="#f04060" />
      <DRw l="– Ahorros" v={`-${ef(gc)}`} c="#00e6a8" /><div className="TR"><span className="TRl">Disponible</span>
      <span className="TRv" style={{color: net >= 0 ? "#00e6a8" : "#f04060"}}>{ef(net)}</span></div></div>
    {modal && <AddM type={modal} defOwner={p.id} S={S} onClose={() => setModal(null)} onAdd={item => { const k = modal === "debt" ? "debts" : "goals"; upS({[k]: [...S[k], item]}); toast("✓ Creado"); }} />}
    {cfm && <Cfm title="¿Eliminar?" sub="No se puede deshacer" onOk={() => rmI(cfm.k, cfm.id)} onCancel={() => setCfm(null)} />}
  </div>); }

export function JntT({S, upS, toast}) { const jf = S.joint.fixed, jv = S.joint.variable, jt = jTot(S); const b0 = pBal(S, 0), b1 = pBal(S, 1), tI = b0.inc + b1.inc;
  const c0 = C[S.persons[0].ci], c1 = C[S.persons[1].ci]; const pc0 = tI > 0 ? Math.round(b0.inc / tI * 100) : 50, pc1 = 100 - pc0;
  const jD = S.debts.filter(d => d.owner === "joint"), jG = S.goals.filter(g => g.owner === "joint"); const [modal, setModal] = useState(null); const [cfm, setCfm] = useState(null);
  const uF = (k, v) => upS({joint: {...S.joint, fixed: {...jf, [k]: v}}}); const uV = (k, v) => upS({joint: {...S.joint, variable: {...jv, [k]: v}}});
  return (<div style={{animation: "fu .3s ease"}}>
    <div className="KG" style={{marginTop: 8}}><KPI l={S.persons[0].name.split(" ")[0]} v={ef(b0.inc)} s={ep(pc0) + " total"} t="ok" />
      <KPI l={S.persons[1].name.split(" ")[0]} v={ef(b1.inc)} s={ep(pc1) + " total"} t="ok" />
      <KPI l="Combinado" v={ef(tI)} t="bl" /><KPI l="Gastos conj." v={ef(jt.total)} s={ep(tI > 0 ? jt.total / tI * 100 : 0) + " ingreso"} t="ng" /></div>
    <div className="SHD" style={{borderColor: "rgba(91,156,246,.22)"}}><div className="SI" style={{background: "rgba(91,156,246,.07)"}}>🏠</div><div><div className="STT">Fijos</div></div></div>
    <div className="CD"><FR l="Alquiler" v={jf.alquiler} step={50} onChange={v => uF("alquiler", v)} /><FR l="Suministros" v={jf.suministros} step={10} onChange={v => uF("suministros", v)} />
      <FR l="Internet" v={jf.internet} step={5} onChange={v => uF("internet", v)} /><FR l="Seguros" v={jf.seguros} step={10} onChange={v => uF("seguros", v)} />
      <FR l="Streaming" v={jf.streaming} step={5} onChange={v => uF("streaming", v)} /><FR l="Suscripciones" v={jf.sus} step={5} onChange={v => uF("sus", v)} />
      <DRw l="Deudas conj. (auto)" v={ef(jt.jdc)} c="var(--t3)" /><DRw l="Terrenos (auto)" v={ef(jt.jlc)} c="var(--t3)" /></div>
    <div className="SHD" style={{borderColor: "rgba(245,160,32,.22)"}}><div className="SI" style={{background: "rgba(245,160,32,.07)"}}>🛒</div><div><div className="STT">Variables</div></div></div>
    <div className="CD"><FR l="Compras" v={jv.compras} step={10} onChange={v => uV("compras", v)} /><FR l="Higiene" v={jv.higiene} step={5} onChange={v => uV("higiene", v)} />
      <FR l="Restaurantes" v={jv.restaurantes} step={10} onChange={v => uV("restaurantes", v)} /><FR l="Transporte" v={jv.transporte} step={5} onChange={v => uV("transporte", v)} />
      <FR l="Otros" v={jv.otros} step={10} onChange={v => uV("otros", v)} /></div>
    <div className="SHD" style={{borderColor: "rgba(240,64,96,.22)"}}><div className="SI" style={{background: "rgba(240,64,96,.07)"}}>💳</div><div><div className="STT">Deudas conjuntas</div></div></div>
    {jD.map(d => <DCd key={d.id} d={d} S={S} upD={(id, f, v) => upS({debts: S.debts.map(x => x.id === id ? {...x, [f]: v} : x)})} rmD={id => setCfm({k: "debts", id})} />)}
    <div className="AB" onClick={() => setModal("debt")}><Plus size={13} /> Deuda</div>
    <div className="SHD" style={{borderColor: "rgba(91,156,246,.22)"}}><div className="SI" style={{background: "rgba(91,156,246,.07)"}}>🏡</div><div><div className="STT">Terrenos</div></div></div>
    {S.lands.map(l => <LCd key={l.id} l={l} S={S} upL={(id, f, v) => upS({lands: S.lands.map(x => x.id === id ? {...x, [f]: v} : x)})} rmL={id => setCfm({k: "lands", id})} />)}
    <div className="AB" onClick={() => setModal("land")}><Plus size={13} /> Terreno</div>
    <div className="SHD" style={{borderColor: "rgba(0,230,168,.22)"}}><div className="SI" style={{background: "rgba(0,230,168,.07)"}}>💰</div><div><div className="STT">Ahorros conjuntos</div></div></div>
    {jG.map(g => <GCd key={g.id} g={g} S={S} upG={(id, f, v) => upS({goals: S.goals.map(x => x.id === id ? {...x, [f]: v} : x)})} rmG={id => setCfm({k: "goals", id})} />)}
    <div className="AB" onClick={() => setModal("goal")}><Plus size={13} /> Objetivo</div>
    {modal && <AddM type={modal} defOwner="joint" S={S} onClose={() => setModal(null)} onAdd={item => { const k = modal === "debt" ? "debts" : modal === "land" ? "lands" : "goals"; upS({[k]: [...S[k], item]}); toast("✓ Creado"); }} />}
    {cfm && <Cfm title="¿Eliminar?" sub="No se puede deshacer" onOk={() => { upS({[cfm.k]: S[cfm.k].filter(x => x.id !== cfm.id)}); toast("Eliminado"); setCfm(null); }} onCancel={() => setCfm(null)} />}
  </div>); }

export function HistT({S, upS, toast}) { const [cfm, setCfm] = useState(false);
  if (!S.history || !S.history.length) return (<div className="EM" style={{paddingTop: 40}}><div className="EMI">📅</div><div className="EMT">Sin historial</div>
    <div className="EMS">Guarda un mes con el botón "Guardar".</div></div>);
  const tot = S.history.reduce((a, h) => a + (h.totalAho || 0), 0);
  return (<div style={{animation: "fu .3s ease"}}><div style={{display: "flex", justifyContent: "space-between", alignItems: "center", padding: "8px 0", gap: 6, flexWrap: "wrap"}}>
    <span style={{fontSize: 11, color: "var(--t2)"}}>{S.history.length} mes{S.history.length === 1 ? "" : "es"} · Ahorro: <strong style={{fontFamily: "var(--mn)", color: "#00e6a8"}}>{ef(tot)}</strong></span>
    <button className="BA" style={{background: "rgba(240,64,96,.06)", color: "#f04060", border: "1px solid rgba(240,64,96,.1)"}} onClick={() => setCfm(true)}>Borrar todo</button></div>
    {S.history.map(h => { const r = h.savingsRate || 0; const rc = r >= 20 ? "#00e6a8" : r >= 10 ? "#f5a020" : "#f04060";
      const rb = r >= 20 ? "rgba(0,230,168,.06)" : r >= 10 ? "rgba(245,160,32,.06)" : "rgba(240,64,96,.06)";
      return (<div key={h.id} className="HC"><div className="HM">{h.label}</div>
        {h.persons && h.persons.map(pp => <div key={pp.name} className="HR"><span className="HLB">{pp.name}</span><span className="HVL">{ef(pp.income)}</span></div>)}
        <div className="HR"><span className="HLB">Ingresos</span><span className="HVL">{ef(h.totalIncome)}</span></div>
        <div className="HR"><span className="HLB">Gastos</span><span className="HVL">{ef(h.totalExpenses)}</span></div>
        <div className="HR"><span className="HLB">Ahorro</span><span className="HVL" style={{color: "#00e6a8"}}>{ef(h.totalAho)}</span></div>
        <div className="HR"><span className="HLB">Balance</span><span className="HVL" style={{color: h.balance >= 0 ? "#00e6a8" : "#f04060"}}>{ef(h.balance)}</span></div>
        <span className="HPL" style={{background: rb, color: rc}}>{r}% ahorro</span></div>); })}
    {cfm && <Cfm title="¿Borrar historial?" sub="Se eliminarán todos los registros" onOk={() => { upS({history: []}); toast("Historial borrado"); setCfm(false); }} onCancel={() => setCfm(false)} />}
  </div>); }

export function SvDlg({S, onClose, onSave}) { const b0 = pBal(S, 0), b1 = pBal(S, 1), jt = jTot(S); const tI = b0.inc + b1.inc, tA = b0.gc + b1.gc + jt.jgc, tE = b0.exp + b1.exp + jt.total, bal = tI - tE;
  const rate = tI > 0 ? Math.round(tA / tI * 100) : 0;
  return (<div className="SVD" onClick={onClose}><div className="SVB" onClick={e => e.stopPropagation()}>
    <div className="SVT">Guardar {MES[S.month]} {S.year}</div>
    {S.persons.map(p => <div key={p.id} className="SVR"><span style={{color: "var(--t2)"}}>{p.name}</span><span style={{fontFamily: "var(--mn)"}}>{ef(pInc(p))}</span></div>)}
    <div className="SVR"><span style={{color: "var(--t2)"}}>Ingresos</span><span style={{fontFamily: "var(--mn)"}}>{ef(tI)}</span></div>
    <div className="SVR"><span style={{color: "var(--t2)"}}>Gastos</span><span style={{fontFamily: "var(--mn)"}}>{ef(tE)}</span></div>
    <div className="SVR"><span style={{color: "var(--t2)"}}>Ahorro</span><span style={{fontFamily: "var(--mn)", color: "#00e6a8"}}>{ef(tA)} ({rate}%)</span></div>
    <div className="SVR"><span>Balance</span><span style={{color: bal >= 0 ? "#00e6a8" : "#f04060", fontFamily: "var(--mn)"}}>{ef(bal)}</span></div>
    <div className="SVN">El mes avanza. Deudas, terrenos y ahorros se actualizan.</div>
    <div style={{display: "flex", gap: 8}}><button className="BS" onClick={onClose}>Cancelar</button><button className="BP" onClick={onSave}>Confirmar →</button></div>
  </div></div>); }
