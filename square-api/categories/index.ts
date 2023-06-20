import { squareClient } from "@config/square-client";

const getCategoryIdsByName = async (categoryNames: string[]) => {
  try {
    const categoriesRes = await squareClient.catalogApi.searchCatalogObjects({
      objectTypes: ["CATEGORY"],
    });

    if (
      !categoriesRes ||
      !categoriesRes.result ||
      !categoriesRes.result.objects
    ) {
      return [];
    }

    const categoryIds = categoriesRes.result.objects
      .filter((category) =>
        categoryNames.includes(category.categoryData.name.toLowerCase())
      )
      .flatMap((category) => category.id);

    return categoryIds;
  } catch (error) {
    console.log(error);
    return [];
  }
};

export { getCategoryIdsByName };
