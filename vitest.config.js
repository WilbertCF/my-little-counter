import { configDefaults, defineConfig } from "vitest/config";

// Config del runner normal (`npm test`). Los tests de reglas de Firestore necesitan
// el emulador (Java) y se ejecutan aparte con `npm run test:rules`, así que se excluyen aquí.
export default defineConfig({
  test: {
    exclude: [...configDefaults.exclude, "**/*.rules.test.*"],
  },
});
