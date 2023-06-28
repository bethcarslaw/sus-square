import type { NextApiRequest, NextApiResponse } from 'next';
import { getSession } from 'next-auth/react';
import { squareClient } from '@config/square-client';

export default async function handle(
    req: NextApiRequest,
    res: NextApiResponse
) {
    const orderDetails = req.body;
    const session = await getSession({ req });

    if (!session) {
        res.status(401).send({ message: 'Unauthorized' });
    }

    console.log('ORDER: ', orderDetails);

    const squareRes = await squareClient.ordersApi.createOrder({
        order: orderDetails,
    });

    if (squareRes.statusCode !== 200) {
        res.send(squareRes.statusCode);
    }

    res.json(squareRes.result);
}
