import { CartItemVariation } from "@hooks/useCart";
import {
  CatalogQuery,
  CatalogCustomAttributeValue,
  CustomAttributeFilter,
} from "square";
import { squareClient } from "../../config/square-client";

export interface Product {
  id: string;
  name: string;
  price: string | bigint;
  image_urls: Promise<string[]>;
  category: string;
  variations: Variation[];
  in_stock: boolean;
  slug: string;
  customAttributes?: Record<string, CatalogCustomAttributeValue>;
}

interface Variation {
  id: string;
  name: string;
  price: string | bigint;
  in_stock: boolean;
}

interface ProductQuery {
  textFilter?: string;
  categoryIds?: string[];
  customAttributeFilters?: CustomAttributeFilter[];
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
          object.itemData!.variations?.map((variation) => {
            return {
              id: variation.id,
              name: variation.itemVariationData!.name || "",
              price: variation.itemVariationData!.priceMoney!.amount || "",
              in_stock:
                variation.itemVariationData?.locationOverrides![0].soldOut ||
                true,
            };
          }) || [];

        const isInStock = true;

        const itemCategory = await getCategoryById(object.itemData.categoryId);

        return {
          id: object.id,
          name: object.itemData!.name || "",
          customAttributes: object.customAttributeValues,
          price: basePrice || "",
          image_urls: imageUrls,
          variations: itemVariations,
          in_stock: isInStock,
          category: itemCategory,
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

    console.log(imageRes.result.object.imageData);
    return imageRes.result.object.imageData.url;
  });

  return Promise.all(imageUrls);
};

const getCategoryById = async (id: string) => {
  const cat = await squareClient.catalogApi.retrieveCatalogObject(id);

  return cat.result.object.categoryData.name;
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
