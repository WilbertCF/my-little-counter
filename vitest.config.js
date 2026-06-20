import { configDefaults, defineConfig } from "vitest/config";

// Config del runner normal (`npm test`). Los tests de reglas de Firestore necesitan
// el emulador (Java) y se ejecutan aparte con `npm run test:rules`, así que se excluyen aquí.
// `esbuild.jsx: automatic` habilita el runtime JSX automático (sin React global)
// para los tests de componentes (.jsx) sin afectar a los tests de funciones puras.
export default defineConfig({
  esbuild: {
    jsx: "automatic",
  },
  test: {
    exclude: [...configDefaults.exclude, "**/*.rules.test.*"],
  },
});
