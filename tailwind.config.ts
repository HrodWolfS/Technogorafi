import typography from "@tailwindcss/typography";
import type { Config } from "tailwindcss";
import animate from "tailwindcss-animate";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: ["class", "class"],
  theme: {
    extend: {
      colors: {
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        heading: "hsl(var(--heading))",
        text: "hsl(var(--text))",
        bold: "hsl(var(--bold))",
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        "muted-foreground": "hsl(var(--muted-foreground))",
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        "popover-foreground": "hsl(var(--popover-foreground))",
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        "card-foreground": "hsl(var(--card-foreground))",
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        "primary-foreground": "hsl(var(--primary-foreground))",
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        "secondary-foreground": "hsl(var(--secondary-foreground))",
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        "accent-foreground": "hsl(var(--accent-foreground))",
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        "destructive-foreground": "hsl(var(--destructive-foreground))",
        ring: "hsl(var(--ring))",
        chart: {
          "1": "hsl(var(--chart-1))",
          "2": "hsl(var(--chart-2))",
          "3": "hsl(var(--chart-3))",
          "4": "hsl(var(--chart-4))",
          "5": "hsl(var(--chart-5))",
        },
      },
      borderRadius: {
        custom: "var(--radius)",
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      typography: {
        DEFAULT: {
          css: {
            maxWidth: "65ch",
            color: "hsl(var(--foreground))",
            h1: {
              fontFamily: "var(--font-ibm-plex)",
              color: "hsl(var(--heading))",
              fontWeight: "700",
            },
            h2: {
              fontFamily: "var(--font-ibm-plex)",
              color: "hsl(var(--heading))",
              fontWeight: "600",
            },
            h3: {
              color: "hsl(var(--heading))",
              fontWeight: "600",
            },
            strong: {
              color: "hsl(var(--bold))",
              fontWeight: "700",
            },
            p: {
              color: "hsl(var(--text))",
            },
          },
        },
        dark: {
          css: {
            color: "hsl(var(--text))",
            h1: {
              color: "hsl(var(--heading))",
            },
            h2: {
              color: "hsl(var(--heading))",
            },
            h3: {
              color: "hsl(var(--heading))",
            },
            strong: {
              color: "hsl(var(--bold))",
            },
            p: {
              color: "hsl(var(--text))",
            },
          },
        },
      },
      fontFamily: {
        marker: ["var(--font-permanent-marker)"],
      },
    },
  },
  plugins: [typography, animate],
};

export default config;
