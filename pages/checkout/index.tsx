import {
  Accordion,
  AccordionItem,
  AccordionPanel,
  Box,
  Button,
  Divider,
  FormControl,
  FormLabel,
  Heading,
  HStack,
  Input,
  Select,
  SimpleGrid,
  Stack,
} from "@chakra-ui/react";
import { Page } from "@components/Layout/Page/Page";
import { useCart } from "@hooks/useCart";
import { Steps, Step } from "@hooks/useProgress";
import axios from "axios";
import { countries } from "countries-list";
import { GetStaticProps, NextPage } from "next";
import { signIn, useSession } from "next-auth/react";
import { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
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
  countires: string[];
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
  const {
    register,
    handleSubmit,
    trigger,
    watch,
    formState: { errors },
  } = useForm();

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
        quantity: product.variation.quantity.toString(),
        catalogObjectId: product.variation.id,
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

  const handleFormSubmit = async (event) => {
    console.log(event);
  };

  const validateForm = (fields?: string[]) => {
    if (fields) {
      trigger(fields);
      console.log("errors:" + errors);
      return errors ? false : true;
    }
  };

  return (
    <Page maxW="900px">
      <Heading mb={10}>Checkout</Heading>
      <form onSubmit={handleSubmit(handleFormSubmit)}>
        <Steps>
          <Step
            heading="Contact Information"
            validate={() => validateForm(["firstName"])}
          >
            <SimpleGrid columns={2} spacing={4}>
              <FormControl>
                <FormLabel>First Name</FormLabel>
                <Input
                  type="text"
                  {...register("firstName", { required: true })}
                />
              </FormControl>

              <FormControl>
                <FormLabel>Last Name</FormLabel>
                <Input type="text" />
              </FormControl>

              <FormControl>
                <FormLabel>Email</FormLabel>
                <Input type="email" />
              </FormControl>

              <FormControl>
                <FormLabel>Phone</FormLabel>
                <Input type="phone" />
              </FormControl>
            </SimpleGrid>
          </Step>

          <Step heading="Shipping Details">
            <SimpleGrid columns={2} spacing={4}>
              <FormControl gridColumn="span 2/span 2">
                <FormLabel>Address</FormLabel>
                <Input type="text" />
              </FormControl>

              <FormControl gridColumn="span 2/span 2">
                <FormLabel>Apt num, Suite</FormLabel>
                <Input type="text" />
              </FormControl>

              <FormControl>
                <FormLabel>City</FormLabel>
                <Input type="text" />
              </FormControl>

              <FormControl>
                <FormLabel>State / Province</FormLabel>
                <Input type="text" />
              </FormControl>

              <FormControl>
                <FormLabel>Zip / Postal Code</FormLabel>
                <Input type="text" />
              </FormControl>

              <FormControl>
                <FormLabel>Country</FormLabel>
                <Select>
                  <option value="GB">United Kingdom</option>
                  {Object.keys(countries).map((key) => (
                    <option key={key} value={key}>
                      {countries[key].name}
                    </option>
                  ))}
                </Select>
              </FormControl>
            </SimpleGrid>
          </Step>
        </Steps>
      </form>
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
    </Page>
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
