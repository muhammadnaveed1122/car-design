import "@mantine/core/styles.css";
import "@mantine/dates/styles.css";
import "@mantine/carousel/styles.css";
import "@mantine/tiptap/styles.css";
import "@mantine/notifications/styles.css";
import "@/styles/globals.css";
import { SessionProvider } from "next-auth/react";
import { LoadingProvider } from "@/providers/LoadingProvider";
import { MantineProvider, createTheme } from "@mantine/core";
import { Notifications } from "@mantine/notifications";
import { Provider } from "react-redux";
import Layout from "@/layouts/Layout";
import store from "@/redux/store";
import GTag from "./gtag";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import React, { Suspense } from 'react';

const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
);

const theme = createTheme({
  primaryColor: "ocean-blue",
  colors: {
    "ocean-blue": [
      "#e5f8ff",
      "#d2ebfc",
      "#a8d3f2",
      "#7bbbe8",
      "#56a6e1",
      "#23A0C4",
      "#1A809C",
      "#23A0C4",
      "#146075",
      "#1A809C",
    ],
  },
});

export default function App({ Component, pageProps }) {
  return (
    // <Suspense fallback={<div>Loading...</div>}>
      <MantineProvider defaultColorScheme="dark" theme={theme}>
        <Provider store={store}>
          <Elements stripe={stripePromise} >
            <Notifications position="top-right" zIndex={2000} autoClose={3000} />
            <LoadingProvider>
              <Layout>
                <SessionProvider session={pageProps.session}>
                  <Component {...pageProps} />
                </SessionProvider>
              </Layout>
            </LoadingProvider>
          </Elements>
        </Provider>
        <GTag />
      </MantineProvider>
    // </Suspense>
  );
}
