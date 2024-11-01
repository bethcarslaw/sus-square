import { getCategoryIdsByName } from "@square-api/categories";
import { getProducts, Product } from "@square-api/index";
import { GetStaticProps, NextPage } from "next";
import Link from "next/link";

interface Ticket extends Product {
  isExternal: boolean;
}
interface ShowsProps {
  tickets: Ticket[];
}

const Shows: NextPage = ({ tickets }: ShowsProps) => (
  <>
    <div style={{ marginTop: "100px" }}>
      <ul>
        {tickets.length > 0 &&
          tickets.map((ticket) => (
            <li key={ticket.id}>
              <Link href={`${ticket.isExternal ? "" : "shows/"}${ticket.slug}`}>
                {ticket.name}
              </Link>
            </li>
          ))}
      </ul>
    </div>
  </>
);

export const getStaticProps: GetStaticProps = async () => {
  const products = await getProducts({
    categoryIds: await getCategoryIdsByName(["tickets"]),
  });

  const parsedProducts = JSON.stringify(
    products.map((product) => {
      if (!product.customAttributes) return { ...product, isExternal: false };

      const externalLink = product.customAttributes.external_link;

      return {
        ...product,
        slug: externalLink ? externalLink : product.slug,
        isExternal: true,
      };
    })
  );

  return {
    props: { tickets: JSON.parse(parsedProducts) },
  };
};

export default Shows;
