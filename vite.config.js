import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  assetsInclude: ["**/*.JPG"],
  server: {
    proxy: {
      "/api": {
        target: "https://backend.tlnevents.com",
        changeOrigin: true,
        secure: false,
      },
    },
  },
});
