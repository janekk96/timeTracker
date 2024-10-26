import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { VitePWA, VitePWAOptions } from "vite-plugin-pwa";

const manifestForPWA: Partial<VitePWAOptions> = {
  registerType: "autoUpdate",
  injectRegister: "auto",
  includeAssets: ["favicon.ico", "apple-touch-icon.png", "mask-icon.svg"],
  devOptions: {
    enabled: true,
  },
  workbox: {
    globPatterns: ["**/*.{js,css,html,ico,png,svg}"],
  },
  manifest: {
    name: "Czas pracy Forrent",
    short_name: "CzasPracy",
    description: "Aplikacja do zarządzania czasem pracy",
    theme_color: "#ffffff",
    icons: [
      {
        src: "logo192.png",
        sizes: "192x192",
        type: "image/png",
      },
      {
        src: "logo512.png",
        sizes: "512x512",
        type: "image/png",
      },
    ],
  },
};

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), VitePWA(manifestForPWA)],
  // define: {
  //   "process.env": process.env,
  //   VITE_SUPABASE_PROJECT_URL: process.env.VITE_SUPABASE_PROJECT_URL,
  //   VITE_SUPABASE_ANON_KEY: process.env.VITE_SUPABASE_ANON_KEY,
  // },
});
