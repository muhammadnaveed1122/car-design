import AddImages from '@/components/advertCarDetail/addImages';
import Banner from '@/components/advertCarDetail/banner'
import Description from '@/components/advertCarDetail/description';
import Overview from '@/components/advertCarDetail/overview';
import SignUp from '@/components/CreateAdvert/signUp';
import { carService, userService,userCarService } from '@/services'
import { createTheme, MantineProvider, useMantineColorScheme } from '@mantine/core';
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
const AdvertCarDetail = () => {
    
    const [dark, setDark] = useState(true);
    const { colorScheme } = useMantineColorScheme();
    useEffect(() => {
        setDark(colorScheme === "dark");
    }, [colorScheme]);
    const  getCarById=async(id)=>{
     const carResponse= await userCarService.getById(29)
     console.log("🚀 ~ getCarById ~ carResponse:", carResponse)

    }
    useEffect(()=>{
        getCarById()
    },[])
    return (
    <MantineProvider defaultColorScheme="dark" theme={theme}>
        <section>
            <Banner dark={dark} />
        </section>
        <section style={{ position: 'relative'}}>
            <Overview dark={dark} />
        </section>
        <section>
            <AddImages dark={dark} />
        </section>
        <section>
            <Description dark={dark} />
        </section>
        <section>
            <SignUp dark={dark} />
        </section>
    </MantineProvider>
  )
}

export default AdvertCarDetail