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
        moss: "#53624e",
        clay: "#b06a4b",
        tide: "#4c6f7b"
      },
      fontFamily: {
        sans: ["ui-sans-serif", "system-ui", "sans-serif"]
      },
      boxShadow: {
        soft: "0 20px 70px rgba(23, 23, 23, 0.12)"
      }
    }
  },
  plugins: []
};

export default config;
