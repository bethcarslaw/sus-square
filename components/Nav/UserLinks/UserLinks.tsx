import { Button, HStack, Link as ChakraLink } from "@chakra-ui/react";
import { useCart } from "@hooks/useCart";
import { useSession, signOut } from "next-auth/react";
import Link from "next/link";

const UserLinks = () => {
  const { products } = useCart();
  const { data: session } = useSession();

  return (
    <HStack>
      <Link href="/cart">
        <ChakraLink>Cart: {products.length}</ChakraLink>
      </Link>

      {!session && <Link href="/api/auth/signin">Login</Link>}

      {session && (
        <>
          <div>
            <Link href="/account" passHref>
              <ChakraLink>{session.user.name}</ChakraLink>
            </Link>
          </div>
          <Button onClick={() => signOut({ callbackUrl: "/" })}>Logout</Button>
        </>
      )}
    </HStack>
  );
};

export { UserLinks };
