import { Button, Heading, HStack } from "@chakra-ui/react";
import { useCart } from "@hooks/useCart";
import { checkIfOutOfStock } from "@square-api/products";
import axios from "axios";
import { NextPage } from "next";
import { useRouter } from "next/router";
import { useEffect } from "react";

const Cart: NextPage = () => {
  const { products, clearCart } = useCart();
  const { push } = useRouter();

  useEffect(() => {
    const checkStockInCart = async () => {
      const itemsOutOfStock = await axios.post(
        "/api/products/check-stock",
        products
      );

      console.log("OUT OF STOCK: ", itemsOutOfStock);
    };

    checkStockInCart();
  }, [products]);

  return (
    <div style={{ marginTop: "50px" }}>
      <Heading>Cart</Heading>

      <ul>
        {products.map((product) => (
          <li key={product.id}>
            {product.name} Variation:{" "}
            {
              (console.log(product),
              product.variations.find(
                (variation) => variation.id === product.variation.id
              ).name)
            }
          </li>
        ))}
      </ul>

      <HStack>
        <Button onClick={() => push("/checkout")} colorScheme="primary">
          Checkout
        </Button>
        <Button onClick={() => clearCart()}>Clear Cart</Button>
      </HStack>
    </div>
  );
};

export default Cart;
