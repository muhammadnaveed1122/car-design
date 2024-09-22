import style from "../styles/payments.module.css"
import { Button, Image } from '@mantine/core';
import React from 'react';

function Payments() {
    return (
        <div className={style.paymentsContainer}>
            <div className={style.imageWrapper}>
                <Image src="/americanexpresslogo.png" alt="American Express" />
            </div>
            <div className={style.imageWrapper}>
                <Image src="/maestrologo.png" alt="Maestro" />
            </div>
            <div className={style.imageWrapper}>
                <Image src="/mastercardlogo.png" alt="Mastercard" />
            </div>
            <div className={style.imageWrapper}>
                <Image src="/visalogo.png" alt="Visa" />
            </div>
        </div>
    );
}

export default Payments;
