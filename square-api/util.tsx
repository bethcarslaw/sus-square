import { Order as SquareOrder } from "square";

const sanitizeOrder = (order: SquareOrder) => ({
  id: order.id,
  createdAt: order.createdAt,
  customerId: order.customerId,
  total: order.totalMoney,
  state: order.state,
  fulfillments: order.fulfillments,
  lineItems: order.lineItems,
});

export { sanitizeOrder };
