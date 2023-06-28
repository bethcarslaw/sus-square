import { Stack } from "@chakra-ui/react";
import Image from "next/image";
import Link from "next/link";
import { NavLink } from "./NavLink/NavLink";
import { UserLinks } from "./UserLinks/UserLinks";
import useScrollPosition from "@react-hook/window-scroll";

const Nav = () => {
  const scrollPos = useScrollPosition(10);

  return (
    <Stack
      direction="row"
      justify="space-between"
      width="100%"
      position="fixed"
      top="0"
      left="0"
      zIndex="1"
      overflow="hidden"
      bg={`${scrollPos > 50 ? "primary.900" : "transparent"}`}
      transition="background 0.2s ease-in-out"
      transform="translate3d(0,0,0)"
    >
      <Stack as="nav" direction="row" py="2" px="6" align="center" bg="">
        <Link href="/">
          <Image
            src="/images/sus-emblem.svg"
            alt="Suffer Under Sorrow"
            width="40px"
            height="40px"
            style={{ cursor: "pointer" }}
          />
        </Link>

        <Stack direction="row" spacing={10} pl={"50px"}>
          <NavLink href="/merch">Merch</NavLink>
          <NavLink href="/shows">Shows</NavLink>
          <NavLink href="/contact">Contact</NavLink>
        </Stack>
      </Stack>

      <UserLinks />
    </Stack>
  );
};

export { Nav };
