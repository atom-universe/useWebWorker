import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  // server: {
  //   port: 3000,
  // },
  // resolve: {
  //   preserveSymlinks: true,
  //   dedupe: ["react", "react-dom"],
  // },
  // optimizeDeps: {
  //   include: ["@use-web-worker/core", "react", "react-dom"],
  //   force: true,
  // },
  // build: {
  //   commonjsOptions: {
  //     include: [/node_modules/],
  //     transformMixedEsModules: true,
  //   },
  // },
});
