import type { Config } from "tailwindcss";
import animate from "tailwindcss-animate";

export default {
  darkMode: ["class"],
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: { "2xl": "1400px" },
    },
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--border))",
        ring: "hsl(var(--primary))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        surface: "hsl(var(--surface))",
        success: "hsl(var(--success))",
        warning: "hsl(var(--warning))",
      },
      fontFamily: {
        display: ['"Playfair Display"', "serif"],
        editorial: ['"Fraunces"', "serif"],
        sans: ["Inter", "system-ui", "sans-serif"],
        jakarta: ['"Plus Jakarta Sans"', "system-ui", "sans-serif"],
        mono: ['"JetBrains Mono"', "monospace"],
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      boxShadow: {
        "inner-hairline":
          "inset 0 1px 1px rgba(255,255,255,0.55), inset 0 -1px 1px rgba(30,58,95,0.04)",
        "soft-lift":
          "0 1px 1px rgba(30,58,95,0.04), 0 8px 24px -12px rgba(30,58,95,0.12), 0 24px 64px -32px rgba(30,58,95,0.16)",
        "soft-glow":
          "0 1px 0 rgba(255,255,255,0.6) inset, 0 18px 48px -28px rgba(30,58,95,0.25)",
      },
      transitionTimingFunction: {
        "spring-out": "cubic-bezier(0.32,0.72,0,1)",
        "spring-soft": "cubic-bezier(0.22,1,0.36,1)",
      },
      keyframes: {
        "fade-rise": {
          "0%": {
            opacity: "0",
            transform: "translateY(24px)",
            filter: "blur(8px)",
          },
          "100%": {
            opacity: "1",
            transform: "translateY(0)",
            filter: "blur(0)",
          },
        },
        "drift-orb": {
          "0%, 100%": { transform: "translate3d(0,0,0) scale(1)" },
          "50%": { transform: "translate3d(-12px,-18px,0) scale(1.05)" },
        },
      },
      animation: {
        "fade-rise": "fade-rise 900ms cubic-bezier(0.22,1,0.36,1) both",
        "drift-orb": "drift-orb 14s ease-in-out infinite",
      },
    },
  },
  plugins: [animate],
} satisfies Config;
