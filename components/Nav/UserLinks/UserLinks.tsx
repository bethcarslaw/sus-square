import {
  Avatar,
  Box,
  Button,
  HStack,
  Img,
  Link as ChakraLink,
  Popover,
  PopoverArrow,
  PopoverContent,
  PopoverHeader,
  PopoverTrigger,
  Portal,
  Stack,
  Text,
} from "@chakra-ui/react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCartShopping,
  faChevronCircleDown,
} from "@fortawesome/free-solid-svg-icons";
import { useCart } from "@hooks/useCart";
import { useSession, signOut } from "next-auth/react";
import Link from "next/link";

const UserLinks = () => {
  const { cartCount } = useCart();
  const { data: session } = useSession();

  return (
    <HStack spacing={5} pr={6}>
      <Link href="/cart" style={{ cursor: "pointer" }}>
        <ChakraLink>
          <HStack>
            <FontAwesomeIcon width="20px" icon={faCartShopping} />
            <Box>{cartCount}</Box>
          </HStack>
        </ChakraLink>
      </Link>

      {!session && (
        <Link href="/api/auth/signin">
          <ChakraLink
            textTransform="uppercase"
            letterSpacing="2px"
            fontSize="xs"
          >
            Sign In
          </ChakraLink>
        </Link>
      )}

      {session && (
        <Popover>
          <PopoverTrigger>
            <HStack cursor="pointer">
              <Avatar
                name={session.user.name}
                src={
                  session.user.image
                    ? session.user.image
                    : "/images/default-avatar.jpg"
                }
                size="sm"
              />
              <FontAwesomeIcon width="15px" icon={faChevronCircleDown} />
            </HStack>
          </PopoverTrigger>
          <Portal>
            <PopoverContent
              width="auto"
              minW="165px"
              maxW="200px"
              textAlign="center"
              _focus={{
                outline: "0",
                boxShadow: "none",
              }}
            >
              <PopoverArrow />
              <PopoverHeader>{session.user.name}</PopoverHeader>
              <Stack p={2}>
                <Link href="/account">
                  <ChakraLink
                    textTransform="uppercase"
                    letterSpacing="2px"
                    fontSize="xs"
                  >
                    My Account
                  </ChakraLink>
                </Link>
                <Link href="/account/orders">
                  <ChakraLink
                    textTransform="uppercase"
                    letterSpacing="2px"
                    fontSize="xs"
                  >
                    Orders
                  </ChakraLink>
                </Link>

                <ChakraLink
                  textTransform="uppercase"
                  letterSpacing="2px"
                  fontSize="xs"
                  onClick={() => signOut({ callbackUrl: "/" })}
                >
                  Log Out
                </ChakraLink>
              </Stack>
            </PopoverContent>
          </Portal>
        </Popover>
      )}
    </HStack>
  );
};

export { UserLinks };
