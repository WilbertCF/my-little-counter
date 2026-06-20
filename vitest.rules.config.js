import { defineConfig } from "vitest/config";

// Config dedicada a los tests de reglas de Firestore (corren contra el emulador).
// Se usa vía `npm run test:rules`, que arranca el emulador con firebase-tools.
export default defineConfig({
  test: {
    include: ["**/*.rules.test.*"],
    testTimeout: 20000,
    hookTimeout: 60000,
    fileParallelism: false,
  },
});
