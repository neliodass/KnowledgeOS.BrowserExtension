/** @type {import('tailwindcss').Config} */
module.exports = {
  mode: "jit",
  darkMode: "class",
  content: ["./**/*.tsx"],
  theme: {
    extend: {
      colors: {
        tech: {
          bg: "var(--tech-bg)",
          surface: "var(--tech-surface)",
          "surface-hover": "var(--tech-surface-hover)",
          primary: "var(--tech-primary)",
          "primary-dim": "var(--tech-primary-dim)",
          border: "var(--tech-border)",
          muted: "var(--tech-muted)",
          "text-muted": "var(--tech-text-muted)"
        },
      }
    }
  },
  plugins: []
}