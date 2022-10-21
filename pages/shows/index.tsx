import { getCategoryId } from "@square-api/categories";
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
    categoryIds: [await getCategoryId("tickets")],
  });

  const parsedProducts = JSON.stringify(
    products.map((product) => {
      if (!product.customAttributes) return { ...product, isExternal: false };

      let externalLink: boolean | string = "";

      for (const [key, value] of Object.entries(product.customAttributes)) {
        if (value.name === "external_link") {
          externalLink = value.stringValue;
        }
      }

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
