import { SimpleGrid } from "@chakra-ui/react";
import { Filter } from "@components/Filter/Filter";
import { Page } from "@components/Layout/Page/Page";
import { ProductCard } from "@components/ProductCard";
import { getCategoryIdsByName } from "@square-api/categories";
import { getProducts, Product } from "@square-api/products";
import { GetStaticProps, NextPage } from "next";
import { useRouter } from "next/router";

interface MerchProps {
  products: Product[];
}

const Merch: NextPage = ({ products }: MerchProps) => {
  const router = useRouter();
  const { filter } = router.query;

  return (
    <Page>
      <Filter filterKey={"category"} objects={products} activeFilter={filter} />
      <SimpleGrid columns={4} spacing={4}>
        {products.length > 0 &&
          products
            .filter((product) =>
              filter ? product.category.toLowerCase() === filter : product
            )
            .map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
      </SimpleGrid>
    </Page>
  );
};

export const getStaticProps: GetStaticProps = async () => {
  const products = JSON.stringify(
    await getProducts({
      categoryIds: await getCategoryIdsByName([
        "t shirts",
        "hats",
        "artwork",
        "music",
      ]),
    })
  );

  return {
    props: { products: JSON.parse(products) },
  };
};

export default Merch;
