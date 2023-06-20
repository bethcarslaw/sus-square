import { extendTheme } from "@chakra-ui/react";

const theme = extendTheme({
  colors: {
    primary: {
      50: "#eefeed",
      100: "#c7fbc5",
      200: "#8ed1ee",
      300: "#94f791",
      400: "#48f242",
      500: "#0ae302",
      600: "#08ba02",
      700: "#079f01",
      800: "#057e01",
      900: "#034b01",
    },
    primaryAlpha: {
      50: "rgba(0, 18, 29, 0)",
      100: "rgba(0, 18, 29, 0.1)",
      200: "rgba(0, 18, 29, 0.2)",
      300: "rgba(0, 18, 29, 0.3)",
      400: "rgba(0, 18, 29, 0.4)",
      500: "rgba(0, 18, 29, 0.5)",
      600: "rgba(0, 18, 29, 0.6)",
      700: "rgba(0, 18, 29, 0.7)",
      800: "rgba(0, 18, 29, 0.8)",
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
  components: {
    Container: {
      baseStyle: {
        maxW: "1400px",
        padding: "4",
      },
    },
    Heading: {
      baseStyle: {
        color: "white",
        position: "relative",
        fontWeight: "100",
        textTransform: "uppercase",
        letterSpacing: "0.5rem",
      },
      defaultProps: {
        size: "md",
      },
      variants: {
        decorative: {
          fontFamily: "decorative",
          letterSpacing: "2rem",
        },
      },
    },
  },
});

export { theme };
