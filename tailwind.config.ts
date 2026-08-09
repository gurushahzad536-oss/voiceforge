import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        ink: "#1B1A2E",       // background — deep navy-plum
        ink2: "#25233D",      // raised panels
        paper: "#F5F3EF",     // primary text / light surfaces
        gold: "#E8B34C",      // primary accent
        coral: "#FF6B5B",     // secondary accent, used sparingly
        line: "#3A3856",      // hairlines on dark surfaces
        mute: "#A6A3C4",      // secondary text on dark
      },
      fontFamily: {
        display: ["var(--font-fraunces)", "serif"],
        body: ["var(--font-inter)", "sans-serif"],
        mono: ["var(--font-plex-mono)", "monospace"],
      },
      borderRadius: {
        sm: "6px",
        md: "10px",
        lg: "16px",
      },
    },
  },
  plugins: [],
};
export default config;
