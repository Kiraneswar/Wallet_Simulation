/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "../../packages/ui/**/*.{js,ts,jsx,tsx,mdx}"
  ],
  theme: {
    extend: {
      colors: {
        darkIndigo: "#051424",
        primaryBlue: "#adc7ff",
        secondaryCyan: "#ddfcff",
        tertiaryEmerald: "#4edea3",
        errorRose: "#ffb4ab",
        surfaceCard: "rgba(18, 33, 49, 0.4)", // transparent for glass effect
        surfaceCardSolid: "#122131",
        surfacePanel: "rgba(28, 43, 60, 0.5)",
        surfacePanelSolid: "#1c2b3c",
        surfaceHover: "rgba(39, 54, 71, 0.6)",
      },
      fontFamily: {
        sans: ["var(--font-inter)", "Inter", "sans-serif"],
        heading: ["var(--font-manrope)", "Manrope", "sans-serif"],
      },
    },
  },
  plugins: [],
}