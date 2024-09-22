import AddImages from '@/components/advertCarDetail/addImages';
import Banner from '@/components/advertCarDetail/banner'
import Description from '@/components/advertCarDetail/description';
import Overview from '@/components/advertCarDetail/overview';
import SignUp from '@/components/CreateAdvert/signUp';
import isAuth from '@/components/Auth/auth';
import { carService, userService, userCarService } from '@/services'
import { Loader, createTheme, MantineProvider, useMantineColorScheme, Group } from '@mantine/core';
import { useRouter } from 'next/router';

import React, { useEffect, useState } from 'react'

const theme = createTheme({
    fontFamily: '"Outfit", sans-serif',
    headings: {
        fontWeight: '600',
        sizes: {
            h2: { fontSize: '45px' },
            h4: { fontSize: '28px' },
            h5: { fontSize: '22px' },
        },
    },
});
const AdvertCarDetail = ({ carId }) => {
    const router = useRouter();
    const [loader, setLoader] = useState(true);
    const [dark, setDark] = useState(true);
    const { colorScheme } = useMantineColorScheme();
    const [carData, setCarData] = useState()
    useEffect(() => {
        setDark(colorScheme === "dark");
    }, [colorScheme]);
    const getCarById = async (carId) => {
        const carResponse = await userCarService.getById(userService?.userValue?.id, carId)
        if (!carResponse?.status) {
            router.push('/mycars')
        }
        setCarData(carResponse?.car)
        setLoader(false);
    }
    useEffect(() => {
        getCarById(carId)
    }, [carId])
    return (
        loader ? <Group align="center" justify='center' mih={'400px'} w={'100%'}>
            <Loader />
        </Group>
            :
            <MantineProvider defaultColorScheme="dark" theme={theme}>
                <section>
                    <Banner dark={dark} carData={carData} />
                </section>
                <section style={{ position: 'relative' }}>
                    <Overview dark={dark} carData={carData} />
                </section>
                <section>
                    <AddImages dark={dark} carData={carData} />
                </section>
                <section>
                    <Description dark={dark} carData={carData} />
                </section>
                <section>
                    <SignUp dark={dark} />
                </section>
            </MantineProvider>
    )
}
export async function getServerSideProps({ query, res }) {
    const { carId } = query;

    console.log(carId, "carId")
    return {
        props: {
            carId,
        },
    };
}

export default isAuth(AdvertCarDetail)