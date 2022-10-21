import { extendTheme } from "@chakra-ui/react";

const theme = extendTheme({
  colors: {
    primary: {
      50: "#dcf9ff",
      100: "#b7e4f8",
      200: "#8ed1ee",
      300: "#64bde6",
      400: "#3caadd",
      500: "#2291c4",
      600: "#147099",
      700: "#07506f",
      800: "#003145",
      900: "#00121d",
    },
    primaryAlpha: {
      50: "rgba(0, 18, 29, 0)",
      900: "rgba(0, 18, 29, 1)",
    },
  },
  fonts: {
    heading: `'Montserrat', sans-serif`,
    body: `'Montserrat', sans-serif`,
    decorative: `'minion-pro', serif`,
    decorativeLight: `'minion-pro display', serif`,
  },
  config: {
    initialColorMode: "dark",
    useSystemColorMode: false,
  },
});

export { theme };
