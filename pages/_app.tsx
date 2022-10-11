import "../styles/globals.css";
import { SessionProvider } from "next-auth/react";
import { AppProps } from "next/app";
import { ChakraProvider } from "@chakra-ui/react";
import { theme } from "../config/theme";
import { Nav } from "../components/Nav/Nav";

import "@fontsource/montserrat";
import { CartProvider } from "@hooks/useCart";

const App = ({ Component, pageProps }: AppProps) => {
  return (
    <ChakraProvider theme={theme}>
      <SessionProvider session={pageProps.session}>
        <CartProvider>
          <Nav />
          <Component {...pageProps} />
        </CartProvider>
      </SessionProvider>
    </ChakraProvider>
  );
};

export default App;
