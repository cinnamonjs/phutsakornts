import { reactRouter } from "@react-router/dev/vite";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";
import { envOnlyMacros } from "vite-env-only";

export default defineConfig({
  plugins: [tsconfigPaths(), envOnlyMacros(), tailwindcss(), reactRouter()],
  server: { port: 3000 },
  css: {
    postcss: {
    },
  },
});
