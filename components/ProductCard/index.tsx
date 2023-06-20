import {
  Heading,
  HStack,
  Img,
  LinkBox,
  LinkOverlay,
  Stack,
  StackProps,
  Text,
} from "@chakra-ui/react";
import { Product } from "@square-api/products";
import { toGBP } from "@util/index";
import Link from "next/link";

interface ProductCardProps extends StackProps {
  product: Product;
}

const ProductCard = ({ product, ...rest }: ProductCardProps) => (
  <LinkBox>
    <Stack {...rest} justify="center">
      <Img
        src={product.image_urls[0] || "/images/default-img.jpg"}
        alt={product.name}
        h={["200px", "250px", "250px", "350px", "450px"]}
        objectFit="cover"
        mb={5}
      />
      <Heading size="xs" textAlign="center">
        <Link href={`/merch/${product.slug}`} passHref>
          <LinkOverlay>{product.name}</LinkOverlay>
        </Link>
      </Heading>
      <HStack justify="center">
        <Text color="whiteAlpha.700">{toGBP(product.price as string)}</Text>
      </HStack>
    </Stack>
  </LinkBox>
);

export { ProductCard };
