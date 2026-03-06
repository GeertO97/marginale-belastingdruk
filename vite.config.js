import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  base: "/marginale-belastingdruk/",
  plugins: [react(), tailwindcss()],
  test: {
    environment: "node",
  },
});
