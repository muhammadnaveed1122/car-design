import { Box, Button, Container, Grid, Modal, Text, Title, Group, Loader, Stack } from '@mantine/core'
import Stripe from "stripe";
import { useDisclosure, useMediaQuery } from '@mantine/hooks';
import { useForm } from '@mantine/form';
import { toastShow } from "@/helpers";
import { fetchWrapper } from "@/helpers";
import { paymentService } from "@/services";
import { packageService } from "@/services";
import React, { useRef } from 'react'
import { scan } from 'rxjs'
import {
    useStripe,
    useElements,
    CardNumberElement,
    CardExpiryElement,
    CardCvcElement,
} from "@stripe/react-stripe-js";
import getConfig from "next/config";
import { useState } from 'react';
import { userService } from "@/services";
import { useRouter } from 'next/router';
const AdvertisingPrices = ({ dark }) => {
    const matches = useMediaQuery('(max-width: 1200px)');
    const [opened, { open, close }] = useDisclosure(false);
    const { publicRuntimeConfig } = getConfig();
    const baseUrl = `${publicRuntimeConfig.apiUrl}/stripe/checkout`;
    const stripeSecret = new Stripe(publicRuntimeConfig.StripeSecretKey);
    const stripe = useStripe();
    const cardNumberRef = useRef(null);
    const elements = useElements();
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const [modelData, setModelData] = useState({})
    const router = useRouter()
    const form = useForm({
        initialValues: {
            cardNumber: '',
            expiryDate: '',
            cvc: '',
        },

        validate: {
            cardNumber: (value) => (value ? null : 'card number is required'),
            expiryDate: (value) => (value ? null : 'Expiry date is required'),
            cvc: (value) => (value ? null : 'CVC is required'),
        },
    });
    const handleSubmit = async (values) => {
        setLoading(true);
        setError(null);

        if (!stripe || !elements) {
            setError("Stripe has not loaded yet. Please try again later.");
            setLoading(false);
            return;
        }

        // Validate form fields
        const cardElement = elements.getElement(CardNumberElement);
        const expiryElement = elements.getElement(CardExpiryElement);
        const cvcElement = elements.getElement(CardCvcElement);
        if (!cardElement) {
            setError("Card number is required.");
            setLoading(false);
            return;
        }

        if (!expiryElement) {
            setError("Expiration date is required.");
            setLoading(false);
            return;
        }

        if (!cvcElement) {
            setError("CVC is required.");
            setLoading(false);
            return;
        }

        try {
            // Create a payment intent on the server
            const response = await stripeSecret.paymentIntents.create({
                amount: modelData?.price * 100, // amount in cents
                currency: "usd",
                payment_method_types: ["card"],
            });
            const { client_secret, error: serverError } = response;
            if (serverError) {
                setError(serverError);
                setLoading(false);
                return;
            }

            const { error: stripeError, paymentIntent } =
                await stripe.confirmCardPayment(client_secret, {
                    payment_method: {
                        card: cardElement,
                    },
                });

            if (stripeError) {
                setError(stripeError.message);
                setLoading(false);
            } else if (paymentIntent && paymentIntent.status === "succeeded") {
                const paymentData = {
                    userName: userService.userValue.displayName,
                    UserId: userService.userValue.id,
                    paymentResponse: JSON.stringify(paymentIntent),
                }
                const paymentCreate = await paymentService.create(paymentData)
                const packageData = {
                    packageName: modelData.type,
                    carCount: modelData.carCount,
                    remainingCount: modelData.carCount,
                    price: modelData.price,
                    userId: userService.userValue.id,
                    PaymentId: paymentCreate.data.id,
                }
                const packageCreate = await packageService.create(packageData);
                if (packageCreate) {
                    close();
                    toastShow(packageCreate.message)
                }

                setLoading(false);
            } else {
                setError("Payment failed for an unknown reason.");
                setLoading(false);
            }
        } catch (err) {
            setError("An unexpected error occurred. Please try again." + err.message);
            setLoading(false);
        }
    }
    const openModel = (data) => {
        if (!userService.userValue) {
            localStorage.setItem("packageData", JSON.stringify(data));
            router.push('/seller-signup')
            return false;
        }

        // open();
        // setModelData(data)
    }
    console.log(userService.userValue, "userService.userValue")
    return (
        <>
            <Modal opened={opened} onClose={close} centered radius={25}>
                <form onSubmit={form.onSubmit(handleSubmit)}>

                    <Group justify='space-between' c={'#fff'} mb={'md'}>
                        <Text fw={700}>Price</Text>
                        <Text fw={700} component='span'>€ {modelData?.price}</Text>
                    </Group>

                    <Text ta='center'>{modelData?.description}</Text>
                    <Box mb="md">
                        <Text style={{ color: "#fff", marginBottom: "5px" }}>Card Number</Text>
                        <Box
                            style={{
                                marginBottom: "20px",
                                backgroundColor: "#444",
                                padding: "10px",
                                borderRadius: "4px",
                            }}
                        >
                            <CardNumberElement
                                options={{
                                    style: {
                                        base: {
                                            iconColor: "#fff",
                                            color: "#fff",
                                            fontWeight: "500",
                                            fontFamily: "Roboto, Open Sans, Segoe UI, sans-serif",
                                            fontSize: "16px",
                                            fontSmoothing: "antialiased",
                                            ":-webkit-autofill": {
                                                color: "#fce883",
                                            },
                                            "::placeholder": {
                                                color: "#87BBFD",
                                            },
                                        },
                                        invalid: {
                                            iconColor: "#FFC7EE",
                                            color: "#FFC7EE",
                                        },
                                    },
                                }}
                                name="cardNumber"
                                onBlur={() => form.validateField('cardNumber')}
                                {...form.getInputProps('cardNumber')}

                            />
                        </Box>
                        {form.errors.cardNumber && (
                            <Text color="red" size="sm" mt="xs">
                                {form.errors.cardNumber}
                            </Text>
                        )}
                    </Box>

                    <Group grow mb="md">
                        <Box>
                            <Text style={{ color: "#fff", marginBottom: "5px" }}>
                                Expiration Date
                            </Text>
                            <Box
                                style={{
                                    backgroundColor: "#444",
                                    padding: "10px",
                                    borderRadius: "4px",
                                }}
                            >
                                <CardExpiryElement
                                    options={{
                                        style: {
                                            base: {
                                                iconColor: "#fff",
                                                color: "#fff",
                                                fontWeight: "500",
                                                fontFamily: "Roboto, Open Sans, Segoe UI, sans-serif",
                                                fontSize: "16px",
                                                fontSmoothing: "antialiased",
                                                ":-webkit-autofill": {
                                                    color: "#fce883",
                                                },
                                                "::placeholder": {
                                                    color: "#87BBFD",
                                                },
                                            },
                                            invalid: {
                                                iconColor: "#FFC7EE",
                                                color: "#FFC7EE",
                                            },
                                        },
                                    }}
                                    name="expiryDate"
                                    {...form.getInputProps('expiryDate')}
                                    onBlur={() => form.validateField('expiryDate')}

                                />

                            </Box>
                            {form.errors.expiryDate && (
                                <Text color="red" size="sm" mt="xs">
                                    {form.errors.expiryDate}
                                </Text>
                            )}
                        </Box>

                        <Box>
                            <Text style={{ color: "#fff", marginBottom: "5px" }}>Security CVC</Text>
                            <Box
                                style={{
                                    backgroundColor: "#444",
                                    padding: "10px",
                                    borderRadius: "4px",
                                }}
                            >
                                <CardCvcElement
                                    options={{
                                        style: {
                                            base: {
                                                iconColor: "#fff",
                                                color: "#fff",
                                                fontWeight: "500",
                                                fontFamily: "Roboto, Open Sans, Segoe UI, sans-serif",
                                                fontSize: "16px",
                                                fontSmoothing: "antialiased",
                                                ":-webkit-autofill": {
                                                    color: "#fce883",
                                                },
                                                "::placeholder": {
                                                    color: "#87BBFD",
                                                },
                                            },
                                            invalid: {
                                                iconColor: "#FFC7EE",
                                                color: "#FFC7EE",
                                            },
                                        },
                                    }}
                                    name="cvc"
                                    onBlur={() => form.validateField('cvc')}
                                    {...form.getInputProps('cvc')}

                                />
                            </Box>
                            {form.errors.cvc && (
                                <Text color="red" size="sm" mt="xs">
                                    {form.errors.cvc}
                                </Text>
                            )}
                        </Box>
                    </Group>
                    {loading ? (
                        <Group position="center">
                            <Loader />
                        </Group>
                    ) : (
                        <Button
                            type="submit"
                            fullWidth
                            color='#3CDFCD'
                            c='#000'
                            radius="xl"
                            size="md"
                            style={{ marginTop: "10px" }}
                            disabled={!stripe || loading}
                        >
                            Pay
                        </Button>
                    )}

                    {error && <Text color="red" align="center" mt="md">{error}</Text>}
                </form>
            </Modal>
            <Container size="xl" py={{ base: '60', sm: '80' }} c={dark ? '#fff' : '#000'}>
                <Title order={2} ta='center' fz={{ base: 32, sm: 40, lg: 45 }} mb={{ base: 30, sm: 60, md: 80 }}>
                    Advertising <Text component="span" fw={700} c='#3CDFCD' fz={'inherit'}>Prices</Text>
                </Title>
                <Grid gutter={{ base: 20, lg: 0 }} c={dark ? 'white' : '#000'} justify='center'>
                    <Grid.Col span={{ base: 12, sm: 6, lg: 3 }} ta={'center'} style={{ transform: matches ? 'scale(1)' : 'scale(1.08)', zIndex: 10 }}>
                        <Box bg={dark ? '#141414' : '#fff'} bd='1px solid #707070' pb={40} style={{ borderRadius: '30px', overflow: 'hidden' }}>
                            <Box bg={'#3CDFCD'} h={{ base: 140, sm: 175 }} p={{ base: '20 10', sm: '30 20' }} pos={'relative'} style={{ borderRadius: '30px' }}>
                                <Title order={4} fz={30} c={'#06070A'}>Simple</Title>
                                <Box bg={'#FFFFFF'} bd='1px solid #C9C9C9' w={{ base: '100', sm: '135' }} h={{ base: '100', sm: '135' }} left={'50%'} bottom={{ base: '-40%', sm: '-50%' }} pos={'absolute'} style={{ borderRadius: '50%', transform: 'translate( -50%, -20%)' }} p={{ base: '20 10', sm: '30 20' }}>
                                    <Text component='span' c={'#06070A'} fw={700} fz={{ base: 30, sm: 40 }} lh={1}>€ 9</Text>
                                    <Text c={'#06070A'} fz={14} lh={1}>For 1 car</Text>
                                </Box>
                            </Box>
                            <Stack gap={{ base: 15, sm: 20 }} p={{ base: '60 20 30', sm: '100 30 40' }}>
                                <Text fz={16}>Attract buyers - show off your vehicles' best features with up to 100 photos</Text>
                                <Text fz={16}>Stand out with photos in search results</Text>
                                <Text fz={16}>1 car for Euro 9</Text>
                            </Stack>
                            <Button variant='filled' color='#3CDFCD' c="#0C0000" size='md' radius='xl' onClick={() => openModel({ price: 25, description: "2 to 5 for each Euro 5 for each", type: "Premium", carCount: 5 })}>Buy Now</Button>
                        </Box>
                    </Grid.Col>
                    <Grid.Col span={{ base: 12, sm: 6, lg: 3 }} ta={'center'}>
                        <Box bg={dark ? '#141414' : '#fff'} bd='1px solid #707070' pb={40} style={{ borderRadius: '30px', overflow: 'hidden' }}>
                            <Box bg={'#C9C9C9'} h={{ base: 140, sm: 175 }} p={{ base: '20 10', sm: '30 20' }} pos={'relative'} style={{ borderRadius: '30px' }}>
                                <Title order={4} fz={30} c={'#06070A'}>Basic</Title>
                                <Box bg={'#FFFFFF'} bd='1px solid #C9C9C9' w={{ base: '100', sm: '135' }} h={{ base: '100', sm: '135' }} left={'50%'} bottom={{ base: '-40%', sm: '-50%' }} pos={'absolute'} style={{ borderRadius: '50%', transform: 'translate( -50%, -20%)' }} p={{ base: '20 10', sm: '30 20' }}>
                                    <Text component='span' c={'#06070A'} fw={700} fz={{ base: 30, sm: 40 }} lh={1}>€ 9</Text>
                                    <Text c={'#06070A'} fz={14} lh={1}>For 1 car</Text>
                                </Box>
                            </Box>
                            <Stack gap={{ base: 15, sm: 20 }} p={{ base: '60 20 30', sm: '100 30 40' }}>
                                <Text fz={16}>Attract buyers - show off your vehicles' best features with up to 100 photos</Text>
                                <Text fz={16}>Stand out with photos in search results</Text>
                                <Text fz={16}>1 car for Euro 9</Text>
                            </Stack>
                            <Button variant='outline' color='#3CDFCD' size='md' radius='xl' onClick={() => openModel({ price: 9, description: "1 car for Euro 9", type: "Basic", carCount: 1 })}>Buy Now</Button>
                        </Box>
                    </Grid.Col>
                    <Grid.Col span={{ base: 12, sm: 6, lg: 3 }} ta={'center'} style={{ transform: matches ? 'scale(1)' : 'scale(1.08)', zIndex: 10 }}>
                        <Box bg={dark ? '#141414' : '#fff'} bd='1px solid #707070' pb={40} style={{ borderRadius: '30px', overflow: 'hidden' }}>
                            <Box bg={'#3CDFCD'} h={{ base: 140, sm: 175 }} p={{ base: '20 10', sm: '30 20' }} pos={'relative'} style={{ borderRadius: '30px' }}>
                                <Title order={4} fz={30} c={'#06070A'}>Premium</Title>
                                <Box bg={'#FFFFFF'} bd='1px solid #C9C9C9' w={{ base: '100', sm: '135' }} h={{ base: '100', sm: '135' }} left={'50%'} bottom={{ base: '-40%', sm: '-50%' }} pos={'absolute'} style={{ borderRadius: '50%', transform: 'translate( -50%, -20%)' }} p={{ base: '20 10', sm: '30 20' }}>
                                    <Text component='span' c={'#06070A'} fw={700} fz={{ base: 30, sm: 40 }} lh={1}>€ 5</Text>
                                    <Text c={'#06070A'} fz={14} lh={1}>For each car</Text>
                                </Box>
                            </Box>
                            <Stack gap={{ base: 15, sm: 20 }} p={{ base: '60 20 30', sm: '100 30 40' }}>
                                <Text fz={16}>Attract buyers - show off your vehicles' best features with up to 100 photos</Text>
                                <Text fz={16}>Stand out with photos in search results</Text>
                                <Text fz={16}>2 to 5 for each Euro 5 for each</Text>
                            </Stack>
                            <Button variant='filled' color='#3CDFCD' c="#0C0000" size='md' radius='xl' onClick={() => openModel({ price: 25, description: "2 to 5 for each Euro 5 for each", type: "Premium", carCount: 5 })}>Buy Now</Button>
                        </Box>
                    </Grid.Col>
                    <Grid.Col span={{ base: 12, sm: 6, lg: 3 }} ta={'center'}>
                        <Box bg={dark ? '#141414' : '#fff'} bd='1px solid #707070' pb={40} style={{ borderRadius: '30px', overflow: 'hidden' }}>
                            <Box bg={'#C9C9C9'} h={{ base: 140, sm: 175 }} p={{ base: '20 10', sm: '30 20' }} pos={'relative'} style={{ borderRadius: '30px' }}>
                                <Title order={4} fz={30} c={'#06070A'}>Traders</Title>
                                <Box bg={'#FFFFFF'} bd='1px solid #C9C9C9' w={{ base: '100', sm: '135' }} h={{ base: '100', sm: '135' }} left={'50%'} bottom={{ base: '-40%', sm: '-50%' }} pos={'absolute'} style={{ borderRadius: '50%', transform: 'translate( -50%, -20%)' }} p={{ base: '20 10', sm: '30 20' }}>
                                    <Text component='span' c={'#06070A'} fw={700} fz={{ base: 30, sm: 40 }} lh={1}>€ 12</Text>
                                    <Text c={'#06070A'} fz={14} lh={1}>For more than 5 car</Text>
                                </Box>
                            </Box>
                            <Stack gap={{ base: 15, sm: 20 }} p={{ base: '60 20 30', sm: '100 30 40' }}>
                                <Text fz={16}>Attract buyers - show off your vehicles' best features with up to 100 photos</Text>
                                <Text fz={16}>Stand out with photos in search results</Text>
                                <Text fz={16}>More then 5 car</Text>
                            </Stack>
                            {/* {userService?.userValue?.role=="TRADER" && ( */}

                            <Button variant='outline' color='#3CDFCD' size='md' radius='xl' onClick={() => openModel({ price: 12, description: "More then 5 car", type: "Trader", carCount: 10 })} >Buy Now</Button>
                            {/* )} */}
                        </Box>
                    </Grid.Col>
                </Grid>
            </Container>
        </>
    )
}

export default AdvertisingPrices