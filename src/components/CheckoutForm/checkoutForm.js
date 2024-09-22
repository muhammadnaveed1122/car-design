import { useState } from "react";
import getConfig from "next/config";
import { fetchWrapper } from "@/helpers";
import {
  useStripe,
  useElements,
  CardNumberElement,
  CardExpiryElement,
  CardCvcElement,
} from "@stripe/react-stripe-js";
import { Loader, Button, Group, Text, Paper, Title, Box } from "@mantine/core";

const { publicRuntimeConfig } = getConfig();
const baseUrl = `${publicRuntimeConfig.apiUrl}/stripe/checkout`;

const PaymentForm = () => {
  const stripe = useStripe();
  const elements = useElements();

  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
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
    console.log(cardElement, "cardElement")
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
      const response = await fetchWrapper.post(baseUrl);

      const { clientSecret, error: serverError } = response;
      if (serverError) {
        setError(serverError);
        setLoading(false);
        return;
      }

      const { error: stripeError, paymentIntent } =
        await stripe.confirmCardPayment(clientSecret, {
          payment_method: {
            card: cardElement,
          },
        });

      if (stripeError) {
        setError(stripeError.message);
        setLoading(false);
      } else if (paymentIntent.status === "succeeded") {
        alert("Payment successful!");
        setLoading(false);
      }
    } catch (err) {
      setError("An unexpected error occurred. Please try again.");
      setLoading(false);
    }
  };

  return (
    <Paper
      withBorder
      shadow="md"
      radius="md"
      p="lg"
      style={{
        width: "100%",
        maxWidth: "500px",
        margin: "0 auto",
        backgroundColor: "#333",
      }}
    >
      <form onSubmit={handleSubmit}>
        <Box mb="lg" style={{ textAlign: "center" }}>
          <Title order={3} style={{ color: "#fff", fontSize: "23px" }}>
            Pay to display Car on Marketplace
          </Title>
        </Box>

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
            />
          </Box>
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
              />
            </Box>
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
              />
            </Box>
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
            color="green"
            radius="md"
            size="md"
            style={{ marginTop: "10px" }}
            disabled={!stripe || loading}
          >
            Pay
          </Button>
        )}

        {error && <Text color="red" align="center" mt="md">{error}</Text>}
      </form>
    </Paper>
  );
};

export default PaymentForm;
