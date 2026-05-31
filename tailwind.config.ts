// tailwind.config.ts
import type { Config } from "tailwindcss";
import animate from "tailwindcss-animate";
import defaultTheme from "tailwindcss/defaultTheme";

const config: Config = {
  darkMode: "class",
  content: [
    "./src/**/*.{ts,tsx}",
    "./node_modules/@tremor/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    container: {
      center: true,
      padding: "1.5rem",
      screens: {
        "2xl": "1280px",
      },
    },
    extend: {
      // Updated Tracknit Soft Green Palette
      colors: {
        border: "hsl(var(--border))"/** foreground subtle */,
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))"/** dark base */,
        foreground: "hsl(var(--foreground))"/** light text */,
        // NEW: Soft Green Palette
        primary: {
          DEFAULT: "hsl(var(--primary))"/** soft green */,
          foreground: "hsl(var(--primary-foreground))"/** dark text */,
          50: "#ebfdf0",
          100: "#d7fae1",
          200: "#b2f2c7",
          300: "#8ce8ad",
          400: "#68d884",
          500: "#4dc16d", // Base soft green
          600: "#34a655",
          700: "#238a42",
          800: "#156d30",
          900: "#09501f",
          950: "#053912",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))"/** surface */,
          foreground: "hsl(var(--secondary-foreground))"/** text */,
        },
        tertiary: {
          DEFAULT: "var(--tertiary)",
          foreground: "var(--on-tertiary)",
        },
        surface: {
          DEFAULT: "hsl(var(--background))"/** dark surface */,
          variant: "hsl(var(--surface-variant))"/** subtle surface */,
          container: {
            "": "hsl(var(--surface-container))"/** elevated cards */,
            low: "hsl(var(--surface-container-low))"/** subtle elevation */,
            high: "hsl(var(--surface-container-high))"/** popup/tooltip */,
          },
        },
        muted: {
          DEFAULT: "hsl(var(--muted))"/** subtle surface */,
          foreground: "hsl(var(--muted-foreground))"/** subtle text */,
        },
        accent: {
          DEFAULT: "hsl(var(--accent))"/** more subtle surface */,
          foreground: "hsl(var(--accent-foreground))"/** text contrast */,
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))"/** error/alert */,
          foreground: "hsl(var(--destructive-foreground))"/** text */,
        },
        chart: {
          1: "hsl(var(--chart-1))"/** primary */,
          2: "hsl(var(--chart-2))"/** primary variant */,
          3: "hsl(var(--chart-3))"/** subtle variant */,
          4: "hsl(var(--chart-4))"/** secondary variant */,
          5: "hsl(var(--chart-5))"/** least prominent */,
        },
        // SFX accent (violet-blue)
        sfx: {
          DEFAULT: "#4f56fd", // Soft violet-blue for SFX elements
          50: "#eef2ff",
          100: "#e0e7ff",
          200: "#c7d2fe",
          300: "#a5b4fc",
          400: "#818cf8",
          500: "#6366f1",
          600: "#4f46e5",
          700: "#4f56fd", // Base SFX color
          800: "#3730a3",
          900: "#312e81",
        },
      },
      borderRadius: {
        lg: `var(--radius-lg)`,
        md: `var(--radius-md)`,
        sm: `var(--radius-sm)`,
        xl: `var(--radius-xl)`,
        "2xl": `var(--radius-2xl)`,
        "3xl": `var(--radius-3xl)`,
        "4xl": `var(--radius-4xl)`,
        DEFAULT: `var(--radius)`,
      },
      fontFamily: {
        body: ["var(--font-body)", ...defaultTheme.fontFamily.sans],
        headline: ["var(--font-headline)", ...defaultTheme.fontFamily.sans],
        display: ["var(--font-display)", ...defaultTheme.fontFamily.sans],
        serif: ["var(--font-serif)", ...defaultTheme.fontFamily.serif],
        sans: ["var(--font-sans)", ...defaultTheme.fontFamily.sans],
        roslane: ["'Roslane'", "serif"],
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
        wiggle: {
          "0%, 100%": { transform: "rotate(-3deg)" },
          "50%": { transform: "rotate(3deg)" },
        },
        // Custom Tracknit animations
        "waveform-pulse": {
          "0%, 100%": { opacity: "0.7", height: "var(--wave-height)" },
          "50%": { opacity: "1", height: "var(--wave-active-height)" },
        },
        "glow-pulse": {
          "0%, 100%": { boxShadow: "0 0 8px rgba(var(--glow-color), 0.2)" },
          "50%": { boxShadow: "0 0 16px rgba(var(--glow-color), 0.4)" },
        },
        "fade-in-up": {
          from: { opacity: "0", transform: "translateY(8px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        wiggle: "wiggle 0.8s ease-in-out infinite",
        // Custom Tracknit animations
        "waveform-pulse": "waveform-pulse 1.2s ease-in-out infinite",
        "glow-pulse": "glow-pulse 2s ease-in-out infinite",
        "fade-in-up": "fade-in-up 0.3s cubic-bezier(0.4, 0, 0.2, 1) forwards",
      },
      // Custom Tracknit utilities
      utilities: {
        ".neon-glow-soft": {
          boxShadow: "0 0 12px rgba(var(--glow-color), 0.15)",
        },
        ".waveform-active": {
          color: "var(--primary-500)",
          "--glow-color": "104, 216, 132", // #68d884 RGB
        },
      },
    },
  },
  plugins: [animate],
} satisfies Config;

export default config;