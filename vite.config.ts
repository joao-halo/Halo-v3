import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  define: {
    // carimbo de data do build, usado em dateModified no JSON-LD
    __BUILD_DATE__: JSON.stringify(new Date().toISOString().slice(0, 10)),
  },
  server: { port: 5173 },
  test: {
    environment: "node",
    include: ["src/**/*.test.ts"],
  },
} as never);
