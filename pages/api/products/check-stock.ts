import type { NextApiRequest, NextApiResponse } from "next";
import { checkIfOutOfStock, Product } from "@square-api/products";
import { CartItem } from "@hooks/useCart";

export default async function handle(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const products: CartItem[] = req.body;

  if (!products || products.length < 1) {
    res.send([]);
  }

  const stockRes = await checkIfOutOfStock(
    products.flatMap((product) => product.variation)
  );

  res.send(stockRes);
}
