/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      backgroundImage: {
        speechtrain: "url('./src/assets/speechtrain/background.png')",
      },
      animation: {
        marquee: "marqueeAnimation linear infinite",
        marqueereplay: "marqueeReplay linear infinite",
        translate_ducks: "translate-ducks linear infinite",
        moveDuck: "moveDuck linear infinite",
        flight: "moveFlight 10s linear",
        takeoff: "takeoff 5s linear forwards",
        flicker: "flicker 1s infinite"
      },
      scale: {
        1: "1",
        10: "10",
        15: "15",
      },
      transitionDuration: {
        2000: "2000ms",
        3000: "3000ms",
        4000: "4000ms",
      },
      keyframes: {
        marqueeAnimation: {
          "0%": { transform: "translateX(100%)" },
          "100%": { transform: "translateX(-100%)" },
        },
        marqueeReplay: {
          "0%": { transform: "translateX(100%)" },
          "100%": { transform: "translateX(-100%)" },
        },
        translate_ducks: {
          transform: "translateX(60vw)",
        },
        moveDuck: {
          "0%": { transform: "translateX(0)" },
          "100%": { transform: "translateX(65vw)" },
        },
        moveFlight: {
          "100%": { transform: "translateX(20vw)" },
          "0%": { transform: "translateX(80vw)" },
        },
        takeoff1: {
          "100%": { transform: "translateX(-40vw)" },
          "0%": { transform: "translateX(10vw)" },
        },
        takeoff: {
          "0%": { transform: "translateX(20vw) rotate(0deg)" },
          "25%": { transform: "translateX(0vw) rotate(10deg)" },
          "35%": { transform: "translateX(-10vw) rotate(15deg)" },
          "50%": { transform: "translateX(-30vw) rotate(20deg)" },
          "65%": { transform: "translateX(-40vw) rotate(25deg)" },
          "75%": { transform: "translateX(-50vw) rotate(30deg)" },
          "95%": { transform: "translateX(-60vw) rotate(30deg)" },
          "100%": { transform: "translateX(-70vw) rotate(35deg)" },
        },
        flicker:{
          "0%" : { opacity: "1" },
          "25%" : {opacity : "0.75"},
          "50%" : { opacity: "0.5" },
          "75%" : { opacity: "0.25" },
          "100%" : { opacity: "0" },
        }
      },
    },
  },
  plugins: [require("@tailwindcss/typography")],
};
