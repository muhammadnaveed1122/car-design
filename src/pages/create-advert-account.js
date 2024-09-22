import PrivateAccount from '@/components/CreateAdvertAccount/privateAccount';
import TradeAccount from '@/components/CreateAdvertAccount/tradeAccount';
import { Button, Container, createTheme, Group, MantineProvider, Tabs, Text, Title, useMantineColorScheme } from '@mantine/core';
import Link from 'next/link';
import React, { useEffect, useState } from 'react'

const theme = createTheme({
    fontFamily: '"Outfit", sans-serif',
    cursorType: 'pointer',
    headings: {
        fontWeight: '600',
        sizes: {
            h2: { fontSize: '45px' },
            h4: { fontSize: '28px' },
            h5: { fontSize: '22px' },
        },
    },
});

const CreateAdvertAccount = () => {
    const [activeTab, setActiveTab] = useState('second');
    const [dark, setDark] = useState(true);
    const { colorScheme } = useMantineColorScheme();
    useEffect(() => {
        setDark(colorScheme === "dark");
    }, [colorScheme]);
    return (
        <MantineProvider defaultColorScheme="dark" theme={theme}>
            <Container size='md' p={{ base: '60 0 0', sm: '100 0 0' }} c={dark ? '#fff' : '#000'} ta={'center'}>
                <Title order={2} fz={{ base: 32, sm: 40, lg: 45 }} mb={{ base: '5', sm: '20' }}>
                    Create <Text component='span' fz={'inherit'} fw={600} c={'#3CDFCD'}>Account</Text>
                </Title>
                <Text mb={{ base: '20', sm: '30' }}>Already have an account? <Link href='#' style={{ color: '#3CDFCD' }}>Sign in</Link></Text>
            </Container>
            <Tabs className='account-tabs' value={activeTab} variant="pills" radius="xl" onChange={setActiveTab}>
                <Tabs.List justify='center' mb={{ base: '40', sm: '50' }}>
                    {/* <Tabs.Tab value="first">
                        Private Account
                    </Tabs.Tab> */}
                    <Tabs.Tab value="second"
                    // ml={{ base: '0', sm: 'sm'}}
                    >Trade Account</Tabs.Tab>
                </Tabs.List>

                <Tabs.Panel value="first">
                    <PrivateAccount dark={dark} />
                </Tabs.Panel>
                <Tabs.Panel value="second">
                    <TradeAccount dark={dark} />
                </Tabs.Panel>
            </Tabs>
        </MantineProvider>
    )
}

export default CreateAdvertAccount