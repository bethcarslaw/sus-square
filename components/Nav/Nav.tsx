import { Stack } from "@chakra-ui/react";
import Image from "next/image";
import Link from "next/link";
import { NavLink } from "./NavLink/NavLink";
import { UserLinks } from "./UserLinks/UserLinks";

const Nav = () => (
  <Stack
    direction="row"
    justify="space-between"
    width="100%"
    position="fixed"
    top="0"
    left="0"
    zIndex="9999"
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

export { Nav };
