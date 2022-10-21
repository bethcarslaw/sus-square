import { Box, BoxProps, Image } from "@chakra-ui/react";

interface VideoBannerProps extends BoxProps {
  src: string;
}

const VideoBanner = ({ src, children, ...rest }: VideoBannerProps) => (
  <>
    <Box
      width="100%"
      height="90vh"
      position="relative"
      {...rest}
      overflow="hidden"
    >
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
          <source src={src} type="video/mp4" />
        </video>
      </Box>
      <Box
        position="absolute"
        top="0"
        left="0"
        w="100%"
        h="100%"
        bgGradient="linear-gradient(0deg, primaryAlpha.900 0%, primaryAlpha.50 64%)"
      />
    </Box>
    <Box m="auto" mt="-100px">
      {children}
    </Box>
  </>
);

export { VideoBanner };
