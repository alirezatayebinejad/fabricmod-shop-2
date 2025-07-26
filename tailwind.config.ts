import type { Config } from "tailwindcss";
import { heroui } from "@heroui/theme";
import animate from "tailwindcss-animate";

const config = {
  darkMode: "class",
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./node_modules/@heroui/theme/dist/components/(accordion|button|checkbox|dropdown|input|modal|pagination|popover|select|slider|tabs|divider|ripple|spinner|form|menu|listbox|scroll-shadow).js",
  ],
  prefix: "",
  /* + bellow theme customization are from shadcn + ourselves 
     + we change the shadcn variables and use it for our component if possible
       otherwise we create new variables for our components
     + if we want to change a theme style just we change the variables in
        globals.css or add new variables in globals.css then add it here.
        check the components to see where they read their styles from as not
     + all the components follow the variables rule.
  */
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      fontFamily: {
        dana: ["var(--font-dana)"],
      },
      fontSize: {
        TextSize100: "var(--TextSize100)",
        TextSize200: "var(--TextSize200)",
        TextSize300: "var(--TextSize300)",
        TextSize400: "var(--TextSize400)",
        TextSize500: "var(--TextSize500)",
        TextSize600: "var(--TextSize600)",
        TextSize700: "var(--TextSize700)",
      },
      colors: {
        border: "var(--border)",
        border2: "var(--border2)",
        primary: {
          DEFAULT: "var(--primary)",
          foreground: "var(--primary-foreground)",
          50: "var(--primary-50)",
          100: "var(--primary-100)",
          200: "var(--primary-200)",
        },
        secondary: {
          DEFAULT: "var(--secondary)",
          foreground: "var(--secondary-foreground)",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
          1: {
            DEFAULT: "var(--accentColor1)",
            foreground: "var(--accentColor1-foreground)", // Nested foreground for accent 1
          },
          2: {
            DEFAULT: "var(--accentColor2)",
            foreground: "var(--accentColor2-foreground)", // Nested foreground for accent 2
          },
          3: {
            DEFAULT: "var(--accentColor3)",
            foreground: "var(--accentColor3-foreground)", // Nested foreground for accent 3
          },
          4: {
            DEFAULT: "var(--accentColor4)",
            foreground: "var(--accentColor4-foreground)", // Nested foreground for accent 4
          },
        },
        destructive: {
          DEFAULT: "var(--destructive)",
          foreground: "var(--destructive-foreground)",
        },
        success: {
          DEFAULT: "var(--success)",
          foreground: "var(--success-foreground)",
        },
        bodyBg: "var(--bodyBg)",
        mainBg: "var(--mainBg)",
        failure: "var(--failure)",
        link: "var(--link)",
        lightLink: "var(--lightLink)",
        boxBg100: "var(--boxBg100)",
        boxBg200: "var(--boxBg200)",
        boxBg250: "var(--boxBg250)",
        boxBg300: "var(--boxBg300)",
        boxBg400: "var(--boxBg400)",
        boxBg500: "var(--boxBg500)",
        TextColor: "var(--TextColor)",
        TextLow: "var(--TextLow)",
        TextMute: "var(--TextMute)",
        TextReverse: "var(--TextReverse)",
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
  plugins: [animate, heroui()],
} satisfies Config;

export default config;
