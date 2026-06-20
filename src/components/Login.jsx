import { useState } from "react";
import { User, Mail, Lock, Eye, EyeOff, Zap, Shield, Link2, Heart } from "lucide-react";
import logoSrc from "../../logo.jpeg";
import { auth } from "../firebase.js";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  updateProfile,
} from "firebase/auth";
import { fsSet, fsEmailSet } from "../lib/storage.js";
import { CSS } from "../ui/styles.js";

// ──────────────────────────────────────────────────────
// LOGIN — premium with guest mode
// ──────────────────────────────────────────────────────
export function Login({onLogin, onGuest}) {
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
