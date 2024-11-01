import React from "react";
import { GetServerSideProps, NextPage } from "next";
import prisma from "../../lib/prisma";
import { getSession, signIn, useSession } from "next-auth/react";
import { squareClient } from "@config/square-client";
import { Box, Heading } from "@chakra-ui/react";
import { sanitizeOrder } from "@square-api/util";

interface AccountProps {
  orders: ReturnType<typeof sanitizeOrder>[];
}

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const session = await getSession(ctx);

  const prismaOrders = await prisma.order.findMany({
    where: {
      user: session.user,
    },
  });

  const orderIds = prismaOrders.flatMap((order) => order.order_ref);

  const ordersRes = await squareClient.ordersApi.batchRetrieveOrders({
    locationId: process.env.SANDBOX_SQUARE_LOCATION_ID,
    orderIds,
  });

  const sanitizedOrders = ordersRes.result.orders.map((order) =>
    sanitizeOrder(order)
  );

  const orders = JSON.stringify({ orders: sanitizedOrders });

  return {
    props: JSON.parse(orders),
  };
};

const Account: NextPage = ({ orders }: AccountProps) => {
  const { data: session } = useSession({
    required: true,
    onUnauthenticated() {
      signIn();
    },
  });

  console.log(orders);

  return (
    <Box mt="50px">
      <Heading>{session?.user?.name}</Heading>
      <Heading size="sm">Orders</Heading>
      <ul>
        {orders.map((order) => (
          <li key={order.id}>{order.id}</li>
        ))}
      </ul>
    </Box>
  );
};

export default Account;
