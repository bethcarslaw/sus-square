import { Box, Stack, Link } from "@chakra-ui/react";
import { NavLink } from "@components/Nav/NavLink/NavLink";
import {
  faDiscord,
  faFacebook,
  faInstagram,
  faSpotify,
  faTwitter,
  faYoutube,
} from "@fortawesome/free-brands-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const Footer = () => (
  <Box as="footer" mt="40px" px={2} py={10} bg="rgba(255, 255, 255, 0.05)">
    <Stack direction="row" justify="center" spacing={4} mb={4}>
      <Link href="http://spotify.sufferundersorrow.com" isExternal>
        <FontAwesomeIcon
          width="20px"
          icon={faSpotify}
          style={{ cursor: "pointer" }}
        />
      </Link>
      <Link href="https://facebook.com/sufferundersorrow" isExternal>
        <FontAwesomeIcon
          width="20px"
          icon={faFacebook}
          style={{ cursor: "pointer" }}
        />
      </Link>
      <Link href="https://instagram.com/sufferundersorrow" isExternal>
        <FontAwesomeIcon
          width="20px"
          icon={faInstagram}
          style={{ cursor: "pointer" }}
        />
      </Link>
      <Link href="https://twitter.com/s_u_s_band" isExternal>
        <FontAwesomeIcon
          width="20px"
          icon={faTwitter}
          style={{ cursor: "pointer" }}
        />
      </Link>
      <Link href="http://discord.sufferundersorrow.com" isExternal>
        <FontAwesomeIcon
          width="20px"
          icon={faDiscord}
          style={{ cursor: "pointer" }}
        />
      </Link>
      <Link
        href="https://www.youtube.com/channel/UCHTbV4QV9GVt70w-mdXkAoQ"
        isExternal
      >
        <FontAwesomeIcon
          width="20px"
          icon={faYoutube}
          style={{ cursor: "pointer" }}
        />
      </Link>
    </Stack>
    <Stack direction="row" justify="center" spacing={4}>
      <NavLink href="/terms" fontSize="0.5rem">
        Terms &amp; Conditions
      </NavLink>
      <NavLink href="/privacy" fontSize="0.5rem">
        Privacy Policy
      </NavLink>
      <NavLink href="/shipping" fontSize="0.5rem">
        Shipping &amp; Returns
      </NavLink>
    </Stack>
  </Box>
);

export { Footer };
