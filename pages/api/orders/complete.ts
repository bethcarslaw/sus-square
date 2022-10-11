import type { NextApiRequest, NextApiResponse } from "next";
import prisma from "../../../lib/prisma";
import { getSession } from "next-auth/react";
import { squareClient } from "@config/square-client";

export default async function handle(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { order, paymentId, idemKey } = req.body;
  const session = await getSession({ req });

  if (!session) {
    res.status(401).send({ message: "Unauthorized" });
  }

  const paymentRes = await squareClient.paymentsApi.createPayment({
    sourceId: paymentId,
    idempotencyKey: idemKey,
    amountMoney: {
      amount: BigInt(order.totalMoney.amount),
      currency: "GBP",
    },
    orderId: order.id,
  });

  if (paymentRes.statusCode !== 200) {
    res.status(500).send({
      message:
        "Something went wrong processing the payment for this order. Please try again.",
    });
  }

  const prismaRes = await prisma.order.create({
    data: {
      order_ref: order.id,
      user: { connect: { email: session.user?.email } },
    },
  });

  if (!prismaRes) {
    res.status(500).send({
      message:
        "There was an issue associating this order to your account. Please contact us at contact@sufferundersorrow.com",
    });
  }

  res.status(200).send(`Successfully created order ${order.id}`);
}
