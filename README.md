# My Little Counter 💰

PWA mobile-first para gestionar **finanzas en pareja** (2 personas + gastos conjuntos), en español y en euros (€). Permite registrar ingresos, gastos personales y conjuntos, deudas, propiedades y metas de ahorro, con indicadores y gráficos por mes.

🔗 **En vivo:** https://wilbertcf.github.io/my-little-counter/

## Stack

- **React 19** + **Vite 8**
- **Firebase 12** — Auth (email/password) + Firestore
- **Recharts** (gráficos, cargados de forma diferida) · **lucide-react** (iconos)
- **vite-plugin-pwa** (instalable, offline)
- **Vitest** + Testing Library (tests)

## Arquitectura

El punto de entrada es `src/main.jsx`, que monta `App` desde `finanzas-app.jsx` (orquestador: auth, carga, auto-guardado y navegación por tabs). El resto está modularizado:

```
finanzas-app.jsx          App (orquestador)
src/
├── main.jsx              entry — monta <App/>
├── firebase.js           init de Firebase (config por env vars)
├── constants.js          MES, paletas, estado inicial (EMPTY)
├── components/
│   ├── primitives.jsx    NI, Tst, Cfm, OBdg, KPI, FR, DRw, PBr
│   ├── cards.jsx         DCd (deudas), LCd (propiedades), GCd (metas)
│   ├── AddModal.jsx      modal de añadir ítems
│   ├── Login.jsx         registro / login / modo invitado
│   ├── PartnerLink.jsx   vinculación de pareja
│   ├── tabs.jsx          DashT, PersT, JntT, HistT, SvDlg
│   └── DashCharts.jsx    gráficos Recharts (lazy → chunk aparte)
├── lib/
│   ├── helpers.js        uid, oInf
│   └── storage.js        localStorage + Firestore (users/households/emailIndex)
├── ui/
│   └── styles.js         CSS global, temas
└── utils/
    └── calculations.js   cálculos financieros puros (con tests)
```

## Persistencia

| Modo | Almacenamiento |
|------|----------------|
| Invitado | `localStorage` |
| Con cuenta | Firestore `users/{uid}` |
| Pareja vinculada | doc compartido `households/{sk}`, con `sk = sort(uidA, uidB).join("_")` |

El auto-guardado usa debounce de 600 ms. La búsqueda de pareja se hace contra un directorio mínimo `emailIndex/{email}` → `{ uid, displayName }`, para no listar la colección `users` (que contiene los datos financieros).

## Seguridad

Las reglas viven en [`firestore.rules`](firestore.rules) (deny-by-default): cada quien lee solo su `users/{uid}`, los `households` se autorizan por membresía vía el ID del doc, y el `emailIndex` solo expone email→uid+nombre. Las claves `VITE_FIREBASE_*` van en el bundle (es normal, no son secretas); la seguridad real está en las reglas.

> ⚠️ Tras cambiar `firestore.rules` hay que **desplegarlas**: `npx firebase-tools deploy --only firestore:rules` (o pegarlas en la consola de Firebase). El archivo en el repo no tiene efecto hasta publicarlo.

## Puesta en marcha

```bash
npm install
cp .env.example .env   # y rellena las 6 claves VITE_FIREBASE_*  (ver abajo)
npm run dev
```

Variables de entorno requeridas (`.env`, no versionado):

```
VITE_FIREBASE_API_KEY=
VITE_FIREBASE_AUTH_DOMAIN=
VITE_FIREBASE_PROJECT_ID=
VITE_FIREBASE_STORAGE_BUCKET=
VITE_FIREBASE_MESSAGING_SENDER_ID=
VITE_FIREBASE_APP_ID=
```

## Scripts

| Script | Qué hace |
|--------|----------|
| `npm run dev` | Servidor de desarrollo |
| `npm run build` | Build de producción a `dist/` |
| `npm run preview` | Previsualiza el build |
| `npm test` | Tests unitarios + smoke (Vitest) |
| `npm run test:coverage` | Tests con cobertura |
| `npm run test:rules` | Tests de las reglas Firestore (requiere el emulador / Java) |
| `npm run deploy` | Publica `dist/` a la rama `gh-pages` |

## Tests

`npm test` cubre los cálculos financieros, un smoke de render de `App` y de cada componente, y la capa de storage (Firestore mockeado). Los tests de reglas se ejecutan aparte contra el emulador de Firestore con `npm run test:rules`.

## Despliegue

El sitio se sirve desde la rama `gh-pages` (GitHub Pages), independiente de `main`. `npm run deploy` construye y publica `dist/`. `vite.config.js` fija `base: '/my-little-counter/'`.
