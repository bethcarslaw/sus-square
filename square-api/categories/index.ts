import { squareClient } from "@config/square-client";

const getCategoryId = async (categoryName: string) => {
  try {
    const categories = await squareClient.catalogApi.searchCatalogObjects({
      objectTypes: ["CATEGORY"],
    });

    const category = categories.result.objects.find(
      (category) =>
        category.categoryData.name.toLowerCase() === categoryName.toLowerCase()
    );

    if (!category) {
      throw new Error(`Category "${categoryName}" does not exist.`);
    }

    return category.id;
  } catch (error) {
    console.log(error);
    return "";
  }
};

export { getCategoryId };
