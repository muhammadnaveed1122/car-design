import { BackgroundImage, Box, Button, Container, NumberInput, TextInput, Title ,Group,Modal,Text,Loader, Flex} from '@mantine/core'
import React, { useState } from 'react'
import Stripe from "stripe";
import { userCarService, userService, packageService, paymentService } from '@/services'
import { useRouter } from 'next/router'
import { useForm } from '@mantine/form';
import { toastShow } from "@/helpers";
import { useDisclosure } from '@mantine/hooks';
import {
    useStripe,
    useElements,
    CardNumberElement,
    CardExpiryElement,
    CardCvcElement,
} from "@stripe/react-stripe-js";
import getConfig from "next/config";
const Banner = ({ dark }) => {
    const router = useRouter()
    const [opened, { open, close }] = useDisclosure(false);
    const { publicRuntimeConfig } = getConfig();
    const [loading, setLoading] = useState(false);
    const [modelData, setModelData] = useState({})
    // stripe configuration
    const stripeSecret = new Stripe(publicRuntimeConfig.StripeSecretKey);
    const stripe = useStripe();
    const elements = useElements();
    const [error, setError] = useState(null);
    const form1 = useForm({
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
    const form = useForm({
        initialValues: {
            vin: '',
            mileage: '',
        },

        validate: {
            vin: (value) => (value.trim() === '' ? 'VIN is required' : null),
            mileage: (value) => (value === '' ? 'Mileage is required' : null),
        },
    });
    function getValueByLabel(data, labelName) {
        if (labelName != "Price") {
            const item = data.find(obj => obj.label === labelName);
            return item ? item.value : null;  // Return null if the label is not found
        } else {
            const item = data.find(obj => obj.label === labelName);
            return item ? item.value[0]?.price : null;
        }
    }
    const handleSubmitPayment = async (values) => {
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
                    localStorage.removeItem("packageData")
                }

                setLoading(false);
            } else {
                setError("Payment failed for an unknown reason.");
                setLoading(false);
            }
        } catch (err) {
            setError("An unexpected error occurred. Please try again.");
            setLoading(false);
        }
    }
    const handleSubmit = async (values) => {
        if(userService?.userValue?.id){
            const packageResponse = await packageService.getPackageByUserId(userService?.userValue?.id)
            if (packageResponse.status) {
    
                setLoading(true)
                const response = await userCarService.getCarDetailByVin(values.vin)
                if (response.ok) {
                    const data = await response.json(); // parse the JSON response
                    if (!data.error) {
                        const carData = {
                            make: getValueByLabel(data?.decode, 'Make'),
                            year: getValueByLabel(data?.decode, 'Model Year'),
                            model: getValueByLabel(data?.decode, 'Model'),
                            // color:getValueByLabel('Make'),
                            price: getValueByLabel(data?.decode, 'Price'),
                            // engine:getValueByLabel('Make'),
                            doors: getValueByLabel(data?.decode, 'Number of Doors'),
                            seats: getValueByLabel(data?.decode, 'Number of Seats'),
                            fuelType: getValueByLabel(data?.decode, 'Fuel Type - Primary'),
                            location: getValueByLabel(data?.decode, 'Plant City'),
                            mileage: values?.mileage,
                            bodyStyle: getValueByLabel(data?.decode, 'Body'),
                            driveType: getValueByLabel(data?.decode, 'Drive'),
                            cylinders: getValueByLabel(data?.decode, 'Engine Cylinders'),
                            carDataJson: JSON.stringify(data),
                            transmission: getValueByLabel(data?.decode, 'Transmission'),
                            vehicleType: getValueByLabel(data?.decode, 'Product Type'),
                            // driveSide:getValueByLabel(data?.decode,'Make'),
                            vin: values?.vin,
                            creator: userService?.userValue.id,
                            phoneNumber: userService?.userValue?.phone
    
    
                        }
                        console.log(carData, 'carData')
                        const formData = new FormData();
                        for (const key in carData) {
                            formData.append(key, carData[key]);
                        }
                        const createCar = await userCarService.create(formData)
                        if (createCar) {
                            toastShow("Car created successfully!");
                            router.push(`/edit-car/${createCar.id}`)
                        }
                    } else {
                        toastShow("VIN Number is invalid", "error");
                        setLoading(false)
                    }
                } else {
                    toastShow("VIN Number is invalid", "error");
                    setLoading(false)
    
                }
            } else {
                const packageData = JSON.parse(localStorage.getItem("packageData"));
                if(packageData){
                    setModelData(packageData)
                    open();
                }else{
                    toastShow("Your package has expired. Please contact the admin for further information.", "error");
                    setLoading(false)
                    // router.push('/create-advert')
                }
              
              
            }
        }else{
            router.push('/create-advert#advertising_Price')
        }
        



    }
    return (

        <><Modal opened={opened} onClose={close} centered radius={25}>
            <form onSubmit={form.onSubmit(handleSubmitPayment)}>

                <Group justify='space-between' c={'#fff'} mb={'md'}>
                    <Text fw={700}>Price</Text>
                    <Text fw={700} component='span'>£ {modelData?.price}</Text>
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
                            onBlur={() => form1.validateField('cardNumber')}
                            {...form1.getInputProps('cardNumber')}

                        />
                    </Box>
                    {form1.errors.cardNumber && (
                        <Text c="red" size="sm" mt="xs">
                            {form1.errors.cardNumber}
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
                                {...form1.getInputProps('expiryDate')}
                                onBlur={() => form1.validateField('expiryDate')}

                            />

                        </Box>
                        {form1.errors.expiryDate && (
                            <Text c="red" size="sm" mt="xs">
                                {form1.errors.expiryDate}
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
                                onBlur={() => form1.validateField('cvc')}
                                {...form1.getInputProps('cvc')}

                            />
                        </Box>
                        {form1.errors.cvc && (
                            <Text c="red" size="sm" mt="xs">
                                {form1.errors.cvc}
                            </Text>
                        )}
                    </Box>
                </Group>
                {/* {loading ? (
                    <Group align="center">
                        <Loader />
                    </Group>
                ) : ( */}
                    {/* <> */}
                    <Button
                        type="submit"
                        fullWidth
                        color='#3CDFCD'
                        c='#000'
                        radius="xl"
                        size="md"
                        loading={loading}
                        style={{ marginTop: "10px" }}
                        disabled={!stripe || loading}
                    >
                        Pay
                    </Button>
                    {/* </> */}
                {/* // )} */}

                {error && <Text c="red" align="center" mt="md">{error}</Text>}
            </form>
        </Modal>
            <BackgroundImage src='/assets/banners/car-detail-bg.png'>
                <Container size='md' py={{ base: '80', md: '100' }} c={dark ? '#fff' : '#000'}>
                    <form onSubmit={form.onSubmit(handleSubmit)}>
                        <Box bg={dark ? 'rgb(0 0 0 / 60%)' : 'rgb(255 255 255 / 60%)'} p={{ base: '40 20', sm: '60 80' }} style={{ borderRadius: '25px', backdropFilter: 'blur(6px)', WebkitBackdropFilter: 'blur(6px)' }}>
                            <Title order={3} fz={{ base: '22', sm: '28', md: '32' }} mb={20}>
                                Enter the basic details about the car you want to sell
                            </Title>
                            <TextInput
                                label="VIN Number"
                                name='vin'
                                radius="md"
                                mb={10}
                                {...form.getInputProps('vin')} onBlur={() => form.validateField('vin')}
                            />
                            <NumberInput
                                label="Current Mileage"
                                name='mileage'
                                radius="md"
                                {...form.getInputProps('mileage')} onBlur={() => form.validateField('mileage')}
                                hideControls
                            />
                            <Box ta={'center'} mt={{ base: '20', md: '40' }}>
                                <Button c={'#070000'} radius={'xl'} size='md' loading={loading} type='submit'>Find Details</Button>
                            </Box>
                        </Box>
                    </form>
                </Container>
            </BackgroundImage>
        </>
    )
}

export default Banner