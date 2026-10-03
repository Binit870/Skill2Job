/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        // Display/UI face — carries the brand's personality: headings, nav,
        // buttons, labels, stat numbers.
        display: ["'Inter Tight'", "Inter", "sans-serif"],
        // Body face — used for paragraph copy, form inputs, and dense data
        // (tables, lists) where Inter Tight's tighter tracking hurts
        // legibility at small sizes.
        sans: ["Inter", "'Inter Tight'", "sans-serif"],
      },
      colors: {
        // Named design tokens for the Skill2Career brand. Deliberately not the
        // generic bright-emerald SaaS gradient the app previously used —
        // deeper, more editorial greens paired with a muted gold accent for
        // achievement/score moments (ATS score, assessment grade, interview
        // score — the product's actual differentiator).
        ink: "#0D1512", // primary text, dark surfaces
        pine: "#0E6B52", // primary brand — buttons, links, active states
        moss: "#143D30", // deep secondary green — gradients, dark sections, hover
        gold: "#C99A3B", // accent — scores, achievement, the "current step" marker
        paper: "#F7F5EF", // warm off-white page background
        mist: "#E7E4DA", // warm neutral border/divider
      },
      boxShadow: {
        card: "0 1px 2px rgba(13,21,18,0.04), 0 8px 24px -12px rgba(13,21,18,0.12)",
        "card-hover": "0 4px 8px rgba(13,21,18,0.06), 0 16px 32px -12px rgba(13,21,18,0.18)",
      },
      borderRadius: {
        xl2: "1.25rem",
      },
    },
  },
  plugins: [],
}
