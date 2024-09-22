import CheckoutPage from "@/components/CheckoutForm/checkoutForm";
import MetaDecorator from "@/components/Meta/metaDecor";
import { Title } from "@mantine/core";
import React from "react";

const mycars = () => {
    return (
        <div style={{ minHeight: 700 }}>
            <MetaDecorator title="Trade Dept | Checkout" />
            <Title align="center">Checkout </Title>
            <CheckoutPage />
        </div>
    );
};

export default mycars;
