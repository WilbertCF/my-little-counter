// ──────────────────────────────────────────────────────
// CONSTANTS
// ──────────────────────────────────────────────────────
export const MES=["Enero","Febrero","Marzo","Abril","Mayo","Junio","Julio","Agosto","Septiembre","Octubre","Noviembre","Diciembre"];
export const M3=["Ene","Feb","Mar","Abr","May","Jun","Jul","Ago","Sep","Oct","Nov","Dic"];
export const C=[{main:"#00e6a8",d:"rgba(0,230,168,.10)",m:"rgba(0,230,168,.25)"},{main:"#f5a020",d:"rgba(245,160,32,.10)",m:"rgba(245,160,32,.25)"},{main:"#5b9cf6",d:"rgba(91,156,246,.10)",m:"rgba(91,156,246,.25)"},{main:"#b49dfa",d:"rgba(180,157,250,.10)",m:"rgba(180,157,250,.25)"},{main:"#f87171",d:"rgba(248,113,113,.10)",m:"rgba(248,113,113,.25)"}];
export const GICONS=["🛡","✈","⚡","★","🏠","🎓","💰","🚗","🎁","💊"];
export const DICONS=["💳","🏦","📋","💼","🧾","💵","📌","⚠"];
export const LICONS=["🏡","🌍","🏠","🏗","🗺","📍","🏞","🌿"];
export const ICOLORS=["#f04060","#f5a020","#00e6a8","#5b9cf6","#b49dfa","#f87171","#34d399","#fb923c"];
export const NOW=new Date();
export const EMPTY={year:NOW.getFullYear(),month:NOW.getMonth(),
  persons:[{id:"p0",name:"Persona 1",ci:0,mode:"mensual",sal:0,extra:0,rate:80,days:22,extraD:0,exp:{movil:0,ocio:0,ropa:0,otros:0}},
    {id:"p1",name:"Persona 2",ci:1,mode:"mensual",sal:0,extra:0,rate:90,days:22,extraD:0,exp:{movil:0,ocio:0,ropa:0,otros:0}}],
  joint:{fixed:{alquiler:0,suministros:0,internet:0,seguros:0,streaming:0,sus:0},variable:{compras:0,higiene:0,restaurantes:0,transporte:0,otros:0}},
  debts:[],lands:[],goals:[],history:[]};
