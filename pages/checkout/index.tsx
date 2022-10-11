import { Box, Button, Divider, Heading, HStack, Stack } from "@chakra-ui/react";
import { useCart } from "@hooks/useCart";
import axios from "axios";
import { GetStaticProps, NextPage } from "next";
import { signIn, useSession } from "next-auth/react";
import { useMemo, useState } from "react";
import {
  PaymentForm,
  CreditCard,
  Afterpay,
  GooglePay,
  ApplePay,
} from "react-square-web-payments-sdk";
import { v4 as uuidv4 } from "uuid";

interface CheckoutProps {
  applicationID: string;
  locationID: string;
}

const Checkout: NextPage = ({ applicationID, locationID }: CheckoutProps) => {
  const { products, clearCart } = useCart();
  const { data: session } = useSession({
    required: true,
    onUnauthenticated() {
      signIn();
    },
  });
  const [order, setOrder] = useState(null);
  const idemKey = useMemo(() => uuidv4(), []);

  // const paymentRequest = () => ({
  //   countryCode: "UK",
  //   currencyCode: "GBP",
  //   lineItems: [
  //     {
  //       amount: "22.15",
  //       label: "Item to be purchased",
  //       id: "SKU-12345",
  //       imageUrl: "https://url-cdn.com/123ABC",
  //       pending: true,
  //       productUrl: "https://my-company.com/product-123ABC",
  //     },
  //   ],
  //   requestBillingContact: false,
  //   requestShippingContact: false,
  //   shippingOptions: [
  //     {
  //       label: "Next Day",
  //       amount: "15.69",
  //       id: "1",
  //     },
  //     {
  //       label: "Three Day",
  //       amount: "2.00",
  //       id: "2",
  //     },
  //   ],
  //   // pending is only required if it's true.
  //   total: {
  //     amount: "41.79",
  //     label: "Total",
  //   },
  //   pickupContact: {
  //     addressLines: ["123 Main St"],
  //     city: "San Francisco",
  //     countryCode: "US",
  //     email: "john@doe.com",
  //     familyName: "Doe",
  //     givenName: "John",
  //     phone: "4155555555",
  //     postalCode: "94107",
  //     state: "CA",
  //   },
  // });

  const orderDetails = {
    locationId: locationID,
    idempotencyKey: idemKey,
    lineItems: products.map((product) => {
      return {
        quantity: "1",
        catalogObjectId: product.variation,
      };
    }),
    fulfillments: [
      {
        type: "PICKUP",
        state: "PROPOSED",
        pickupDetails: {
          recipient: {
            displayName: "Jaiden Urie",
          },
          autoCompleteDuration: "P0DT1H0S",
          scheduleType: "SCHEDULED",
          pickupAt: "2030-02-14T19:21:54.859Z",
          note: "Pour over coffee",
        },
      },
    ],
  };

  const createOrder = async () => {
    const orderRes = await axios.post("/api/orders/create", orderDetails);

    console.log(orderRes);

    if (orderRes) {
      setOrder(orderRes.data.order);
    }
  };

  console.log(orderDetails);

  const completeOrder = async (res) => {
    console.log(res);
    if (res.status === "OK") {
      const paymentRes = await axios.post("api/orders/complete", {
        order,
        paymentId: res.token,
        idemKey,
      });

      console.log(paymentRes);
    }
  };

  return (
    <div style={{ marginTop: "50px" }}>
      <Heading>Checkout</Heading>

      <Button onClick={() => createOrder()}>Create Order</Button>
      {order && (
        <PaymentForm
          applicationId={applicationID}
          locationId={locationID}
          cardTokenizeResponseReceived={(res) => completeOrder(res)}
          createPaymentRequest={() => ({
            countryCode: "UK",
            currencyCode: "GBP",
            ...order,
          })}
        >
          <Stack textAlign="center">
            <Stack>
              <CreditCard />
            </Stack>

            <HStack>
              <Divider />
              <Box>or</Box>
              <Divider />
            </HStack>

            <Stack>
              <ApplePay />
              <GooglePay buttonColor="black" />
              <Afterpay />
            </Stack>
          </Stack>
        </PaymentForm>
      )}
    </div>
  );
};

export const getStaticProps: GetStaticProps = () => {
  return {
    props: {
      applicationID: process.env.SANDBOX_SQUARE_APP_ID,
      locationID: process.env.SANDBOX_SQUARE_LOCATION_ID,
    },
  };
};

export default Checkout;
