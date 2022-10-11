import { Link, LinkProps } from "@chakra-ui/react";
import NextLink from "next/link";
import { useRouter } from "next/router";

const NavLink = ({ href, ...props }: LinkProps) => {
  const { pathname } = useRouter();

  return (
    <NextLink href={href!} passHref>
      <Link
        textTransform="uppercase"
        fontSize="0.7rem"
        letterSpacing="4px"
        opacity={`${pathname === href ? "1" : "0.6"}`}
        _hover={{ opacity: 1 }}
        {...props}
      />
    </NextLink>
  );
};

export { NavLink };
