/**
 * Tests de las reglas de seguridad de Firestore (firestore.rules).
 *
 * Requieren el emulador de Firestore (necesita Java). NO se incluyen en `npm test`.
 * Ejecutar con:   npm run test:rules
 * (levanta el emulador vía firebase-tools y corre este archivo con vitest).
 */
import { readFileSync } from "node:fs";
import { afterAll, beforeAll, beforeEach, describe, it } from "vitest";
import {
  initializeTestEnvironment,
  assertFails,
  assertSucceeds,
} from "@firebase/rules-unit-testing";
import { doc, getDoc, setDoc } from "firebase/firestore";

// uids SIN guion bajo: los uids reales de Firebase Auth son alfanuméricos, por eso
// households puede derivar la membresía con sk.split("_") sin ambigüedad.
const ALICE = "aliceUid";
const BOB = "bobUid";
const CAROL = "carolUid";
const ALICE_EMAIL = "alice@example.com";
const BOB_EMAIL = "bob@example.com";

const houseKey = (a, b) => [a, b].sort().join("_");

let testEnv;

beforeAll(async () => {
  testEnv = await initializeTestEnvironment({
    projectId: "demo-mlc-rules",
    firestore: { rules: readFileSync("firestore.rules", "utf8") },
  });
});

afterAll(async () => {
  await testEnv?.cleanup();
});

beforeEach(async () => {
  await testEnv.clearFirestore();
});

// Contexto autenticado con email en el token (lo exige emailIndex).
const asUser = (uid, email) =>
  testEnv.authenticatedContext(uid, email ? { email } : {}).firestore();
const asGuest = () => testEnv.unauthenticatedContext().firestore();
// Siembra datos saltándose las reglas.
const seed = (fn) => testEnv.withSecurityRulesDisabled((ctx) => fn(ctx.firestore()));

describe("users/{uid}", () => {
  it("el dueño puede leer su propio doc", async () => {
    await seed((db) => setDoc(doc(db, "users", ALICE), { appData: { x: 1 } }));
    await assertSucceeds(getDoc(doc(asUser(ALICE, ALICE_EMAIL), "users", ALICE)));
  });

  it("un usuario NO puede leer el doc de otro", async () => {
    await seed((db) => setDoc(doc(db, "users", ALICE), { appData: { x: 1 } }));
    await assertFails(getDoc(doc(asUser(BOB, BOB_EMAIL), "users", ALICE)));
  });

  it("un invitado (no autenticado) NO puede leer", async () => {
    await seed((db) => setDoc(doc(db, "users", ALICE), { appData: { x: 1 } }));
    await assertFails(getDoc(doc(asGuest(), "users", ALICE)));
  });

  it("el dueño puede crear su propio doc", async () => {
    await assertSucceeds(
      setDoc(doc(asUser(ALICE, ALICE_EMAIL), "users", ALICE), {
        email: ALICE_EMAIL,
        displayName: "Alice",
        partnerId: null,
      }),
    );
  });

  it("un usuario NO puede crear el doc de otro", async () => {
    await assertFails(
      setDoc(doc(asUser(ALICE, ALICE_EMAIL), "users", BOB), { displayName: "x" }),
    );
  });

  it("el dueño puede actualizar su appData", async () => {
    await seed((db) => setDoc(doc(db, "users", ALICE), { appData: { x: 1 } }));
    await assertSucceeds(
      setDoc(
        doc(asUser(ALICE, ALICE_EMAIL), "users", ALICE),
        { appData: { x: 2 } },
        { merge: true },
      ),
    );
  });
});

describe("emailIndex/{email}", () => {
  it("puedes registrar TU propio email -> tu uid", async () => {
    await assertSucceeds(
      setDoc(doc(asUser(ALICE, ALICE_EMAIL), "emailIndex", ALICE_EMAIL), {
        uid: ALICE,
        displayName: "Alice",
      }),
    );
  });

  it("NO puedes registrar un email distinto al de tu token", async () => {
    await assertFails(
      setDoc(doc(asUser(ALICE, ALICE_EMAIL), "emailIndex", BOB_EMAIL), {
        uid: ALICE,
        displayName: "Alice",
      }),
    );
  });

  it("NO puedes apuntar el índice a un uid que no es el tuyo", async () => {
    await assertFails(
      setDoc(doc(asUser(ALICE, ALICE_EMAIL), "emailIndex", ALICE_EMAIL), {
        uid: BOB,
        displayName: "x",
      }),
    );
  });

  it("cualquier autenticado puede resolver un email (get)", async () => {
    await seed((db) =>
      setDoc(doc(db, "emailIndex", ALICE_EMAIL), { uid: ALICE, displayName: "Alice" }),
    );
    await assertSucceeds(getDoc(doc(asUser(BOB, BOB_EMAIL), "emailIndex", ALICE_EMAIL)));
  });

  it("un invitado NO puede resolver emails", async () => {
    await seed((db) =>
      setDoc(doc(db, "emailIndex", ALICE_EMAIL), { uid: ALICE, displayName: "Alice" }),
    );
    await assertFails(getDoc(doc(asGuest(), "emailIndex", ALICE_EMAIL)));
  });
});

describe("households/{sk}", () => {
  const SK = houseKey(ALICE, BOB);

  it("un miembro puede escribir y leer el household", async () => {
    await assertSucceeds(
      setDoc(doc(asUser(ALICE, ALICE_EMAIL), "households", SK), { appData: { shared: true } }),
    );
    await assertSucceeds(getDoc(doc(asUser(BOB, BOB_EMAIL), "households", SK)));
  });

  it("un tercero NO puede leer ni escribir el household", async () => {
    await seed((db) => setDoc(doc(db, "households", SK), { appData: { shared: true } }));
    await assertFails(getDoc(doc(asUser(CAROL, "carol@example.com"), "households", SK)));
    await assertFails(
      setDoc(doc(asUser(CAROL, "carol@example.com"), "households", SK), {
        appData: { hacked: true },
      }),
    );
  });
});

describe("vinculación cruzada (partnerId)", () => {
  it("puedes fijar tu uid como partnerId de alguien SIN pareja", async () => {
    await seed((db) => setDoc(doc(db, "users", BOB), { email: BOB_EMAIL, partnerId: null }));
    await assertSucceeds(
      setDoc(doc(asUser(ALICE, ALICE_EMAIL), "users", BOB), { partnerId: ALICE }, { merge: true }),
    );
  });

  it("NO puedes robar una vinculación existente", async () => {
    await seed((db) => setDoc(doc(db, "users", BOB), { email: BOB_EMAIL, partnerId: CAROL }));
    await assertFails(
      setDoc(doc(asUser(ALICE, ALICE_EMAIL), "users", BOB), { partnerId: ALICE }, { merge: true }),
    );
  });

  it("NO puedes modificar otro campo del doc ajeno", async () => {
    await seed((db) =>
      setDoc(doc(db, "users", BOB), { email: BOB_EMAIL, partnerId: null, appData: { x: 1 } }),
    );
    await assertFails(
      setDoc(doc(asUser(ALICE, ALICE_EMAIL), "users", BOB), { appData: { x: 999 } }, { merge: true }),
    );
  });

  it("NO puedes poner un partnerId que no sea tu propio uid", async () => {
    await seed((db) => setDoc(doc(db, "users", BOB), { email: BOB_EMAIL, partnerId: null }));
    await assertFails(
      setDoc(doc(asUser(ALICE, ALICE_EMAIL), "users", BOB), { partnerId: CAROL }, { merge: true }),
    );
  });
});
