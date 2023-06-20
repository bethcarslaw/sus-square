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
        bgGradient="linear-gradient(0deg, primaryAlpha.900 10%, primaryAlpha.50 50%)"
        transform="transform:translateZ(0)"
      />
      <Box
        position="absolute"
        bottom="0"
        left="0"
        w="100%"
        h="446px"
        bgImage="/images/bg-texture-transparent-transition.png"
        bgRepeat="repeat"
        bgSize="713px 446px"
        bgPosition="center"
      />
    </Box>
    <Box m="auto" mt="-100px">
      {children}
    </Box>
  </>
);

export { VideoBanner };
