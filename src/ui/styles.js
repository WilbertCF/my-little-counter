// ──────────────────────────────────────────────────────
// GLOBAL STYLES
// ──────────────────────────────────────────────────────
export const CSS = `
@import url('https://fonts.googleapis.com/css2?family=DM+Mono:wght@400;500&family=Outfit:wght@400;500;600;700;800&family=Syne:wght@700;800&display=swap');
:root{--bg:#050709;--cd:#0b0e18;--lf:#101524;--b0:rgba(255,255,255,.04);--b1:rgba(255,255,255,.07);--b2:rgba(255,255,255,.12);
--t1:#e4eaf6;--t2:#7b8baa;--t3:#3a4862;--ok:#00e6a8;--wn:#f5a020;--ng:#f04060;--bl:#5b9cf6;
--ui:'Outfit',system-ui,sans-serif;--mn:'DM Mono',monospace;--dp:'Syne',sans-serif;--sb:env(safe-area-inset-bottom,0px)}
*{box-sizing:border-box;margin:0;padding:0;-webkit-tap-highlight-color:transparent}
.A{font-family:var(--ui);background:var(--bg);color:var(--t1);min-height:100vh;-webkit-font-smoothing:antialiased;
background-image:radial-gradient(ellipse 80% 50% at 50% -20%,rgba(0,230,168,.02),transparent)}
.A ::selection{background:rgba(0,230,168,.18)}
.SH{max-width:600px;margin:0 auto;padding:0 16px;padding-bottom:calc(84px + var(--sb))}
@keyframes fi{from{opacity:0}to{opacity:1}}
@keyframes su{from{transform:translateY(100%)}to{transform:translateY(0)}}
@keyframes fu{from{opacity:0;transform:translateY(16px)}to{opacity:1;transform:translateY(0)}}

/* ═══ NAV ═══ */
.BN{position:fixed;bottom:0;left:0;right:0;z-index:100;background:rgba(11,14,24,.92);backdrop-filter:blur(24px) saturate(1.6);
border-top:1px solid var(--b0);padding-bottom:var(--sb);display:flex;justify-content:space-around}
.NB{flex:1;display:flex;flex-direction:column;align-items:center;gap:2px;padding:9px 4px 7px;background:none;border:none;
color:var(--t3);font-family:var(--ui);font-size:9px;font-weight:500;cursor:pointer;position:relative;transition:color .2s}
.NB.on{color:var(--ok)}.NB.on::before{content:'';position:absolute;top:0;left:28%;right:28%;height:2px;background:var(--ok);border-radius:0 0 2px 2px}
.NB svg{width:20px;height:20px}
.NV{width:22px;height:22px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-family:var(--mn);font-size:9px;font-weight:500}

/* ═══ HEADER ═══ */
.HD{display:flex;align-items:center;justify-content:space-between;padding:14px 0 12px;border-bottom:1px solid var(--b0);gap:8px;flex-wrap:wrap}
.HL{display:flex;align-items:center;gap:10px}
.MG{width:40px;height:40px;border-radius:12px;display:flex;align-items:center;justify-content:center;font-family:var(--dp);
font-size:14px;color:#050709;background:linear-gradient(135deg,#00e6a8,#f5a020);box-shadow:0 3px 14px rgba(0,230,168,.22);flex-shrink:0}
.HT{font-family:var(--dp);font-size:18px;font-weight:700;line-height:1}
.HS{font-size:10px;font-weight:500;color:var(--t3);letter-spacing:.8px;text-transform:uppercase;margin-top:3px}
.MN{display:flex;align-items:center;background:var(--lf);border:1px solid var(--b1);border-radius:999px}
.MA{width:30px;height:30px;border:none;background:transparent;color:var(--t2);display:flex;align-items:center;justify-content:center;cursor:pointer}
.MC{padding:0 2px;min-width:76px;text-align:center;cursor:pointer}
.ML{font-family:var(--mn);font-size:11px;font-weight:500}.MY{font-size:9px;color:var(--t3);margin-top:1px}

/* ═══ MONTH PICKER ═══ */
.MP{position:absolute;top:calc(100% + 6px);left:50%;transform:translateX(-50%);background:var(--cd);border:1px solid var(--b1);
border-radius:16px;padding:12px;z-index:300;min-width:210px;box-shadow:0 18px 50px rgba(0,0,0,.65);animation:fi .15s ease}
.MPY{display:flex;align-items:center;justify-content:space-between;margin-bottom:6px;padding-bottom:6px;border-bottom:1px solid var(--b0)}
.MPYL{font-family:var(--mn);font-size:13px;font-weight:500}
.MPYB{width:24px;height:24px;border-radius:50%;border:1px solid var(--b1);background:transparent;color:var(--t2);
display:flex;align-items:center;justify-content:center;font-size:13px;cursor:pointer}.MPYB:active{background:var(--b1)}
.MPG{display:grid;grid-template-columns:repeat(4,1fr);gap:3px}
.MPM{font-family:var(--ui);font-size:10px;font-weight:500;padding:7px;border-radius:8px;border:none;background:transparent;
color:var(--t2);cursor:pointer;text-align:center}.MPM:active{background:var(--b0)}.MPM.on{background:rgba(0,230,168,.1);color:#00e6a8}

/* ═══ KPI ═══ */
.KG{display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-bottom:12px}
.KP{background:var(--cd);border:1px solid var(--b0);border-radius:14px;padding:13px 14px;position:relative;overflow:hidden}
.KP::before{content:'';position:absolute;top:0;left:0;right:0;height:2.5px}
.KP.kok::before{background:linear-gradient(90deg,#00e6a8,rgba(0,230,168,.2))}
.KP.kwn::before{background:linear-gradient(90deg,#f5a020,rgba(245,160,32,.2))}
.KP.kng::before{background:linear-gradient(90deg,#f04060,rgba(240,64,96,.2))}
.KP.kbl::before{background:linear-gradient(90deg,#5b9cf6,rgba(91,156,246,.2))}
.KL{font-size:9px;font-weight:600;letter-spacing:.7px;text-transform:uppercase;color:var(--t3);margin-bottom:6px}
.KV{font-family:var(--mn);font-size:18px;font-weight:500;line-height:1}.KS{font-size:9px;color:var(--t2);margin-top:4px}

/* ═══ CARD ═══ */
.CD{background:var(--cd);border:1px solid var(--b0);border-radius:16px;padding:16px;margin-bottom:10px;overflow:hidden}
.CH{display:flex;justify-content:space-between;align-items:center;margin-bottom:12px;padding-bottom:9px;border-bottom:1px solid var(--b0)}
.CT{font-size:12px;font-weight:600}
.BG{font-family:var(--mn);font-size:9px;font-weight:500;padding:3px 9px;border-radius:999px;white-space:nowrap}
.bgok{background:rgba(0,230,168,.07);color:#00e6a8;border:1px solid rgba(0,230,168,.18)}
.bgwn{background:rgba(245,160,32,.07);color:#f5a020;border:1px solid rgba(245,160,32,.18)}
.bgng{background:rgba(240,64,96,.07);color:#f04060;border:1px solid rgba(240,64,96,.18)}

/* ═══ ROW ═══ */
.DR{display:flex;justify-content:space-between;align-items:center;padding:7px 0;border-bottom:1px solid var(--b0)}
.DR:last-child{border-bottom:none}.DL{font-size:11px;color:var(--t2);flex:1;padding-right:6px}
.DV{font-family:var(--mn);font-size:12px;font-weight:500}
.FI{width:94px;font-family:var(--mn);font-size:12px;font-weight:500;color:var(--t1);text-align:right;background:var(--lf);
border:1px solid var(--b1);border-radius:10px;padding:8px 10px;outline:none;-moz-appearance:textfield;transition:border-color .2s,box-shadow .2s}
.FI:focus{border-color:#00e6a8;box-shadow:0 0 0 3px rgba(0,230,168,.07)}
.FI::-webkit-inner-spin-button,.FI::-webkit-outer-spin-button{-webkit-appearance:none;display:none}
.TR{display:flex;justify-content:space-between;align-items:center;padding:10px 0 2px;margin-top:4px;border-top:1px solid var(--b1)}
.TRl{font-size:12px;font-weight:600}.TRv{font-family:var(--mn);font-size:17px;font-weight:500}

/* ═══ MISC ═══ */
.CB{height:7px;border-radius:4px;overflow:hidden;display:flex;gap:2px}.CS{height:100%;border-radius:4px;transition:width .5s ease}
.PW{margin:6px 0 2px}.PH{display:flex;justify-content:space-between;margin-bottom:3px}
.PLB{font-size:9px;color:var(--t2)}.PP{font-family:var(--mn);font-size:9px;font-weight:500}
.PT{height:5px;border-radius:3px;background:var(--lf);border:1px solid var(--b0);overflow:hidden}
.PF{height:100%;border-radius:3px;transition:width .5s ease}
.SR{display:flex;align-items:center;gap:8px;padding:7px 0;border-bottom:1px solid var(--b0)}.SR:last-child{border-bottom:none}
.SD{width:6px;height:6px;border-radius:50%;flex-shrink:0}.SL{font-size:11px;color:var(--t2);flex:1}
.SVl{font-family:var(--mn);font-size:11px;font-weight:500}.SP{font-size:8px;font-weight:600;padding:2px 7px;border-radius:999px;white-space:nowrap}
.SHD{display:flex;align-items:center;gap:8px;padding:11px 0 7px;margin-bottom:7px;border-bottom:2px solid}
.SI{width:28px;height:28px;border-radius:9px;display:flex;align-items:center;justify-content:center;font-size:13px;flex-shrink:0}
.STT{font-size:12px;font-weight:600}.SSB{font-size:9px;color:var(--t2);margin-top:1px}
.IC{background:var(--cd);border:1px solid var(--b0);border-radius:14px;overflow:hidden;margin-bottom:8px}
.IH{display:flex;align-items:center;padding:10px 14px;gap:7px;border-bottom:1px solid var(--b0);background:rgba(0,0,0,.1)}
.II{width:28px;height:28px;border-radius:8px;display:flex;align-items:center;justify-content:center;font-size:14px;flex-shrink:0}
.INI{font-family:var(--ui);font-size:12px;font-weight:600;color:var(--t1);background:transparent;border:none;
border-bottom:1px solid transparent;outline:none;flex:1;min-width:0}.INI:focus{border-bottom-color:#00e6a8}
.IB{padding:10px 14px}
.IF{display:flex;justify-content:space-around;padding:8px 14px;background:rgba(0,0,0,.1);border-top:1px solid var(--b0)}
.ISV{font-family:var(--mn);font-size:11px;font-weight:500;text-align:center}.ISL{font-size:8px;color:var(--t3);text-align:center;margin-top:1px}
.OB{font-size:8px;font-weight:600;padding:2px 7px;border-radius:999px;white-space:nowrap}
.DB{width:22px;height:22px;border-radius:50%;border:1px solid var(--b1);background:transparent;color:var(--t3);
display:flex;align-items:center;justify-content:center;cursor:pointer}.DB:active{color:#f04060}
.AB{display:flex;align-items:center;justify-content:center;gap:6px;border:1px dashed var(--b2);border-radius:14px;
padding:12px;margin-bottom:10px;cursor:pointer;color:var(--t2);font-size:11px;font-weight:500}.AB:active{border-color:#00e6a8;color:#00e6a8;background:rgba(0,230,168,.03)}
.PC{border-radius:16px;overflow:hidden;margin-bottom:10px;border:1px solid;background:var(--cd)}
.PTp{padding:14px 16px;display:flex;align-items:center;gap:10px}
.PAV{width:42px;height:42px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-family:var(--mn);font-size:15px;font-weight:500;flex-shrink:0;border:2px solid}
.PNI{font-family:var(--dp);font-size:17px;font-weight:700;color:var(--t1);background:transparent;border:none;border-bottom:2px solid transparent;outline:none;width:100%}.PNI:focus{border-bottom-color:#00e6a8}
.PIV{font-family:var(--mn);font-size:18px;font-weight:500}.PIL{font-size:8px;font-weight:600;letter-spacing:.5px;text-transform:uppercase;color:var(--t3)}
.SC{display:flex;background:var(--lf);border:1px solid var(--b1);border-radius:999px;padding:2px;gap:2px;width:fit-content}
.SBt{font-family:var(--ui);font-size:11px;font-weight:500;padding:5px 12px;border-radius:999px;border:none;background:transparent;color:var(--t2);cursor:pointer}.SBt.on{background:linear-gradient(135deg,#00e6a8,#00c890);color:#050709;font-weight:600}
.BP{font-family:var(--ui);font-size:13px;font-weight:600;padding:12px;border-radius:999px;border:none;background:linear-gradient(135deg,#00e6a8,#00c890);color:#050709;cursor:pointer;width:100%}.BP:active{transform:scale(.97)}
.BS{font-family:var(--ui);font-size:11px;font-weight:500;padding:10px;border-radius:999px;border:1px solid var(--b1);background:transparent;color:var(--t2);cursor:pointer;width:100%}
.BA{font-family:var(--ui);font-size:10px;font-weight:600;padding:7px 13px;border-radius:999px;border:none;cursor:pointer}
.ST{font-size:10px;font-weight:600;letter-spacing:.8px;text-transform:uppercase;color:var(--t3);padding:13px 0 7px}

/* ═══ MODALS ═══ */
.OV{position:fixed;inset:0;background:rgba(0,0,0,.85);backdrop-filter:blur(8px);z-index:200;display:flex;align-items:flex-end;justify-content:center;animation:fi .18s ease}
.MS{background:var(--cd);border:1px solid var(--b1);border-radius:22px 22px 0 0;width:100%;max-width:600px;max-height:85vh;overflow-y:auto;padding:18px 18px calc(18px + var(--sb));animation:su .22s ease;-webkit-overflow-scrolling:touch}
.MHn{width:32px;height:4px;background:var(--b2);border-radius:2px;margin:0 auto 14px}
.MTT{font-family:var(--dp);font-size:16px;font-weight:700;margin-bottom:14px}
.MSC{font-size:9px;font-weight:600;letter-spacing:.6px;text-transform:uppercase;color:var(--t3);margin:12px 0 6px;padding-bottom:4px;border-bottom:1px solid var(--b0)}
.MIN{width:100%;font-family:var(--dp);font-size:13px;font-weight:600;color:var(--t1);background:var(--lf);border:1px solid var(--b1);border-radius:10px;padding:10px 12px;outline:none}.MIN:focus{border-color:#00e6a8}
.PKR{display:flex;flex-wrap:wrap;gap:5px;margin-top:5px}
.PKI{width:34px;height:34px;border-radius:8px;border:1px solid var(--b1);background:var(--lf);font-size:15px;display:flex;align-items:center;justify-content:center;cursor:pointer}.PKI.on{background:rgba(0,230,168,.08);border-color:rgba(0,230,168,.22)}
.PKC{width:26px;height:26px;border-radius:50%;cursor:pointer;border:2px solid transparent}.PKC.on{border-color:var(--t1);transform:scale(1.14)}
.OWR{display:flex;gap:5px;flex-wrap:wrap;margin-top:5px}
.OWB{display:flex;align-items:center;gap:5px;padding:6px 10px;border-radius:999px;border:1px solid var(--b1);background:transparent;font-family:var(--ui);font-size:10px;font-weight:500;color:var(--t2);cursor:pointer}.OWB.on{border-color:rgba(0,230,168,.22);background:rgba(0,230,168,.06);color:#00e6a8}
.OWA{width:17px;height:17px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-family:var(--mn);font-size:7px;font-weight:500}
.CFD{position:fixed;inset:0;background:rgba(0,0,0,.85);backdrop-filter:blur(8px);z-index:260;display:flex;align-items:center;justify-content:center;padding:16px;animation:fi .15s ease}
.CFB{background:var(--cd);border:1px solid var(--b1);border-radius:18px;padding:22px;max-width:300px;width:100%;text-align:center;box-shadow:0 18px 50px rgba(0,0,0,.5)}
.CFT{font-family:var(--dp);font-size:16px;font-weight:700;margin-bottom:5px}.CFS{font-size:11px;color:var(--t2);margin-bottom:14px}
.SVD{position:fixed;inset:0;background:rgba(0,0,0,.85);backdrop-filter:blur(8px);z-index:250;display:flex;align-items:center;justify-content:center;padding:16px;animation:fi .18s ease}
.SVB{background:var(--cd);border:1px solid var(--b1);border-radius:20px;padding:22px;max-width:370px;width:100%;box-shadow:0 18px 50px rgba(0,0,0,.5)}
.SVT{font-family:var(--dp);font-size:16px;font-weight:700;margin-bottom:10px;padding-bottom:8px;border-bottom:1px solid var(--b0)}
.SVR{display:flex;justify-content:space-between;padding:4px 0;font-size:12px;border-bottom:1px solid var(--b0)}.SVR:last-child{border-bottom:none;font-weight:600;padding-top:6px}
.SVN{font-size:10px;color:var(--t3);line-height:1.4;background:var(--lf);border:1px solid var(--b0);border-radius:10px;padding:9px;margin:10px 0 14px}
.TC{position:fixed;bottom:calc(78px + var(--sb));left:50%;transform:translateX(-50%);z-index:300}
.TO{background:var(--lf);border:1px solid rgba(0,230,168,.18);color:#00e6a8;font-family:var(--mn);font-size:11px;font-weight:500;padding:9px 16px;border-radius:999px;white-space:nowrap;box-shadow:0 8px 28px rgba(0,0,0,.4);animation:fu .3s ease}
.HC{background:var(--cd);border:1px solid var(--b0);border-radius:14px;padding:13px;margin-bottom:8px}
.HM{font-family:var(--dp);font-size:13px;font-weight:700;margin-bottom:6px;padding-bottom:6px;border-bottom:1px solid var(--b0)}
.HR{display:flex;justify-content:space-between;padding:2px 0;font-size:10px}.HLB{color:var(--t2)}.HVL{font-family:var(--mn);font-weight:500}
.HPL{display:inline-block;font-family:var(--mn);font-size:9px;font-weight:500;padding:2px 7px;border-radius:999px;margin-top:6px}
.EM{display:flex;flex-direction:column;align-items:center;padding:26px 14px;text-align:center;gap:5px}
.EMI{font-size:28px;opacity:.3}.EMT{font-size:11px;color:var(--t2)}.EMS{font-size:10px;color:var(--t3);line-height:1.4}
.UB{display:flex;align-items:center;gap:7px;padding:8px 0}
.UA{width:26px;height:26px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-family:var(--mn);font-size:9px;font-weight:500;flex-shrink:0}
.UE{font-size:10px;color:var(--t2);flex:1;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.ULO{font-size:9px;font-weight:500;padding:5px 10px;border-radius:999px;border:1px solid var(--b1);background:transparent;color:var(--t2);cursor:pointer;display:flex;align-items:center;gap:3px}

/* ═══ LOGIN — premium fintech ═══ */
.LG{min-height:100vh;display:flex;flex-direction:column;align-items:center;justify-content:center;padding:24px;position:relative;overflow:hidden;background:#030508}
.LG::before{content:'';position:absolute;width:380px;height:380px;border-radius:50%;background:radial-gradient(circle,rgba(0,230,168,.15),transparent 70%);top:-100px;right:-80px;animation:o1 8s ease-in-out infinite alternate;filter:blur(50px);pointer-events:none}
.LG::after{content:'';position:absolute;width:300px;height:300px;border-radius:50%;background:radial-gradient(circle,rgba(245,160,32,.12),transparent 70%);bottom:-60px;left:-80px;animation:o2 10s ease-in-out infinite alternate;filter:blur(60px);pointer-events:none}
@keyframes o1{0%{transform:translate(0,0) scale(1)}100%{transform:translate(-25px,35px) scale(1.12)}}
@keyframes o2{0%{transform:translate(0,0) scale(1)}100%{transform:translate(20px,-25px) scale(1.08)}}
.lg-c{display:flex;align-items:center;justify-content:center;margin-bottom:24px;animation:fu .5s ease both .1s;position:relative}
.lg-logo{width:80px;height:80px;filter:drop-shadow(0 8px 28px rgba(0,229,160,.35));border-radius:22px}
.lg-a{width:54px;height:54px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-family:var(--dp);font-size:19px;font-weight:800;position:relative;z-index:1;box-shadow:0 4px 24px rgba(0,0,0,.5)}
.lg-a1{background:linear-gradient(135deg,#00e6a8,#00c890);color:#030508;margin-right:-8px}
.lg-a2{background:linear-gradient(135deg,#f5a020,#e89010);color:#030508;margin-left:-8px}
.lg-ln{position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);width:30px;height:30px;border-radius:50%;background:rgba(255,255,255,.05);border:1px solid rgba(255,255,255,.08);z-index:2;display:flex;align-items:center;justify-content:center;backdrop-filter:blur(6px)}
.LGB{background:rgba(11,14,24,.8);backdrop-filter:blur(28px) saturate(1.5);border:1px solid rgba(255,255,255,.06);border-radius:28px;padding:36px 26px 30px;max-width:400px;width:100%;box-shadow:0 28px 70px rgba(0,0,0,.55),0 0 0 1px rgba(255,255,255,.02) inset;position:relative;z-index:10;animation:fu .5s ease both .2s}
.LGT{font-family:var(--dp);font-size:28px;font-weight:800;text-align:center;margin-bottom:3px;line-height:1.1;background:linear-gradient(135deg,#e4eaf6 30%,#00e6a8 90%);-webkit-background-clip:text;-webkit-text-fill-color:transparent}
.LGS{font-size:13px;color:var(--t3);text-align:center;margin-bottom:24px;letter-spacing:.2px;font-weight:400}
.lg-tabs{display:flex;background:rgba(16,21,36,.7);border:1px solid rgba(255,255,255,.05);border-radius:999px;padding:3px;margin-bottom:22px}
.lg-tab{flex:1;font-family:var(--ui);font-size:12px;font-weight:500;padding:10px 0;border-radius:999px;border:none;background:transparent;color:var(--t3);cursor:pointer;transition:all .25s}
.lg-tab.on{background:rgba(0,230,168,.1);color:#00e6a8;font-weight:600}
.lg-f{position:relative;margin-bottom:12px}
.lg-ico{position:absolute;left:14px;top:50%;transform:translateY(-50%);color:var(--t3);pointer-events:none;transition:color .2s;display:flex;align-items:center}
.lg-f:focus-within .lg-ico{color:#00e6a8}
.LGI{width:100%;font-family:var(--ui);font-size:14px;font-weight:500;color:var(--t1);background:rgba(16,21,36,.8);border:1px solid rgba(255,255,255,.05);border-radius:16px;padding:15px 16px 15px 44px;outline:none;transition:border-color .25s,box-shadow .25s}
.LGI:focus{border-color:rgba(0,230,168,.35);box-shadow:0 0 0 4px rgba(0,230,168,.05)}
.LGI::placeholder{color:var(--t3);font-weight:400}
.LGPW{position:relative}.LGPW .LGI{padding-right:46px}
.LGPE{position:absolute;right:14px;top:50%;transform:translateY(-50%);background:none;border:none;color:var(--t3);cursor:pointer}
.lg-btn{width:100%;font-family:var(--ui);font-size:15px;font-weight:700;letter-spacing:.2px;padding:16px;border-radius:16px;border:none;cursor:pointer;background:linear-gradient(135deg,#00e6a8,#00c890);color:#030508;margin-top:8px;box-shadow:0 6px 24px rgba(0,230,168,.22);position:relative;overflow:hidden;transition:transform .15s}
.lg-btn:active{transform:scale(.97)}.lg-btn:disabled{opacity:.45}
.lg-btn::after{content:'';position:absolute;top:-50%;left:-50%;width:200%;height:200%;background:linear-gradient(135deg,transparent 40%,rgba(255,255,255,.12) 50%,transparent 60%);transform:rotate(25deg);animation:shm 3.5s ease-in-out infinite}
@keyframes shm{0%,100%{transform:translateX(-100%) rotate(25deg)}50%{transform:translateX(100%) rotate(25deg)}}
.lg-or{display:flex;align-items:center;gap:12px;margin:18px 0}
.lg-or::before,.lg-or::after{content:'';flex:1;height:1px;background:var(--b1)}
.lg-or span{font-size:10px;color:var(--t3);font-weight:500}
.lg-guest{width:100%;font-family:var(--ui);font-size:13px;font-weight:500;padding:14px;border-radius:16px;border:1px solid var(--b1);background:transparent;color:var(--t2);cursor:pointer;transition:all .2s;display:flex;align-items:center;justify-content:center;gap:6px}
.lg-guest:active{border-color:rgba(0,230,168,.2);color:#00e6a8}
.LGD{font-size:12px;color:var(--t3);text-align:center;margin-top:18px}
.LGL{color:#00e6a8;cursor:pointer;border:none;background:none;font-family:var(--ui);font-size:12px;font-weight:600;text-decoration:underline;text-underline-offset:2px}
.LGE{font-size:11px;color:#f04060;text-align:center;margin-bottom:10px;padding:9px 12px;border-radius:14px;background:rgba(240,64,96,.06);border:1px solid rgba(240,64,96,.1);animation:shk .4s ease}
@keyframes shk{0%,100%{transform:translateX(0)}20%{transform:translateX(-5px)}40%{transform:translateX(5px)}60%{transform:translateX(-3px)}80%{transform:translateX(3px)}}
.lg-ft{display:flex;align-items:center;justify-content:center;gap:16px;margin-top:28px;animation:fu .5s ease both .8s}
.lg-ft-i{display:flex;flex-direction:column;align-items:center;gap:4px}
.lg-ft-ic{width:36px;height:36px;border-radius:10px;background:rgba(255,255,255,.03);border:1px solid rgba(255,255,255,.04);display:flex;align-items:center;justify-content:center;color:var(--t3)}
.lg-ft-t{font-size:8px;color:var(--t3);letter-spacing:.5px;text-transform:uppercase}

/* ═══ LINK ═══ */
.LNK{background:var(--lf);border:1px solid var(--b1);border-radius:14px;padding:14px;margin-bottom:10px}
.LNKT{font-size:12px;font-weight:600;margin-bottom:5px;display:flex;align-items:center;gap:6px}
.LNKS{font-size:10px;color:var(--t2);margin-bottom:7px;line-height:1.3}
.LNKI{width:100%;font-family:var(--mn);font-size:11px;color:var(--t1);background:var(--cd);border:1px solid var(--b1);border-radius:10px;padding:9px 11px;outline:none;margin-bottom:7px}.LNKI:focus{border-color:#00e6a8}
.LNKST{display:flex;align-items:center;gap:5px;font-size:10px;padding:6px 8px;border-radius:8px;margin-top:6px}
.LSok{background:rgba(0,230,168,.05);color:#00e6a8;border:1px solid rgba(0,230,168,.1)}
.LSwt{background:rgba(245,160,32,.05);color:#f5a020;border:1px solid rgba(245,160,32,.1)}
`;

// ──────────────────────────────────────────────────────
// THEMES
// ──────────────────────────────────────────────────────
export const THEMES = [
  { name: "Verde Menta",     hex: "#00e6a8", rgb: "0,230,168",   dark: "#00c890" },
  { name: "Fucsia",          hex: "#d946ef", rgb: "217,70,239",  dark: "#b52abe" },
  { name: "Rosado Amarillo", hex: "#fbbf24", rgb: "251,191,36",  dark: "#d9a020" },
  { name: "Azul Eléctrico",  hex: "#38bdf8", rgb: "56,189,248",  dark: "#1a9de0" },
  { name: "Rojo Coral",      hex: "#f87171", rgb: "248,113,113", dark: "#e04545" },
  { name: "Lavanda",         hex: "#a78bfa", rgb: "167,139,250", dark: "#8a6de8" },
  { name: "Esmeralda",       hex: "#34d399", rgb: "52,211,153",  dark: "#18b87a" },
  { name: "Naranja Cálido",  hex: "#fb923c", rgb: "251,146,60",  dark: "#e0722a" },
];
export const mkCSS = t => CSS.replaceAll("#00e6a8", t.hex).replaceAll("0,230,168", t.rgb).replaceAll("#00c890", t.dark);
