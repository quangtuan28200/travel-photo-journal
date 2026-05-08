import react from "@vitejs/plugin-react";
import { fileURLToPath } from "node:url";
import { defineConfig } from "vitest/config";

export default defineConfig({
  plugins: [react()],
  test: {
    environment: "jsdom",
    globals: true,
    setupFiles: ["./vitest.setup.ts"],
    coverage: {
      provider: "v8",
      reporter: ["text", "html"],
      include: [
        "src/components/lightbox.tsx",
        "src/lib/api.ts",
        "src/lib/auth.ts",
        "src/lib/config.ts",
        "src/lib/errors.ts",
        "src/lib/redirect.ts",
        "src/lib/r2-key.ts",
        "src/lib/slug.ts",
        "src/lib/validation.ts"
      ],
      thresholds: {
        branches: 80,
        functions: 80,
        lines: 80,
        statements: 80
      }
    }
  },
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url))
    }
  }
});
