import { useState, useEffect } from "react";
import { Link2, Check, AlertTriangle } from "lucide-react";
import { fsGet, fsSet, fsHouseGet, fsHouseSet, fsEmailGet } from "../lib/storage.js";

// ──────────────────────────────────────────────────────
// PARTNER LINK
// ──────────────────────────────────────────────────────
export function PLink({user, S, upS, toast, onPartnerLinked}) {
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
