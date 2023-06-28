import { CheckCircleIcon } from '@chakra-ui/icons';
import {
    Box,
    Button,
    Divider,
    Flex,
    FormControl,
    FormErrorMessage,
    FormLabel,
    Heading,
    HStack,
    Input,
    Select,
    SimpleGrid,
    Stack,
    Text,
} from '@chakra-ui/react';
import { Page } from '@components/Layout/Page/Page';
import { useCart } from '@hooks/useCart';
import { Steps, Step, useSteps } from '@hooks/useProgress';
import axios from 'axios';
import { countries } from 'countries-list';
import { GetStaticProps, NextPage } from 'next';
import { signIn, useSession } from 'next-auth/react';
import { useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import {
    PaymentForm,
    CreditCard,
    Afterpay,
    GooglePay,
    ApplePay,
} from 'react-square-web-payments-sdk';
import { v4 as uuidv4 } from 'uuid';

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
        // fulfillments: [
        //     // {
        //     //     type: 'PICKUP',
        //     //     state: 'PROPOSED',
        //     //     pickupDetails: {
        //     //         recipient: {
        //     //             displayName: 'Jaiden Urie',
        //     //         },
        //     //         autoCompleteDuration: 'P0DT1H0S',
        //     //         scheduleType: 'SCHEDULED',
        //     //         pickupAt: '2030-02-14T19:21:54.859Z',
        //     //         note: 'Pour over coffee',
        //     //     },
        //     // },
        // ],
    };

    const createOrder = async (formData) => {
        console.log('Form Data', formData);

        const updatedOrder = {
            ...orderDetails,
            fulfillments: [
                {
                    type: 'SHIPMENT',
                    state: 'PROPOSED',
                    shipment_details: {
                        recipient: {
                            display_name: `${formData.firstName} ${formData.lastName}`,
                            email_address: formData.email,
                            phone_number: formData.phone,
                            address: {
                                address_line_1: formData.address,
                                address_line_2: formData.address2
                                    ? formData.address2
                                    : '',
                                locality: formData.city,
                                administrative_district_level_1: formData.state,
                                postal_code: formData.postcode,
                                country: formData.country,
                                first_name: formData.firstName,
                                last_name: formData.lastName,
                            },
                        },
                        shipping_note: '',
                    },
                },
            ],
        };

        console.log('Order: ', updatedOrder);

        const orderRes = await axios.post('/api/orders/create', updatedOrder);

        console.log('Order Res:', orderRes);

        if (orderRes) {
            setOrder(orderRes.data.order);
        }
    };

    console.log(orderDetails);

    const completeOrder = async (res) => {
        console.log(res);
        if (res.status === 'OK') {
            const paymentRes = await axios.post('api/orders/complete', {
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

    const validateForm = async (fields?: string[]) => {
        if (fields) {
            const res = await trigger(fields);

            return !res;
        }
    };

    return (
        <Page maxW="900px">
            <Heading mb={10}>Checkout</Heading>
            <form onSubmit={handleSubmit(createOrder)}>
                <Steps>
                    <Step
                        heading="Contact Information"
                        validate={() =>
                            validateForm([
                                'firstName',
                                'lastName',
                                'email',
                                'phone',
                            ])
                        }
                    >
                        <SimpleGrid columns={2} spacing={4}>
                            <FormControl
                                isInvalid={errors.firstName ? true : false}
                            >
                                <FormLabel>First Name</FormLabel>
                                <Input
                                    type="text"
                                    {...register('firstName', {
                                        required: {
                                            value: true,
                                            message: 'First name is required.',
                                        },
                                    })}
                                />

                                <FormErrorMessage>
                                    <>{errors.firstName?.message}</>
                                </FormErrorMessage>
                            </FormControl>

                            <FormControl
                                isInvalid={errors.lastName ? true : false}
                            >
                                <FormLabel>Last Name</FormLabel>
                                <Input
                                    type="text"
                                    {...register('lastName', {
                                        required: {
                                            value: true,
                                            message: 'Last name is required.',
                                        },
                                    })}
                                />

                                <FormErrorMessage>
                                    <>{errors.lastName?.message}</>
                                </FormErrorMessage>
                            </FormControl>

                            <FormControl
                                isInvalid={errors.email ? true : false}
                            >
                                <FormLabel>Email</FormLabel>
                                <Input
                                    type="email"
                                    {...register('email', {
                                        required: {
                                            value: true,
                                            message: 'Email is required.',
                                        },
                                        pattern: {
                                            value: /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/g,
                                            message:
                                                'Please enter a valid email address.',
                                        },
                                    })}
                                />

                                <FormErrorMessage>
                                    <>{errors.email?.message}</>
                                </FormErrorMessage>
                            </FormControl>

                            <FormControl
                                isInvalid={errors.phone ? true : false}
                            >
                                <FormLabel>Phone</FormLabel>
                                <Input
                                    type="tel"
                                    {...register('phone', {
                                        required: {
                                            value: true,
                                            message: 'Phone is required.',
                                        },
                                        pattern: {
                                            value: /((\+\d{1,2}\s?)?1?\-?\.?\s?\(?\d{3}\)?[\s.-]?)?\d{3}[\s.-]?\d{4}/g,
                                            message:
                                                'Please enter a valid phone number.',
                                        },
                                    })}
                                />

                                <FormErrorMessage>
                                    <>{errors.phone?.message}</>
                                </FormErrorMessage>
                            </FormControl>
                        </SimpleGrid>
                    </Step>

                    <Step
                        heading="Shipping Details"
                        validate={() =>
                            validateForm([
                                'address',
                                'city',
                                'state',
                                'postcode',
                                'country',
                            ])
                        }
                    >
                        <SimpleGrid columns={2} spacing={4}>
                            <FormControl
                                isInvalid={errors.address ? true : false}
                                gridColumn="span 2/span 2"
                            >
                                <FormLabel>Address</FormLabel>
                                <Input
                                    type="text"
                                    {...register('address', {
                                        required: {
                                            value: true,
                                            message: 'Address is required.',
                                        },
                                    })}
                                />

                                <FormErrorMessage>
                                    <>{errors.address?.message}</>
                                </FormErrorMessage>
                            </FormControl>

                            <FormControl
                                isInvalid={errors.address2 ? true : false}
                                gridColumn="span 2/span 2"
                            >
                                <FormLabel>
                                    {`Apt num, suite (Optional)`}
                                </FormLabel>
                                <Input type="text" {...register('address2')} />

                                <FormErrorMessage>
                                    <>{errors.address2?.message}</>
                                </FormErrorMessage>
                            </FormControl>

                            <FormControl isInvalid={errors.city ? true : false}>
                                <FormLabel>City</FormLabel>
                                <Input
                                    type="text"
                                    {...register('city', {
                                        required: {
                                            value: true,
                                            message: 'City is required.',
                                        },
                                    })}
                                />

                                <FormErrorMessage>
                                    <>{errors.city?.message}</>
                                </FormErrorMessage>
                            </FormControl>

                            <FormControl
                                isInvalid={errors.state ? true : false}
                            >
                                <FormLabel>State / Province</FormLabel>
                                <Input
                                    type="text"
                                    {...register('state', {
                                        required: {
                                            value: true,
                                            message:
                                                'State / Province is required.',
                                        },
                                    })}
                                />

                                <FormErrorMessage>
                                    <>{errors.state?.message}</>
                                </FormErrorMessage>
                            </FormControl>

                            <FormControl
                                isInvalid={errors.postcode ? true : false}
                            >
                                <FormLabel>Zip / Postal Code</FormLabel>
                                <Input
                                    type="text"
                                    {...register('postcode', {
                                        required: {
                                            value: true,
                                            message:
                                                'Zip / Postal Code is required.',
                                        },
                                    })}
                                />

                                <FormErrorMessage>
                                    <>{errors.postcode?.message}</>
                                </FormErrorMessage>
                            </FormControl>

                            <FormControl
                                isInvalid={errors.country ? true : false}
                            >
                                <FormLabel>Country</FormLabel>
                                <Select
                                    {...register('country', {
                                        required: {
                                            value: true,
                                            message: 'Country is required.',
                                        },
                                    })}
                                >
                                    <option value="GB">United Kingdom</option>
                                    {Object.keys(countries).map((key) => (
                                        <option key={key} value={key}>
                                            {countries[key].name}
                                        </option>
                                    ))}
                                </Select>

                                <FormErrorMessage>
                                    <>{errors.country?.message}</>
                                </FormErrorMessage>
                            </FormControl>
                        </SimpleGrid>
                    </Step>

                    <Step heading="Shipping Options">
                        <SimpleGrid columns={2} spacing={4}>
                            <Stack
                                border="1px solid rgba(255,255,255,0.1)"
                                p="20px"
                                cursor="pointer"
                                bg="rgba(255,255,255,0.05)"
                            >
                                <Stack direction="row">
                                    <Box>
                                        <Heading size="sm">
                                            Standard postage
                                        </Heading>
                                        <Stack
                                            direction="row"
                                            justify="space-between"
                                        >
                                            <Text opacity="0.7">
                                                {'3 - 5 days after shipping'}
                                            </Text>
                                            <Text opacity="0.7">{'£2.00'}</Text>
                                        </Stack>
                                    </Box>
                                    <Flex
                                        pl="30px"
                                        justify="center"
                                        align="center"
                                    >
                                        <CheckCircleIcon />
                                    </Flex>
                                </Stack>
                            </Stack>
                        </SimpleGrid>
                    </Step>
                    <Step heading="Summary">
                        <SimpleGrid columns={2} spacing={4}>
                            <Box>Summary</Box>
                            <Button type="submit">Proceed to payment</Button>
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
                        countryCode: 'UK',
                        currencyCode: 'GBP',
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
