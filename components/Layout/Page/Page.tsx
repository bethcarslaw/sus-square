import { Box, Container } from "@chakra-ui/react";

const Page = ({ children, ...props }) => (
  <>
    <Container {...props}>
      <Box
        display="block"
        height="54px"
        mb={["0px", "0px", "40px", "40ox", "100px"]}
      />
      {children}
    </Container>
  </>
);

export { Page };
