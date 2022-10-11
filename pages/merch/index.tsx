import { getProducts, Product } from "@square-api/products";
import { GetStaticProps, NextPage } from "next";
import Link from "next/link";

interface MerchProps {
  products: Product[];
}

const Merch: NextPage = ({ products }: MerchProps) => (
  <>
    <div style={{ marginTop: "100px" }}>
      <ul>
        {products.length > 0 &&
          products.map((product) => (
            <li key={product.id}>
              <Link href={`merch/${product.slug}`}>{product.name}</Link>
            </li>
          ))}
      </ul>
    </div>
  </>
);

export const getStaticProps: GetStaticProps = async () => {
  const products = JSON.stringify(await getProducts());

  return {
    props: { products: JSON.parse(products) },
  };
};

export default Merch;
