import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/lib/**/*.{js,ts,jsx,tsx,mdx}"
  ],
  theme: {
    extend: {
      colors: {
        ink: "#171717",
        paper: "#f7f4ef",
        linen: "#fffaf2",
        sand: "#ded1bd",
        moss: "#53624e",
        clay: "#b06a4b",
        tide: "#4c6f7b",
        dusk: "#263238"
      },
      fontFamily: {
        sans: ["ui-sans-serif", "system-ui", "sans-serif"],
        display: ["Segoe UI", "ui-sans-serif", "system-ui", "sans-serif"]
      },
      boxShadow: {
        soft: "0 20px 70px rgba(23, 23, 23, 0.12)",
        editorial: "0 24px 80px rgba(38, 50, 56, 0.14)",
        panel: "0 16px 45px rgba(23, 23, 23, 0.08)"
      }
    }
  },
  plugins: []
};

export default config;
