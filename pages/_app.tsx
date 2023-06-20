import "../styles/globals.scss";
import { SessionProvider } from "next-auth/react";
import { AppProps } from "next/app";
import {
  Button,
  ChakraProvider,
  Flex,
  keyframes,
  Text,
} from "@chakra-ui/react";
import { theme } from "../config/theme";
import { Nav } from "../components/Nav/Nav";

import "@fontsource/montserrat";
import { CartProvider } from "@hooks/useCart";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSpotify } from "@fortawesome/free-brands-svg-icons";
import { motion } from "framer-motion";
import { Footer } from "@components/Footer/Footer";

const animationKeyframes = keyframes`
  0% { transform: translateY(0)  }
  2% { transform: translateY(-15px)  }
  4% { transform: translateY(0) }
  6% { transform: translateY(-15px)  }
  8% { transform: translateY(0) }
  100% { transform: translateY(0) }
`;
const animation = `${animationKeyframes} 20s ease-in-out infinite`;

const App = ({ Component, pageProps }: AppProps) => {
  return (
    <ChakraProvider theme={theme}>
      <SessionProvider session={pageProps.session}>
        <CartProvider>
          <Flex
            minH="100vh"
            w="100%"
            bg="primary.900"
            bgImage="/images/bg-texture-transparent.png"
            bgRepeat="repeat"
            bgSize="713px 446px"
            bgPosition="center"
            flexDirection="column"
            justify="space-between"
          >
            <Nav />
            <Component {...pageProps} />
            <Footer />
          </Flex>
        </CartProvider>
      </SessionProvider>
      <Button
        as={motion.button}
        animation={animation}
        position="fixed"
        bottom="10px"
        left="10px"
        zIndex="900"
        bg="#1DB954"
        _hover={{ bg: "#13873c" }}
        borderRadius={["5px", "25px"]}
        onClick={() =>
          window.location.assign(
            "https://open.spotify.com/artist/6VknbeUC5gJcnWW6xjGeFm?si=jG7gmxEtTVK1EQ591IKitQ&nd=1"
          )
        }
      >
        <FontAwesomeIcon width="20px" icon={faSpotify} />{" "}
        <Text display={["none", "block"]} pl={2}>
          Follow On Spotify
        </Text>
      </Button>
    </ChakraProvider>
  );
};

export default App;
