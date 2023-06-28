import { CartItemVariation } from "@hooks/useCart";
import { CustomAttributeFilter } from "square";
import { squareClient } from "../../config/square-client";

export interface Product {
  id: string;
  name: string;
  price: string | bigint;
  image_urls: string[];
  category: string;
  variations: Variation[];
  in_stock: boolean;
  slug: string;
  description: string;
  customAttributes?: CustomAttributes;
}

interface CustomAttributes {
  [key: string]: string | number | boolean | string[];
}

interface Variation {
  id: string;
  name: string;
  price: string | bigint;
  in_stock: boolean;
  stock: number;
}

interface ProductQuery {
  textFilter?: string;
  categoryIds?: string[];
  customAttributeFilters?: CustomAttributeFilter[];
  limit?: number;
}

const getProducts = async (productQuery: ProductQuery) => {
  try {
    const catalogResponse = await squareClient.catalogApi.searchCatalogItems(
      productQuery
    );

    if (!catalogResponse.result.items) {
      return [];
    }

    const products =
      catalogResponse.result.items.map(async (object) => {
        const basePrice =
          object!.itemData!.variations![0].itemVariationData!.priceMoney!
            .amount;

        const imageUrls = await getImagesById(object.itemData.imageIds);

        const itemVariations =
          (await Promise.all(
            object.itemData!.variations?.map(async (variation) => {
              const stockRes =
                await squareClient.inventoryApi.retrieveInventoryCount(
                  variation.id
                );

              const stockCount = stockRes.result.counts
                ? stockRes.result?.counts[0]?.quantity
                : 0;

              return {
                id: variation.id,
                name: variation.itemVariationData!.name || "",
                price: variation.itemVariationData!.priceMoney!.amount || "",
                in_stock:
                  variation.itemVariationData?.locationOverrides &&
                  variation.itemVariationData?.locationOverrides![0].soldOut
                    ? false
                    : true,
                stock: stockCount,
              };
            })
          )) || [];

        const isInStock = true;

        const itemCategory = await getCategoryById(object.itemData.categoryId);

        const customAttributes: CustomAttributes = {};

        if (object.customAttributeValues) {
          Object.keys(object.customAttributeValues).forEach((key) => {
            const attribute = object.customAttributeValues[key];

            customAttributes[attribute.name] =
              attribute.stringValue ||
              attribute.numberValue ||
              attribute.booleanValue ||
              attribute.selectionUidValues;
          });
        }

        return {
          id: object.id,
          name: object.itemData!.name || "",
          customAttributes,
          price: basePrice || "",
          image_urls: imageUrls,
          variations: itemVariations,
          in_stock: isInStock,
          category: itemCategory,
          description: object.itemData!.description || "",
          slug: object.itemData!.name.replace(/\W+/g, "-").toLowerCase(),
        };
      }) || [];

    return Promise.all(products);
  } catch (error) {
    console.log(error);

    return [];
  }
};

const getImagesById = async (ids: string[]) => {
  if (!ids) return [];

  const imageUrls = ids.flatMap(async (id) => {
    const imageRes = await squareClient.catalogApi.retrieveCatalogObject(id);

    return imageRes.result.object.imageData.url;
  });

  return Promise.all(imageUrls);
};

const getCategoryById = async (id: string) => {
  const cat = await squareClient.catalogApi.retrieveCatalogObject(id);

  return cat.result.object.categoryData.name;
};

const checkIfOutOfStock = async (cartItems: CartItemVariation[]) => {
  const res = await squareClient.inventoryApi.batchRetrieveInventoryCounts({
    catalogObjectIds: cartItems.flatMap((item) => item.id),
  });

  if (!res.result.counts) {
    throw new Error("No inventory counts found");
  }

  const outOfStockItems = cartItems.reduce((outOfStockItems, item) => {
    const count = res.result.counts.find(
      (count) => count.catalogObjectId === item.id
    );

    if (count?.state === "OUT_OF_STOCK") {
      outOfStockItems.push({ ...item, adjustBy: item.quantity });
    }

    if (item.quantity > parseInt(count.quantity)) {
      outOfStockItems.push({
        ...item,
        adjustBy: item.quantity - parseInt(count.quantity),
      });
    }

    return outOfStockItems;
  }, []);

  console.log(outOfStockItems);

  return outOfStockItems;
};

export { getProducts, checkIfOutOfStock };
