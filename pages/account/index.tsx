import React from "react";
import { GetServerSideProps, NextPage } from "next";
import prisma from "../../lib/prisma";
import { getSession, signIn, useSession } from "next-auth/react";
import { squareClient } from "@config/square-client";

interface AccountProps {
  orders: any[];
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

  const orders = JSON.stringify(ordersRes.result);

  return {
    props: JSON.parse(orders),
  };
};

const Account: NextPage = (props: AccountProps) => {
  const { data: session } = useSession({
    required: true,
    onUnauthenticated() {
      signIn();
    },
  });

  return <div>User Profile</div>;
};

export default Account;
