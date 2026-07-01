import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}"
  ],
  theme: {
    extend: {
      colors: {
        obsidian: "#050507",
        graphite: "#111217",
        ink: "#0a1020",
        royal: "#10213f",
        gold: "#c9a45d",
        "gold-soft": "#e3c980",
        bronze: "#936b3d",
        silver: "#bcc4ce"
      },
      boxShadow: {
        royal: "0 24px 80px rgba(201, 164, 93, 0.16)",
        "royal-strong": "0 0 44px rgba(227, 201, 128, 0.24)"
      },
      fontFamily: {
        display: ["var(--font-display)", "serif"],
        sans: ["var(--font-sans)", "system-ui", "sans-serif"]
      }
    }
  },
  plugins: []
};

export default config;
