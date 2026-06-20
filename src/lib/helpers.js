import { C } from "../constants.js";

export const uid=()=>Date.now().toString(36)+Math.random().toString(36).slice(2,6);

// ──────────────────────────────────────────────────────
// PRESENTATION HELPERS
// ──────────────────────────────────────────────────────
export function oInf(S,o){if(o==="joint")return{text:"Conjunto",color:"#5b9cf6",bg:"rgba(91,156,246,.10)",bd:"rgba(91,156,246,.25)"};
  const p=S.persons.find(x=>x.id===o);if(!p)return{text:"—",color:"#3d4f6a",bg:"rgba(255,255,255,.05)",bd:"rgba(255,255,255,.08)"};
  const c=C[p.ci];return{text:p.name.split(" ")[0],color:c.main,bg:c.d,bd:c.m};}
