import js from "@eslint/js";
import tseslint from "typescript-eslint";
export default tseslint.config(
  {
    ignores: [
      ".local/resume-fixture-dist/**",
      ".local/resume-harness/**",
      "dist/**",
      "node_modules/**",
    ],
  },
  js.configs.recommended,
  ...tseslint.configs.recommended,
  {
    files: ["**/*.{js,mjs}"],
    languageOptions: {
      globals: {
        console: "readonly",
        fetch: "readonly",
        process: "readonly",
        setTimeout: "readonly",
        Buffer: "readonly",
        URL: "readonly",
        document: "readonly",
        innerWidth: "readonly",
        window: "readonly",
        navigator: "readonly",
        matchMedia: "readonly",
        localStorage: "readonly",
        scrollY: "readonly",
        scrollTo: "readonly",
        innerHeight: "readonly",
        PerformanceObserver: "readonly",
        performance: "readonly",
        HTMLCanvasElement: "readonly",
        Element: "readonly",
        setInterval: "readonly",
        clearInterval: "readonly",
        requestAnimationFrame: "readonly",
        cancelAnimationFrame: "readonly",
      },
    },
  },
);
