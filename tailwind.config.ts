import type { Config } from "tailwindcss";
import animatePlugin from "tailwindcss-animate";

const config: Config = {
  darkMode: "class",
  content: ["./src/**/*.{js,ts,jsx,tsx}", "./src/global.css", "./src/assets/styles/index.css"],
  theme: {
    extend: {
      container: {
        center: true,
        // padding: "1rem",
        screens: {
          sm: "610px",
          md: "738px",
          lg: "990px",
          xl: "1250px",
          "2xl": "1500px"
        }
      },
      colors: {
        "border-red": "red",

        border: {
          DEFAULT: "hsl(var(--border))",
          light: "hsl(var(--border-light))",
          dark: "hsl(var(--border-dark))"
        },
        input: {
          DEFAULT: "hsl(var(--input))",
          light: "hsl(var(--input-light))",
          dark: "hsl(var(--input-dark))"
        },
        ring: {
          DEFAULT: "hsl(var(--ring))",
          light: "hsl(var(--ring-light))",
          dark: "hsl(var(--ring-dark))"
        },
        background: {
          DEFAULT: "hsl(var(--background))",
          light: "hsl(var(--background-light))",
          dark: "hsl(var(--background-dark))"
        },
        heading: {
          DEFAULT: "hsl(var(--heading), <alpha-value>)",
          light: "hsl(var(--heading-light), <alpha-value>)",
          dark: "hsl(var(--heading-dark), <alpha-value>)"
        },
        text: {
          DEFAULT: "hsl(var(--text))",
          light: "hsl(var(--text-light))",
          dark: "hsl(var(--text-dark))"
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          light: "hsl(var(--accent-light))",
          dark: "hsl(var(--accent-dark))"
        },
        primary: {
          DEFAULT: "hsl(var(--primary))",
          light: "hsl(var(--primary-light))",
          dark: "hsl(var(--primary-dark))"
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          light: "hsl(var(--secondary-light))",
          dark: "hsl(var(--secondary-dark))"
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          light: "hsl(var(--destructive-light))",
          dark: "hsl(var(--destructive-dark))"
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          light: "hsl(var(--muted-light))",
          dark: "hsl(var(--muted-dark))"
        },
        "model-overlay": {
          DEFAULT: "hsl(var(--model-overlay))",
          light: "hsl(var(--model-overlay-light))",
          dark: "hsl(var(--model-overlay-dark))"
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          light: "hsl(var(--card-light))",
          dark: "hsl(var(--card-dark))"
        },
        tooltip: {
          DEFAULT: "hsl(var(--tooltip))",
          light: "hsl(var(--tooltip-light))",
          dark: "hsl(var(--tooltip-dark))"
        }
      },
      screens: {
        site: "1500px"
      },
      spacing: {
        "space-available": "-webkit-fill-available"
      },
      // fontFamily: {
      //   inter: ["inter"],
      //   epilogue: ["Epilogue"],
      // },
      fontFamily: {
        inter: ["inter"],
        epilogue: ["epilogue"]
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" }
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" }
        }
      },

      // "no-scrollbar": {
      //   /* Hide scrollbar for Chrome, Safari and Opera */
      //   "::-webkit-scrollbar": {
      //     display: "none",
      //   },
      //   /* Hide scrollbar for IE, Edge and Firefox */
      //   "-ms-overflow-style": "none", /* IE and Edge */
      //   "scrollbar-width": "none",
      // },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out"
      },
      boxShadow: {
        SkillsShadow: "rgba(0, 0, 0, 0.02) 0px 1px 3px 0px, rgba(27, 31, 35, 0.15) 0px 0px 0px 1px"
      }
    }
  },
  plugins: [animatePlugin]
};

export default config;
