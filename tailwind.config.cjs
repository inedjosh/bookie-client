/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        background: "var(--background)",
        primary: {
          DEFAULT: "var(--primary)",
        },
        primaryGradient: {
          DEFAULT: "var(--primary-gradient)",
        },
        secondary: {
          DEFAULT: "var(--secondary)",
        },
        "secondary-alt": {
          DEFAULT: "var(--secondary-alt)",
        },
        alert: {
          DEFAULT: "var(--alert)",
        },
        destructive: {
          DEFAULT: "var(--destructive)",
        },
        muted: {
          DEFAULT: "var(--muted)",
        },
        "muted-alt": {
          DEFAULT: "var(--muted-alt)",
        },
        accent: {
          DEFAULT: "var(--accent)",
        },
        "accent-alt": {
          DEFAULT: "var(--accent-alt)",
        },
        "accent-2": {
          DEFAULT: "var(--accent-2)",
        },
        card: {
          DEFAULT: "var(--card)",
        },
        inputBg: {
          DEFAULT: "var(--input-bg)",
        },
        border: {
          DEFAULT: "var(--border)",
        },
        blackText: {
          DEFAULT: "var(--black-text)",
        },
        darkBg: {
          DEFAULT: "var(--dark-bg)",
        },
        secondaryPink: {
          DEFAULT: "var(--secondary-pink)",
        },
        secondaryBlue: {
          DEFAULT: "var(--secondary-blue)",
        },
        secondaryOrange: {
          DEFAULT: "var(--secondary-orange)",
        },
        primaryText: {
          DEFAULT: "var(--primary-text)",
        },
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};
