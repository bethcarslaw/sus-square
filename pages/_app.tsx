import "../styles/globals.css";
import { SessionProvider } from "next-auth/react";
import { AppProps } from "next/app";
import { Box, ChakraProvider } from "@chakra-ui/react";
import { theme } from "../config/theme";
import { Nav } from "../components/Nav/Nav";

import "@fontsource/montserrat";
import { CartProvider } from "@hooks/useCart";

const App = ({ Component, pageProps }: AppProps) => {
  return (
    <ChakraProvider theme={theme}>
      <SessionProvider session={pageProps.session}>
        <CartProvider>
          <Box minH="100vh" w="100%" bg="primary.900">
            <Nav />
            <Component {...pageProps} />
          </Box>
        </CartProvider>
      </SessionProvider>
    </ChakraProvider>
  );
};

export default App;
