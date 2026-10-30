import { defineConfig } from "vitest/config";
import { fileURLToPath } from "node:url";
export default defineConfig({
  resolve: { alias: { "@": fileURLToPath(new URL("./src", import.meta.url)) } },
  test: { environment: "node", fileParallelism: false, include: [
    "src/lib/visual-tools/__tests__/*.test.ts",
    "src/lib/entry/__tests__/*.test.ts",
    "src/features/space/__tests__/*.test.{ts,tsx}",
  ] },
});
