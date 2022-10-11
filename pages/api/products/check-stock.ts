import type { NextApiRequest, NextApiResponse } from "next";
import { checkIfOutOfStock, Product } from "@square-api/products";
import { CartItem } from "@hooks/useCart";

export default async function handle(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const products: CartItem[] = req.body;

  if (products.length < 1) {
    res.send([]);
  }

  console.log("PRODUCTS: ", req.body);

  const stockRes = await checkIfOutOfStock(
    products.flatMap((product) => product.variation)
  );

  console.log("STOCK RES", stockRes);

  res.send(stockRes);
}
