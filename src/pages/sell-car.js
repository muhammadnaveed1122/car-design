import Banner from '@/components/AdvertDetail/banner';
import SignUp from '@/components/CreateAdvert/signUp';
import MetaDecorator from '@/components/Meta/metaDecor';
import { createTheme, MantineProvider, useMantineColorScheme } from '@mantine/core';
import React, { useEffect, useState } from 'react'
import { Helmet } from 'react-helmet';

const theme = createTheme({
    fontFamily: '"Outfit", sans-serif',
    headings: {
        fontWeight: '600',
        sizes: {
            h4: { fontSize: '28px' },
            h5: { fontSize: '22px' },
        },
    },
});

const advertDetail = () => {
    const [dark, setDark] = useState(true);
    const { colorScheme } = useMantineColorScheme();
    useEffect(() => {
        setDark(colorScheme === "dark");
    }, [colorScheme]);
    return (
        <MantineProvider defaultColorScheme="dark" theme={theme}>
            <MetaDecorator
                title="Sell your car with Trade Dept | Trade Dept"
            />
            <section>
                <Banner dark={dark} />
            </section>
            <section>
                <SignUp dark={dark} />
            </section>
        </MantineProvider>
    )
}

export default advertDetail;