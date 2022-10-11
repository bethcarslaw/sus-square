import { Box, Image } from "@chakra-ui/react";

const VideoBanner = () => (
  <Box width="100%" height="80vh" position="relative">
    <Image
      src="/images/lightbringer.jpg"
      objectFit="cover"
      alt="Lightbringer - Out Now"
      width="100%"
      height="100%"
    />

    <Box
      position="absolute"
      top="0"
      left="0"
      bottom="0"
      right="0"
      margin="auto"
      width="100%"
      height="100%"
    >
      <video
        loop
        style={{ minWidth: "100%", minHeight: "100%", objectFit: "cover" }}
        muted
        autoPlay
      >
        <source src="/video/lightbringer.mp4" type="video/mp4" />
      </video>
    </Box>
  </Box>
);

export { VideoBanner };
