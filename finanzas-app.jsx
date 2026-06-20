import { useState, useEffect, useCallback, useRef } from "react";
import { Home, Users, Clock, ChevronLeft, ChevronRight, LogOut } from "lucide-react";
import { auth } from "./src/firebase.js";
import {
  signOut,
  onAuthStateChanged,
} from "firebase/auth";
import {
  ini, pInc, jTot, pBal,
} from "./src/utils/calculations.js";
import {
  MES, M3, C, NOW, EMPTY,
} from "./src/constants.js";
import {
  lsGet, lsSet, lsDel, fsGet, fsSet, fsHouseGet, fsHouseSet, buildProfile,
} from "./src/lib/storage.js";
import { CSS, mkCSS, THEMES } from "./src/ui/styles.js";
import { Tst } from "./src/components/primitives.jsx";
import { Login } from "./src/components/Login.jsx";
import { PLink } from "./src/components/PartnerLink.jsx";
import { DashT, PersT, JntT, HistT, SvDlg } from "./src/components/tabs.jsx";

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
