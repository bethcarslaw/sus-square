import {
  Link as ChakraLink,
  Button,
  Divider,
  Heading,
  HStack,
  Stack,
  useToast,
  Text,
  Alert,
} from "@chakra-ui/react";
import { CartItem } from "@components/Cart/CartItem/CartItem";
import { Page } from "@components/Layout/Page/Page";
import { faCircleChevronLeft } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useCart } from "@hooks/useCart";
import axios from "axios";
import { NextPage } from "next";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect } from "react";

const Cart: NextPage = () => {
  const { products, removeFromCart, total } = useCart();
  const { push } = useRouter();
  const toast = useToast();

  useEffect(() => {
    const checkStockInCart = async () => {
      const itemsOutOfStock = await axios.post(
        "/api/products/check-stock",
        products
      );

      if (itemsOutOfStock.data.length > 0) {
        products.forEach((p) => {
          const outOfStock = itemsOutOfStock.data.find(
            (item) => item.id === p.variation.id
          );

          if (outOfStock) {
            removeFromCart(p, outOfStock.adjustBy);
          }
        });

        toast({
          title: "Whoops!",
          description:
            "Some items in your cart are out of stock and have been removed",
          status: "warning",
        });
      }
    };

    checkStockInCart();
  }, []);

  return (
    <Page maxW="900px">
      <Stack justify="space-between" direction="row" mb={14}>
        <Heading>Cart</Heading>
        <Link href="/merch" passHref>
          <ChakraLink display="flex" alignItems="center">
            <FontAwesomeIcon
              icon={faCircleChevronLeft}
              style={{ marginRight: "20px", display: "inline-block" }}
              width="20px"
            />
            Continue shopping
          </ChakraLink>
        </Link>
      </Stack>

      <Stack spacing={8}>
        {products
          .sort((a, b) =>
            a.name.toLowerCase().localeCompare(b.name.toLowerCase())
          )
          .map((product) => (
            <>
              <CartItem key={product.id} item={product} />
              <Divider />
            </>
          ))}

        {products.length === 0 && (
          <Alert>
            Looks like your cart is empty!{" "}
            <Link href="/merch" passHref>
              <ChakraLink ml="20px">Continue shopping</ChakraLink>
            </Link>
          </Alert>
        )}
      </Stack>

      <HStack justify="space-between" mt={6}>
        <HStack height="50px">
          <Heading>Total</Heading>
          <Divider orientation="vertical" />
          <Stack>
            <Text>{total}</Text>
            <Text fontSize="xs" opacity="0.6">
              shipping calculated at checkout
            </Text>
          </Stack>
        </HStack>
        {products.length > 0 && (
          <Button onClick={() => push("/checkout")} colorScheme="primary">
            Checkout
          </Button>
        )}
      </HStack>
    </Page>
  );
};

export default Cart;
