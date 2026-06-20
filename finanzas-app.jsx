import { useState, useEffect, useCallback, useRef, lazy, Suspense } from "react";
import { Home, Users, Clock, ChevronLeft, ChevronRight, Plus, X, LogOut, Link2, Eye, EyeOff, Check, AlertTriangle, User, Mail, Lock, Zap, Shield, Heart } from "lucide-react";
import logoSrc from "./logo.jpeg";
import { auth } from "./src/firebase.js";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  updateProfile,
} from "firebase/auth";
import {
  cl, ef, ep, ini, pInc, pExp, pDC, pGA, jTot, pBal,
} from "./src/utils/calculations.js";
import {
  MES, M3, C, GICONS, DICONS, LICONS, ICOLORS, NOW, EMPTY,
} from "./src/constants.js";
import { uid, oInf } from "./src/lib/helpers.js";
import {
  lsGet, lsSet, lsDel, fsGet, fsSet, fsHouseGet, fsHouseSet, fsEmailGet, fsEmailSet, buildProfile,
} from "./src/lib/storage.js";
import { CSS, mkCSS, THEMES } from "./src/ui/styles.js";

const DashPie = lazy(() => import("./src/components/DashCharts.jsx").then(m => ({ default: m.DashPie })));
const DashBar = lazy(() => import("./src/components/DashCharts.jsx").then(m => ({ default: m.DashBar })));

