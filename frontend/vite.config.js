import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  build: {
    // Specify the correct entry module here
    rollupOptions: {
      input: "src/main.jsx",
    },
  },
});
