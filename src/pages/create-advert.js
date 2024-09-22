import AdvertisingPrices from '@/components/CreateAdvert/advertisingPrices'
import Banner from '@/components/CreateAdvert/banner'
import FAQ from '@/components/CreateAdvert/FAQ'
import GuidesToSelling from '@/components/CreateAdvert/guidesToSelling'
import HowToSell from '@/components/CreateAdvert/howToSell'
import SignUp from '@/components/CreateAdvert/signUp'
import WithHightway18 from '@/components/CreateAdvert/withHightway18'
import MetaDecorator from '@/components/Meta/metaDecor'
import { Box, createTheme, MantineProvider, useMantineColorScheme } from '@mantine/core'
// import { useMediaQuery } from '@mantine/hooks'
import { useEffect, useState } from 'react'

const theme = createTheme({
    fontFamily: '"Outfit", sans-serif',
    headings: {
        fontWeight: '600',
        lineHeight: '1.2',
        sizes: {
            // h2: { fontSize: '45px' },
            h4: { fontSize: '28px' },
            h5: { fontSize: '22px' },
        },
    },
});

const createAdvert = () => {
    // const matches = useMediaQuery('(max-width : 575px)')
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
            <div className='create-advert'>
                <section>
                    <Banner dark={dark} />
                </section>
                <section id='advertising_Price'>
                    <AdvertisingPrices dark={dark} />
                </section>
                <section>
                    <HowToSell dark={dark} />
                </section>
                <section>
                    <WithHightway18 dark={dark} />
                </section>
                <section>
                    <GuidesToSelling dark={dark} />
                </section>
                <section>
                    <FAQ dark={dark} />
                </section>
                <section>
                    <SignUp dark={dark} />
                </section>
            </div>
        </MantineProvider>
    )
}

export default createAdvert