import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  // define: {
  //   "process.env": process.env,
  //   VITE_SUPABASE_PROJECT_URL: process.env.VITE_SUPABASE_PROJECT_URL,
  //   VITE_SUPABASE_ANON_KEY: process.env.VITE_SUPABASE_ANON_KEY,
  // },
});
