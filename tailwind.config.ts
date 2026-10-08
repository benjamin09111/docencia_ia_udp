import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        canvas: {
          dark: "#2D3B45",
          darker: "#1E272E",
          hover: "#394854",
          blue: "#008EE2",
          "blue-hover": "#0077BE",
          border: "#C7CDD1",
          "border-light": "#E0E3E6",
          bg: "#F5F6F8",
          text: "#2D3B45",
          muted: "#6B7780",
        },
        udp: {
          red: "#C8102E",
          "red-dark": "#A60D24",
          "red-light": "#FFEBEE",
          gold: "#D4AF37",
          "canvas-red": "#B71C1C",
        }
      },
      fontFamily: {
        sans: [
          "Lato",
          "Inter",
          "-apple-system",
          "BlinkMacSystemFont",
          '"Segoe UI"',
          "Roboto",
          "Helvetica",
          "Arial",
          "sans-serif",
        ],
      },
      boxShadow: {
        canvas: "0 1px 3px rgba(0, 0, 0, 0.08)",
        "canvas-card": "0 1px 2px rgba(0, 0, 0, 0.05)",
      }
    },
  },
  plugins: [],
};
export default config;
