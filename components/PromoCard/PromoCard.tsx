import {
  Button,
  Heading,
  HStack,
  Img,
  Link,
  Modal,
  Stack,
  Text,
  useDisclosure,
} from "@chakra-ui/react";
import Script from "next/script";

const PromoCard = ({ date, heading, href }) => {
  return (
    <Stack align="center">
      <Text fontSize="0.6rem" opacity="0.6" letterSpacing="1rem" mb={10}>
        {date}
      </Text>
      <Heading variant="decorative" pb={10}>
        {heading}
      </Heading>
      <Link
        textTransform="uppercase"
        letterSpacing="4px"
        textAlign="center"
        fontWeight="100"
        fontSize="0.8rem"
        borderRadius="0"
        href="https://distrokid.com/hyperfollow/sufferundersorrow/lightbringer-2"
        bg="whiteAlpha.200"
        _hover={{
          bg: "whiteAlpha.300",
        }}
        px={8}
        py={4}
        isExternal
      >
        Pre-Save Now
      </Link>

      <HStack pt={5}>
        <Link
          href="https://open.spotify.com/artist/6VknbeUC5gJcnWW6xjGeFm?si=6C_V9qnBT529rm1KIJZsrA"
          isExternal
          position="relative"
        >
          <Img src="/images/spotify.png" height="20px" />
        </Link>
        <Link
          href="https://music.apple.com/gb/artist/suffer-under-sorrow/1210781987"
          isExternal
          position="relative"
        >
          <Img src="/images/apple-music.png" height="20px" />
        </Link>
      </HStack>
    </Stack>
  );
};

export { PromoCard };
