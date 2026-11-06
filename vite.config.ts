import { defineConfig } from "vite";
import { existsSync } from "node:fs";
import react from "@vitejs/plugin-react";
export default defineConfig({
  plugins: [react()],
  define: {
    __PUBLIC_RESUME_EXISTS__: JSON.stringify(
      existsSync("public/resume/Trunal_Patil_Resume_Public.pdf"),
    ),
  },
  base: process.env.VITE_BASE_PATH || "./",
  build: { target: "es2022" },
});
