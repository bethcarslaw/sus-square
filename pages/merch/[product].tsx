import { GetStaticPaths, GetStaticProps, NextPage } from "next";
import { getProducts, Product } from "@square-api/products";
import { useCart } from "@hooks/useCart";
import {
  Alert,
  AlertIcon,
  Box,
  Button,
  Heading,
  HStack,
  Img,
  Select,
  Stack,
  Tag,
  Text,
} from "@chakra-ui/react";
import { useMemo, useState } from "react";
import { getCategoryIdsByName } from "@square-api/categories";
import { Page } from "@components/Layout/Page/Page";
import { toGBP } from "@util/index";

interface ProductPageProps {
  product: Product;
}

const Product: NextPage = ({ product }: ProductPageProps) => {
  const { addToCart, products } = useCart();
  const [variation, setVariation] = useState<string>(
    product.variations.find((v) => v.in_stock)?.id
  );
  const cartItem = useMemo(
    () => products.find((product) => product.variation.id === variation),
    [variation, products]
  );
  const tooManyCartItems = useMemo(
    () =>
      cartItem &&
      cartItem.variation.quantity >=
        product.variations.find((v) => v.id === variation).stock,
    [cartItem, variation, products]
  );

  const [img, setImg] = useState<string>(product.image_urls[0]);
  const [loading, setLoading] = useState<boolean>(false);

  const handleAddToCart = async () => {
    setLoading(true);

    await addToCart({
      ...product,
      variation: { id: variation, quantity: 1 },
    });

    setLoading(false);
  };

  return (
    <Page>
      <Stack direction={["column", "column", "row"]} spacing={6}>
        <Stack w={["100%", "100%", "50%"]}>
          <Img
            src={img || "/images/default-img.jpg"}
            alt={product.name}
            maxH={["600px", "600px", "800px"]}
            w="100%"
            objectFit="cover"
          />
          <Stack direction={"row"}>
            {product.image_urls.map((image) => (
              <Img
                key={image}
                src={image}
                w="100px"
                height="100px"
                objectFit="cover"
                onClick={() => setImg(image)}
                border={`1px solid rgba(255,255,255,${
                  image === img ? 0.5 : 0.1
                })`}
                _hover={{
                  border: "1px solid rgba(255,255,255,0.5)",
                }}
                cursor="pointer"
              />
            ))}
          </Stack>
        </Stack>
        <Stack spacing={10}>
          <Stack>
            <Heading>{product.name}</Heading>
            <HStack mb={2}>
              <Tag size="lg">{toGBP(product.price as string)}</Tag>
              {product.customAttributes.onSale && (
                <Tag size="lg" bg="red" textTransform="uppercase">
                  sale
                </Tag>
              )}
            </HStack>
          </Stack>
          <Text display="block">{product.description}</Text>

          <Box>
            {product.variations.length > 1 && (
              <Select
                placeholder="Choose Option"
                onChange={(e) => setVariation(e.target.value)}
                value={variation}
                mb={4}
                maxW="200px"
              >
                {product.variations.map((item) => (
                  <option
                    key={item.id}
                    disabled={!item.in_stock}
                    value={item.id}
                  >
                    {item.name} {!item.in_stock && "(Sold Out)"}
                  </option>
                ))}
              </Select>
            )}
            {tooManyCartItems && (
              <Alert status="warning" mb={4}>
                <AlertIcon />
                Not enough stock to add more of this option to your cart.
              </Alert>
            )}
            <Button
              colorScheme="primary"
              onClick={() => handleAddToCart()}
              disabled={!variation || loading || tooManyCartItems}
              isLoading={loading}
            >
              Add to cart
            </Button>
          </Box>
        </Stack>
      </Stack>
    </Page>
  );
};

export const getStaticPaths: GetStaticPaths = async () => {
  const products = await getProducts({
    categoryIds: await getCategoryIdsByName([
      "t shirts",
      "hats",
      "artwork",
      "music",
    ]),
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
    categoryIds: await getCategoryIdsByName([
      "t shirts",
      "hats",
      "artwork",
      "music",
    ]),
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
