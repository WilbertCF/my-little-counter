import { db } from "../firebase.js";
import {
  doc, getDoc, setDoc,
} from "firebase/firestore";

// ──────────────────────────────────────────────────────
// STORAGE — localStorage (guest) + Firestore (users)
// ──────────────────────────────────────────────────────
export const lsGet = k => { try { const v = localStorage.getItem(k); return v ? JSON.parse(v) : null; } catch { return null; } };
export const lsSet = (k, v) => { try { localStorage.setItem(k, JSON.stringify(v)); return true; } catch { return false; } };
export const lsDel = k => { try { localStorage.removeItem(k); return true; } catch { return false; } };

export const fsGet = async uid => { try { const s = await getDoc(doc(db, "users", uid)); return s.exists() ? s.data() : null; } catch { return null; } };
export const fsSet = async (uid, data) => { try { await setDoc(doc(db, "users", uid), data, { merge: true }); return true; } catch { return false; } };
export const fsHouseGet = async sk => { try { const s = await getDoc(doc(db, "households", sk)); return s.exists() ? s.data() : null; } catch { return null; } };
export const fsHouseSet = async (sk, data) => { try { await setDoc(doc(db, "households", sk), data, { merge: true }); return true; } catch { return false; } };

// Directorio mínimo email -> { uid, displayName }. Permite buscar pareja sin listar la
// colección "users" (que guarda las finanzas). No contiene datos sensibles. Ver firestore.rules.
export const emailKey = e => (e || "").toLowerCase().trim();
export const fsEmailGet = async e => { try { const s = await getDoc(doc(db, "emailIndex", emailKey(e))); return s.exists() ? s.data() : null; } catch { return null; } };
export const fsEmailSet = async (e, uid, displayName) => { try { await setDoc(doc(db, "emailIndex", emailKey(e)), { uid, displayName }, { merge: true }); return true; } catch { return false; } };

export const buildProfile = async fbUser => {
  const data = await fsGet(fbUser.uid) || {};
  const name = fbUser.displayName || data.displayName || "Usuario";
  // Asegura/migra el índice de email para cuentas creadas antes de este cambio.
  if (fbUser.email) fsEmailSet(fbUser.email, fbUser.uid, name);
  return { uid: fbUser.uid, email: fbUser.email, name, partnerId: data.partnerId || null };
};
