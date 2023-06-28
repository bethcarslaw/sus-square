import { CatalogObject, Order as SquareOrder } from "square";
import { squareClient } from "@config/square-client";

const sanitizeOrder = (order: SquareOrder) => ({
  id: order.id,
  createdAt: order.createdAt,
  customerId: order.customerId,
  total: order.totalMoney,
  state: order.state,
  fulfillments: order.fulfillments,
  lineItems: order.lineItems,
});

const getCustomAttributeId = async (attributeName: string) => {
  try {
    const attributes = await squareClient.catalogApi.searchCatalogObjects({
      objectTypes: ["CUSTOM_ATTRIBUTE_DEFINITION"],
    });

    const attribute = attributes.result.objects.find(
      (attribute) =>
        attribute.customAttributeDefinitionData.name.toLowerCase() ===
        attributeName.toLowerCase()
    );

    if (!attribute) {
      throw new Error(`Attribute "${attributeName}" does not exist.`);
    }

    return attribute.id;
  } catch (error) {
    console.log(error);
    return "";
  }
};

export { sanitizeOrder, getCustomAttributeId };
