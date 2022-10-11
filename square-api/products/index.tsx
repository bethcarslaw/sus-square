import { CartItemVariation } from "@hooks/useCart";
import { CatalogObject } from "square";
import { squareClient } from "../../config/square-client";

export interface Product {
  id: string;
  name: string;
  price: string | bigint;
  image_urls: (string | undefined)[] | undefined;
  category: string;
  variations: Variation[];
  in_stock: boolean;
  slug: string;
}

interface Variation {
  id: string;
  name: string;
  price: string | bigint;
  in_stock: boolean;
}

const getProducts = async () => {
  try {
    const catalogResponse = await squareClient.catalogApi.searchCatalogObjects({
      objectTypes: ["ITEM"],
      includeRelatedObjects: true,
    });

    console.log(catalogResponse);

    const products: Product[] =
      catalogResponse.result.objects!.map((object) => {
        const basePrice =
          object!.itemData!.variations![0].itemVariationData!.priceMoney!
            .amount;

        const imageUrls = catalogResponse.result
          .relatedObjects!.filter((relatedObj) =>
            object.itemData!.imageIds?.includes(relatedObj.id)
          )
          .map((image) => image.imageData!.url);

        const itemVariations =
          object.itemData!.variations?.map((variation) => {
            return {
              id: variation.id,
              name: variation.itemVariationData!.name || "",
              price: variation.itemVariationData!.priceMoney!.amount || "",
              in_stock:
                variation.itemVariationData!.locationOverrides![0].soldOut ||
                true,
            };
          }) || [];

        const isInStock = object.itemData!.variations!.every(
          (variation) =>
            variation.itemVariationData!.locationOverrides![0].soldOut
        );

        const itemCategory =
          (object.itemData!.categoryId &&
            catalogResponse.result.relatedObjects!.find(
              (relatedObj) => relatedObj.id === object.itemData!.categoryId
            )!.categoryData!.name) ||
          "";

        return {
          id: object.id,
          name: object.itemData!.name || "",
          price: basePrice || "",
          image_urls: imageUrls,
          variations: itemVariations,
          in_stock: isInStock,
          category: itemCategory,
          slug: object.itemData!.name.replace(/\W+/g, "-").toLowerCase(),
        };
      }) || [];

    return products;
  } catch (error) {
    console.log(error);

    return [];
  }
};

const checkIfOutOfStock = async (cartItems: CartItemVariation[]) => {
  const res = await squareClient.catalogApi.batchRetrieveCatalogObjects({
    objectIds: cartItems.flatMap((item) => item.id),
  });

  if (!res) {
    console.error("Failed to retrieve catalog objects");
    return [];
  }

  const objectsOutOfStock = res.result.objects.flatMap((catalogObject) => {
    if (catalogObject.itemVariationData.locationOverrides[0].soldOut) {
      return catalogObject.id;
    }

    return;
  });

  return res.result.objects;
};

export { getProducts, checkIfOutOfStock };
