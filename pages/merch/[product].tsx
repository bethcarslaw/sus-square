import { GetStaticPaths, GetStaticProps, NextPage } from "next";
import { getProducts, Product } from "@square-api/products";
import { useCart } from "@hooks/useCart";
import { Button, Select } from "@chakra-ui/react";
import { useState } from "react";
import { getCategoryId } from "@square-api/categories";

interface ProductPageProps {
  product: Product;
}

const Product: NextPage = ({ product }: ProductPageProps) => {
  const { addToCart } = useCart();
  const [variation, setVariation] = useState<string>("");

  return (
    <>
      <br />
      <br />
      <br />
      <h1>Product Page</h1>
      <h1>Product: {product.name}</h1>
      <p>{product.price as string}</p>
      <Select
        placeholder="Choose Option"
        onChange={(e) => setVariation(e.target.value)}
      >
        {product.variations.map((variation) => (
          <option
            key={variation.id}
            disabled={!variation.in_stock}
            value={variation.id}
          >
            {variation.name} {!variation.in_stock && "(Sold Out)"}
          </option>
        ))}
      </Select>
      <Button
        colorScheme="primary"
        onClick={() =>
          addToCart({ ...product, variation: { id: variation, quantity: 1 } })
        }
        disabled={!variation}
      >
        Add to cart
      </Button>
    </>
  );
};

export const getStaticPaths: GetStaticPaths = async () => {
  const products = await getProducts({
    categoryIds: [await getCategoryId("merch")],
  });

  const paths = products.map((item) => {
    return {
      params: {
        product: item.slug,
      },
    };
  });

  return {
    paths,
    fallback: false,
  };
};

export const getStaticProps: GetStaticProps = async (context) => {
  const products = await getProducts({
    categoryIds: [await getCategoryId("merch")],
  });
  const pathname = context.params?.product as string;

  const product = JSON.stringify(
    products.find((item) => item.slug === pathname)
  );

  if (!product) {
    return {
      notFound: true,
    };
  }

  return {
    props: { product: JSON.parse(product) },
  };
};

export default Product;