// ──────────────────────────────────────────────────────
// FIXED NUMBER INPUT — local state + onBlur
// ──────────────────────────────────────────────────────
function NI({value, onChange, step = 10, min = 0}) {
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
function Tst({msg, show}) { if (!show) return null; return <div className="TC"><div className="TO">{msg}</div></div>; }
function Cfm({title, sub, onOk, onCancel}) { return (<div className="CFD" onClick={onCancel}><div className="CFB" onClick={e => e.stopPropagation()}>
  <div className="CFT">{title}</div><div className="CFS">{sub}</div>
  <div style={{display: "flex", gap: 8}}><button className="BS" onClick={onCancel}>No</button>
  <button className="BP" style={{background: "linear-gradient(135deg,#f04060,#d03050)"}} onClick={onOk}>Sí, eliminar</button></div></div></div>); }
function OBdg({S, o}) { const i = oInf(S, o); return <span className="OB" style={{background: i.bg, color: i.color, border: `1px solid ${i.bd}`}}>{i.text}</span>; }
function KPI({l, v, s, t = "ok"}) { return (<div className={`KP k${t}`}><div className="KL">{l}</div><div className="KV">{v}</div>{s && <div className="KS">{s}</div>}</div>); }
function FR({l, v, onChange, step = 10, min = 0}) { return (<div className="DR"><span className="DL">{l}</span><NI value={v} onChange={onChange} step={step} min={min} /></div>); }
function DRw({l, v, c}) { return <div className="DR"><span className="DL">{l}</span><span className="DV" style={c ? {color: c} : undefined}>{v}</span></div>; }
function PBr({l, p, c}) { return (<div className="PW"><div className="PH"><span className="PLB">{l}</span><span className="PP">{ep(p)}</span></div>
  <div className="PT"><div className="PF" style={{width: `${p}%`, background: c, boxShadow: `0 0 6px ${c}44`}} /></div></div>); }

// ──────────────────────────────────────────────────────
// ITEM CARDS
// ──────────────────────────────────────────────────────
function DCd({d, S, upD, rmD}) { const pc = d.cap > 0 ? cl((d.cap - d.sal) / d.cap * 100, 0, 100) : 0; const co = d.color || "#f04060"; return (
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

function LCd({l, S, upL, rmL}) { const pc = l.pre > 0 ? cl(l.pag / l.pre * 100, 0, 100) : 0; const sa = Math.max(0, l.pre - l.pag); const pl = l.val - l.pre; const co = l.color || "#00e6a8"; return (
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

function GCd({g, S, upG, rmG}) { const p = g.obj > 0 ? cl(g.act / g.obj * 100, 0, 100) : 0; const f = Math.max(0, g.obj - g.act);
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

// ──────────────────────────────────────────────────────
// ADD MODAL
// ──────────────────────────────────────────────────────
function AddM({type, defOwner, S, onClose, onAdd}) {
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

// ──────────────────────────────────────────────────────
// LOGIN — premium with guest mode
// ──────────────────────────────────────────────────────
function Login({onLogin, onGuest}) {
  const [mode, setMode] = useState("login");
  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");
  const [name, setName] = useState("");
  const [showP, setShowP] = useState(false);
  const [err, setErr] = useState("");
  const [ld, setLd] = useState(false);

  const go = async () => {
    setErr("");
    if (!email.trim() || !pass.trim()) { setErr("Completa todos los campos"); return; }
    if (!/\S+@\S+\.\S+/.test(email)) { setErr("Email no válido"); return; }
    if (pass.length < 6) { setErr("Mínimo 6 caracteres"); return; }
    if (mode === "register" && !name.trim()) { setErr("Ingresa tu nombre"); return; }
    setLd(true);
    try {
      if (mode === "register") {
        const cred = await createUserWithEmailAndPassword(auth, email.trim(), pass);
        await updateProfile(cred.user, { displayName: name.trim() });
        await fsSet(cred.user.uid, { email: email.toLowerCase().trim(), displayName: name.trim(), partnerId: null });
        await fsEmailSet(email, cred.user.uid, name.trim());
        // onLogin will be called via onAuthStateChanged in App
      } else {
        await signInWithEmailAndPassword(auth, email.trim(), pass);
        // onLogin will be called via onAuthStateChanged in App
      }
    } catch (e) {
      const m = { "auth/user-not-found": "No existe cuenta con ese email", "auth/wrong-password": "Contraseña incorrecta",
        "auth/email-already-in-use": "Email ya registrado", "auth/invalid-email": "Email no válido",
        "auth/invalid-credential": "Email o contraseña incorrectos" };
      setErr(m[e.code] || "Error de conexión");
      setLd(false);
    }
  };

  return (
    <div className="A">
      <style>{CSS}</style>
      <div className="LG">
        {/* Logo */}
        <div className="lg-c">
          <img src={logoSrc} alt="My Little Counter" className="lg-logo" />
        </div>

        <div className="LGB">
          <div className="LGT">My Little Counter</div>
          <div className="LGS">Gestiona las finanzas en pareja, juntos</div>

          {/* Tab toggle */}
          <div className="lg-tabs">
            <button className={`lg-tab ${mode === "login" ? "on" : ""}`} onClick={() => { setMode("login"); setErr(""); }}>Iniciar sesión</button>
            <button className={`lg-tab ${mode === "register" ? "on" : ""}`} onClick={() => { setMode("register"); setErr(""); }}>Crear cuenta</button>
          </div>

          {err && <div className="LGE">{err}</div>}

          {mode === "register" && (
            <div className="lg-f">
              <div className="lg-ico"><User size={16} /></div>
              <input className="LGI" placeholder="Tu nombre" value={name} onChange={e => setName(e.target.value)} />
            </div>
          )}

          <div className="lg-f">
            <div className="lg-ico"><Mail size={16} /></div>
            <input className="LGI" type="email" placeholder="Correo electrónico" value={email} onChange={e => setEmail(e.target.value)} autoCapitalize="none" />
          </div>

          <div className="lg-f">
            <div className="lg-ico"><Lock size={16} /></div>
            <div className="LGPW">
              <input className="LGI" type={showP ? "text" : "password"} placeholder="Contraseña" value={pass}
                onChange={e => setPass(e.target.value)} onKeyDown={e => { if (e.key === "Enter") go(); }} />
              <button className="LGPE" onClick={() => setShowP(!showP)}>{showP ? <EyeOff size={16} /> : <Eye size={16} />}</button>
            </div>
          </div>

          <button className="lg-btn" onClick={go} disabled={ld}>
            {ld ? "Verificando..." : (mode === "login" ? "Entrar a mi hogar →" : "Comenzar juntos →")}
          </button>

          {/* Guest mode */}
          <div className="lg-or"><span>o bien</span></div>
          <button className="lg-guest" onClick={onGuest}>
            <Zap size={14} /> Continuar sin cuenta
          </button>
        </div>

        {/* Feature icons */}
        <div className="lg-ft">
          <div className="lg-ft-i"><div className="lg-ft-ic"><Shield size={16} /></div><div className="lg-ft-t">Seguro</div></div>
          <div className="lg-ft-i"><div className="lg-ft-ic"><Link2 size={16} /></div><div className="lg-ft-t">Vinculado</div></div>
          <div className="lg-ft-i"><div className="lg-ft-ic"><Heart size={16} /></div><div className="lg-ft-t">En pareja</div></div>
        </div>
      </div>
    </div>
  );
}

// ──────────────────────────────────────────────────────
// PARTNER LINK
// ──────────────────────────────────────────────────────
function PLink({user, S, upS, toast, onPartnerLinked}) {
  const [pe, setPe] = useState(""); const [st, setSt] = useState(null); const [pn, setPn] = useState(""); const [sy, setSy] = useState(false);
  useEffect(() => {
    if (user?.partnerId) {
      (async () => {
        const d = await fsGet(user.partnerId);
        if (d) { setPn(d.displayName || "Pareja"); setSt("linked"); }
      })();
    }
  }, [user?.partnerId]);
  if (!user) return null;
  const houseKey = partnerId => [user.uid, partnerId].sort().join("_");
  const link = async () => {
    if (!pe.trim() || !/\S+@\S+\.\S+/.test(pe)) { toast("Email no válido"); return; }
    const e = pe.toLowerCase().trim();
    if (e === user.email) { toast("No puedes vincularte contigo"); return; }
    const idx = await fsEmailGet(e);
    if (!idx || !idx.uid) { toast("No existe esa cuenta"); setSt("error"); return; }
    const partnerId = idx.uid; const partnerData = { displayName: idx.displayName };
    await fsSet(user.uid, { partnerId });
    await fsSet(partnerId, { partnerId: user.uid });
    const sk = houseKey(partnerId);
    await fsHouseSet(sk, { appData: S });
    setPn(partnerData.displayName || "Pareja"); setSt("linked");
    onPartnerLinked && onPartnerLinked(partnerId);
    toast("✓ Vinculado con " + (partnerData.displayName || "Pareja"));
  };
  const sync = async () => {
    if (!user.partnerId) return; setSy(true);
    const sk = houseKey(user.partnerId);
    const d = await fsHouseGet(sk);
    if (d && d.appData) { upS(d.appData); toast("✓ Sincronizado"); }
    else { await fsHouseSet(sk, { appData: S }); toast("✓ Datos enviados"); }
    setSy(false);
  };
  const push = async () => {
    if (!user.partnerId) return;
    const sk = houseKey(user.partnerId);
    await fsHouseSet(sk, { appData: S }); toast("✓ Enviado");
  };
  return (<div className="LNK"><div className="LNKT"><Link2 size={13} /> Vincular pareja</div>
    {st === "linked" ? (<><div className="LNKST LSok"><Check size={11} /> Vinculado con <strong style={{marginLeft: 3}}>{pn}</strong></div>
      <div style={{display: "flex", gap: 5, marginTop: 8}}><button className="BA" style={{background: "rgba(0,230,168,.06)", color: "#00e6a8", border: "1px solid rgba(0,230,168,.1)", flex: 1}}
        onClick={sync} disabled={sy}>{sy ? "..." : "↓ Recibir"}</button>
        <button className="BA" style={{background: "rgba(91,156,246,.06)", color: "#5b9cf6", border: "1px solid rgba(91,156,246,.1)", flex: 1}} onClick={push}>↑ Enviar</button></div>
    </>) : (<><div className="LNKS">Email de tu pareja para compartir datos.</div>
      <input className="LNKI" type="email" placeholder="email@pareja.com" value={pe} onChange={e => setPe(e.target.value)} autoCapitalize="none" />
      <button className="BP" style={{fontSize: 11, padding: "9px"}} onClick={link}>Vincular</button>
      {st === "error" && <div className="LNKST LSwt"><AlertTriangle size={11} /> No encontrada</div>}</>)}</div>);
}

// ──────────────────────────────────────────────────────
// ALL TABS (Dashboard, Personal, Joint, History)
// ──────────────────────────────────────────────────────
function DashT({S}) { const b0 = pBal(S, 0), b1 = pBal(S, 1), jt = jTot(S); const tI = b0.inc + b1.inc, tE = b0.exp + b1.exp + jt.total, tA = b0.gc + b1.gc + jt.jgc, bal = tI - tE;
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

function PersT({S, idx, upS, toast}) { const p = S.persons[idx], c = C[p.ci]; const inc = pInc(p), exp = pExp(p), dc = pDC(S.debts, p.id), gc = pGA(S.goals, p.id), net = inc - exp - dc - gc;
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

function JntT({S, upS, toast}) { const jf = S.joint.fixed, jv = S.joint.variable, jt = jTot(S); const b0 = pBal(S, 0), b1 = pBal(S, 1), tI = b0.inc + b1.inc;
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

function HistT({S, upS, toast}) { const [cfm, setCfm] = useState(false);
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

function SvDlg({S, onClose, onSave}) { const b0 = pBal(S, 0), b1 = pBal(S, 1), jt = jTot(S); const tI = b0.inc + b1.inc, tA = b0.gc + b1.gc + jt.jgc, tE = b0.exp + b1.exp + jt.total, bal = tI - tE;
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

// ──────────────────────────────────────────────────────
// MAIN APP
// ──────────────────────────────────────────────────────
export default function App() {
  const [user, setUser] = useState(null);      // null = not logged in, object = logged in, "guest" = guest
  const [authLd, setAuthLd] = useState(true);
  const [S, setS] = useState(EMPTY);
  const [tab, setTab] = useState(0);
  const [loaded, setLoaded] = useState(false);
  const [tMsg, setTMsg] = useState("");
  const [tShow, setTShow] = useState(false);
  const [showSave, setShowSave] = useState(false);
  const [showPick, setShowPick] = useState(false);
  const [pY, setPY] = useState(NOW.getFullYear());
  const [accentIdx, setAccentIdx] = useState(() => { try { const n = parseInt(localStorage.getItem("accentIdx")); return !isNaN(n) && n >= 0 && n < THEMES.length ? n : 0; } catch { return 0; } });
  const [showTheme, setShowTheme] = useState(false);
  const setTheme = i => { setAccentIdx(i); try { localStorage.setItem("accentIdx", i); } catch {} };
  const tR = useRef(null);

  // Firebase auth listener — replaces session check
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async fbUser => {
      if (fbUser) {
        const profile = await buildProfile(fbUser);
        setUser(profile);
      } else {
        // Check guest mode in localStorage
        if (lsGet("guestMode")) { setUser("guest"); }
        else { setUser(null); }
      }
      setAuthLd(false);
    });
    return unsub;
  }, []);

  // Load data after auth
  useEffect(() => {
    if (!user) return;
    (async () => {
      if (user === "guest") {
        const d = lsGet("data:guest");
        if (d) setS(prev => ({...prev, ...d}));
      } else if (user.partnerId) {
        const sk = [user.uid, user.partnerId].sort().join("_");
        const hd = await fsHouseGet(sk);
        if (hd && hd.appData) { setS(prev => ({...prev, ...hd.appData})); setLoaded(true); return; }
        const ud = await fsGet(user.uid);
        if (ud && ud.appData) setS(prev => ({...prev, ...ud.appData}));
      } else {
        const ud = await fsGet(user.uid);
        if (ud && ud.appData) setS(prev => ({...prev, ...ud.appData}));
      }
      setLoaded(true);
    })();
  }, [user]);

  // Auto-save
  useEffect(() => {
    if (!loaded || !user) return;
    const t = setTimeout(async () => {
      if (user === "guest") {
        lsSet("data:guest", S);
      } else {
        await fsSet(user.uid, { appData: S });
        if (user.partnerId) {
          const sk = [user.uid, user.partnerId].sort().join("_");
          await fsHouseSet(sk, { appData: S });
        }
      }
    }, 600);
    return () => clearTimeout(t);
  }, [S, loaded, user]);

  const upS = useCallback(p => setS(prev => ({...prev, ...p})), []);
  const toast = useCallback(m => { setTMsg(m); setTShow(true); clearTimeout(tR.current); tR.current = setTimeout(() => setTShow(false), 2500); }, []);
  const shM = d => { let m = S.month + d, y = S.year; if (m > 11) { m = 0; y++; } if (m < 0) { m = 11; y--; } upS({month: m, year: y}); setPY(y); };
  const doSave = () => {
    const b0 = pBal(S, 0), b1 = pBal(S, 1), jt = jTot(S); const tI = b0.inc + b1.inc, tA = b0.gc + b1.gc + jt.jgc, tE = b0.exp + b1.exp + jt.total, bal = tI - tE;
    const snap = {id: S.year + "-" + String(S.month).padStart(2, "0"), label: MES[S.month] + " " + S.year, year: S.year, month: S.month, savedAt: Date.now(),
      persons: S.persons.map(p => ({name: p.name, income: pInc(p)})), totalIncome: tI, totalExpenses: tE, totalAho: tA, balance: bal,
      savingsRate: tI > 0 ? Math.round(tA / tI * 100) : 0};
    let nm = S.month + 1, ny = S.year; if (nm > 11) { nm = 0; ny++; }
    upS({history: [snap, ...(S.history || []).filter(h => h.id !== snap.id)],
      debts: S.debts.map(d => ({...d, sal: Math.max(0, (d.sal || 0) - (d.cuo || 0)), mes: Math.max(0, (d.mes || 1) - 1)})),
      lands: S.lands.map(l => ({...l, pag: Math.min(l.pre || 0, (l.pag || 0) + (l.cuo || 0))})),
      goals: S.goals.map(g => ({...g, act: Math.min(g.obj || 0, (g.act || 0) + (g.apo || 0))})), month: nm, year: ny});
    setShowSave(false); toast("✓ " + snap.label + " guardado");
  };

  const handleLogin = () => {}; // handled by onAuthStateChanged
  const handleGuest = () => { lsSet("guestMode", true); setUser("guest"); };
  const handleLogout = async () => {
    if (user === "guest") { lsDel("guestMode"); lsDel("data:guest"); }
    else { await signOut(auth); }
    setUser(null); setS(EMPTY); setLoaded(false); setTab(0);
  };
  const handlePartnerLinked = partnerId => setUser(prev => prev && prev !== "guest" ? {...prev, partnerId} : prev);

  // Loading
  if (authLd) return (<div className="A"><style>{CSS}</style><div style={{display: "flex", alignItems: "center", justifyContent: "center", minHeight: "100vh", color: "var(--t3)", fontFamily: "var(--ui)"}}>
    <div style={{textAlign: "center"}}><div style={{fontSize: 32, marginBottom: 8}}>💰</div><div style={{fontSize: 13}}>Cargando...</div></div></div></div>);

  // Login
  if (!user) return <Login onLogin={handleLogin} onGuest={handleGuest} />;

  const n0 = S.persons[0].name.split(" ")[0], n1 = S.persons[1].name.split(" ")[0];
  const tabs = [{l: "Inicio", i: <Home size={19} />}, {l: n0, i: <div className="NV" style={{background: C[S.persons[0].ci].d, color: C[S.persons[0].ci].main}}>{ini(S.persons[0].name)}</div>},
    {l: n1, i: <div className="NV" style={{background: C[S.persons[1].ci].d, color: C[S.persons[1].ci].main}}>{ini(S.persons[1].name)}</div>},
    {l: "Conjunto", i: <Users size={19} />}, {l: "Historial", i: <Clock size={19} />}];

  return (
    <div className="A"><style>{mkCSS(THEMES[accentIdx])}</style><div className="SH">
      {/* User bar */}
      <div className="UB">
        <div className="UA" style={{background: C[0].d, color: C[0].main}}>{user === "guest" ? "👤" : ini(user.name)}</div>
        <span className="UE">{user === "guest" ? "Modo invitado" : user.email}</span>
        <button className="ULO" onClick={handleLogout}><LogOut size={11} /> Salir</button>
      </div>

      {/* Header */}
      <header className="HD"><div className="HL"><div className="MG">{ini(n0)}</div><div><div className="HT">{n0} & {n1}</div><div className="HS">{MES[S.month]} {S.year}</div></div></div>
        <div style={{display: "flex", alignItems: "center", gap: 5}}>
          <div style={{position: "relative"}}><div className="MN"><button className="MA" onClick={() => shM(-1)}><ChevronLeft size={12} /></button>
            <div className="MC" onClick={() => { setPY(S.year); setShowPick(!showPick); }}><div className="ML">{M3[S.month]}</div><div className="MY">{S.year} ▾</div></div>
            <button className="MA" onClick={() => shM(1)}><ChevronRight size={12} /></button></div>
            {showPick && <div className="MP" onClick={e => e.stopPropagation()}><div className="MPY"><button className="MPYB" onClick={() => setPY(pY - 1)}>‹</button>
              <span className="MPYL">{pY}</span><button className="MPYB" onClick={() => setPY(pY + 1)}>›</button></div>
              <div className="MPG">{M3.map((m, i) => <button key={i} className={`MPM ${S.year === pY && S.month === i ? "on" : ""}`}
                onClick={() => { upS({month: i, year: pY}); setShowPick(false); }}>{m}</button>)}</div></div>}</div>
          {/* Theme picker */}
          <div style={{position: "relative"}}>
            <button className="BA" onClick={() => setShowTheme(!showTheme)}
              style={{fontSize: 15, padding: "5px 9px", background: "var(--lf)", border: `1px solid ${THEMES[accentIdx].hex}44`, color: THEMES[accentIdx].hex, borderRadius: 999}}>🎨</button>
            {showTheme && (
              <div style={{position: "absolute", right: 0, top: "calc(100% + 6px)", background: "var(--cd)", border: "1px solid var(--b1)", borderRadius: 16, padding: "12px 14px", zIndex: 400, boxShadow: "0 18px 50px rgba(0,0,0,.65)", minWidth: 170, animation: "fi .15s ease"}}
                onClick={e => e.stopPropagation()}>
                <div style={{fontSize: 9, color: "var(--t3)", fontWeight: 600, letterSpacing: ".7px", textTransform: "uppercase", marginBottom: 10}}>Color de acento</div>
                <div style={{display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 8}}>
                  {THEMES.map((t, i) => (
                    <button key={i} onClick={() => { setTheme(i); setShowTheme(false); }} title={t.name}
                      style={{width: 30, height: 30, borderRadius: "50%", border: accentIdx === i ? "2.5px solid #fff" : "2.5px solid transparent",
                        background: t.hex, cursor: "pointer", outline: accentIdx === i ? `3px solid ${t.hex}66` : "none",
                        transform: accentIdx === i ? "scale(1.18)" : "scale(1)", transition: "all .15s"}} />
                  ))}
                </div>
                <div style={{marginTop: 10, fontSize: 10, color: "var(--t2)", textAlign: "center"}}>{THEMES[accentIdx].name}</div>
              </div>
            )}
          </div>
          <button className="BA" style={{background: `linear-gradient(135deg,${THEMES[accentIdx].hex},${THEMES[accentIdx].dark})`, color: "#050709", border: "none", fontSize: 10, padding: "7px 12px"}}
            onClick={() => setShowSave(true)}>Guardar →</button></div></header>

      {/* Partner link — only for logged in users */}
      {tab === 0 && user !== "guest" && <div style={{marginTop: 8}}><PLink user={user} S={S} upS={upS} toast={toast} onPartnerLinked={handlePartnerLinked} /></div>}

      {/* Tabs */}
      {tab === 0 && <DashT S={S} />}
      {tab === 1 && <PersT S={S} idx={0} upS={upS} toast={toast} />}
      {tab === 2 && <PersT S={S} idx={1} upS={upS} toast={toast} />}
      {tab === 3 && <JntT S={S} upS={upS} toast={toast} />}
      {tab === 4 && <HistT S={S} upS={upS} toast={toast} />}
    </div>

    <nav className="BN">{tabs.map((t, i) => <button key={i} className={`NB ${tab === i ? "on" : ""}`}
      onClick={() => { setTab(i); setShowPick(false); window.scrollTo({top: 0, behavior: "smooth"}); }}>{t.i}<span style={{fontSize: 9}}>{t.l}</span></button>)}</nav>

    {showSave && <SvDlg S={S} onClose={() => setShowSave(false)} onSave={doSave} />}
    <Tst msg={tMsg} show={tShow} />
    {showPick && <div style={{position: "fixed", inset: 0, zIndex: 299}} onClick={() => setShowPick(false)} />}
    {showTheme && <div style={{position: "fixed", inset: 0, zIndex: 399}} onClick={() => setShowTheme(false)} />}
    </div>
  );
}
