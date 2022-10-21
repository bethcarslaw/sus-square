import {
  Button,
  Heading,
  HStack,
  Img,
  Link,
  Stack,
  Text,
} from "@chakra-ui/react";

const PromoCard = ({ date, heading, href }) => (
  <Stack align="center">
    <Text fontSize="0.6rem" opacity="0.6" letterSpacing="1rem" mb={10}>
      {date}
    </Text>
    <Heading
      color="white"
      size="md"
      fontFamily="decorative"
      position="relative"
      fontWeight="100"
      textTransform="uppercase"
      letterSpacing="2rem"
      pb={10}
    >
      {heading}
    </Heading>
    <Button
      textTransform="uppercase"
      letterSpacing="4px"
      textAlign="center"
      fontWeight="100"
      fontSize="0.8rem"
      borderRadius="0"
    >
      Pre-Save Now
    </Button>

    <HStack pt={5}>
      <Link href="https://spotify.com" position="relative">
        <Img src="/images/spotify.png" height="20px" />
      </Link>
      <Link href="https://spotify.com" position="relative">
        <Img src="/images/apple-music.png" height="20px" />
      </Link>
    </HStack>
  </Stack>
);

export { PromoCard };
