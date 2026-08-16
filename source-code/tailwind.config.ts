import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Thème CLAIR "ink" = fonds clairs, "platinum" = texte sombre.
        ink: {
          DEFAULT: "#FAF7F0", // fond de page papier crème (DA print)
          soft: "#FFFFFF", // surfaces / cartes
          card: "#FFFFFF",
        },
        space: {
          DEFAULT: "#F2EDE3",
          deep: "#FAF7F0",
        },
        lavender: "#5B6478", // texte secondaire (gris lisible sur clair)
        platinum: "#15171F", // texte principal (sombre)
        strawberry: "#EF233C",
        crimson: "#D80032",
      },
      fontFamily: {
        sans: ["Inter", "-apple-system", "BlinkMacSystemFont", "Segoe UI", "sans-serif"],
        display: ["Space Grotesk", "Inter", "sans-serif"],
      },
      borderRadius: {
        "4xl": "2rem",
        "5xl": "2.5rem",
      },
      boxShadow: {
        glow: "0 0 50px -8px rgba(216, 0, 50, 0.6)",
        "glow-soft": "0 0 80px -16px rgba(239, 35, 60, 0.45)",
        card: "6px 6px 0 0 rgba(21, 23, 31, 0.9)",
        "inset-hair": "inset 0 1px 0 0 rgba(255,255,255,0.08)",
        // DA « print » de la landing : ombres dures décalées (pas de flou).
        hard: "6px 6px 0 0 #15171F",
        "hard-sm": "3px 3px 0 0 #15171F",
        "hard-red": "5px 5px 0 0 #D80032",
        "hard-red-sm": "3px 3px 0 0 #D80032",
      },
      keyframes: {
        aurora: {
          "0%, 100%": { transform: "translate3d(0,0,0)" },
          "50%": { transform: "translate3d(4%,-5%,0)" },
        },
        marquee: {
          "0%": { transform: "translate3d(0,0,0)" },
          "100%": { transform: "translate3d(-50%,0,0)" },
        },
        marqueeReverse: {
          "0%": { transform: "translate3d(-50%,0,0)" },
          "100%": { transform: "translate3d(0,0,0)" },
        },
        shimmer: {
          "0%": { backgroundPosition: "200% 0" },
          "100%": { backgroundPosition: "-200% 0" },
        },
        sheen: {
          "0%": { transform: "translateX(-150%) skewX(-12deg)" },
          "100%": { transform: "translateX(250%) skewX(-12deg)" },
        },
        floaty: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-14px)" },
        },
        pulseGlow: {
          "0%, 100%": { opacity: "0.5", transform: "scale(1)" },
          "50%": { opacity: "1", transform: "scale(1.12)" },
        },
        spin360: {
          to: { transform: "rotate(360deg)" },
        },
        scrollx: {
          to: { transform: "translate3d(-100%, 0, 0)" },
        },
        fadein: {
          "0%": { opacity: "0", transform: "scale(1.04)" },
          "100%": { opacity: "1", transform: "scale(1)" },
        },
      },
      animation: {
        aurora: "aurora 24s ease-in-out infinite",
        marquee: "marquee 40s linear infinite",
        marqueeReverse: "marqueeReverse 50s linear infinite",
        shimmer: "shimmer 6s linear infinite",
        sheen: "sheen 3.5s ease-in-out infinite",
        floaty: "floaty 7s ease-in-out infinite",
        pulseGlow: "pulseGlow 2.4s ease-in-out infinite",
        spin360: "spin360 22s linear infinite",
        scrollx: "scrollx 45s linear infinite",
        fadein: "fadein 0.7s ease-out",
      },
    },
  },
  plugins: [],
};

export default config;
