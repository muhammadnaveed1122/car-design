import { Accordion, Container, MantineProvider, Text, Title, useMantineColorScheme } from '@mantine/core';
import React, { useEffect, useState } from 'react'

const FAQs = () => {
    const [dark, setDark] = useState(true);
    const { colorScheme } = useMantineColorScheme();
    useEffect(() => {
        setDark(colorScheme === "dark");
    }, [colorScheme]);
    const faq = [
        {
            value: 'Why sell my car with Trade Dept?',
            description:
                'With Trade Dept, you’re twice as likely to sell your car within a week. We also have more options than anywhere else to sell your car, so you are in control: 1. Part Exchange – The easy way to part exchange your old car for new one. 2. Create an advert – You are in full control with your own sale. You can create and upload your advert in just three steps, and the size of our audience means you’ll get your car in front of more buyers than on any other site.',
        },
        {
            value: 'What paperwork do I need to sell my car?',
            description:
                'With Trade Dept, you’re twice as likely to sell your car within a week. We also have more options than anywhere else to sell your car, so you are in control: 1. Part Exchange – The easy way to part exchange your old car for new one. 2. Create an advert – You are in full control with your own sale. You can create and upload your advert in just three steps, and the size of our audience means you’ll get your car in front of more buyers than on any other site.',
        },
        {
            value: 'Where can I sell my car?',
            description:
                'With Trade Dept, you’re twice as likely to sell your car within a week. We also have more options than anywhere else to sell your car, so you are in control: 1. Part Exchange – The easy way to part exchange your old car for new one. 2. Create an advert – You are in full control with your own sale. You can create and upload your advert in just three steps, and the size of our audience means you’ll get your car in front of more buyers than on any other site.',
        },
        {
            value: 'What is my car worth?',
            description:
                'With Trade Dept, you’re twice as likely to sell your car within a week. We also have more options than anywhere else to sell your car, so you are in control: 1. Part Exchange – The easy way to part exchange your old car for new one. 2. Create an advert – You are in full control with your own sale. You can create and upload your advert in just three steps, and the size of our audience means you’ll get your car in front of more buyers than on any other site.',
        },
        {
            value: 'Can I part-exchange my car online?',
            description:
                'With Trade Dept, you’re twice as likely to sell your car within a week. We also have more options than anywhere else to sell your car, so you are in control: 1. Part Exchange – The easy way to part exchange your old car for new one. 2. Create an advert – You are in full control with your own sale. You can create and upload your advert in just three steps, and the size of our audience means you’ll get your car in front of more buyers than on any other site.',
        },
    ];
    const items = faq.map((item) => (
        <Accordion.Item key={item.value} value={item.value}>
            <Accordion.Control fz={28} fw={700} c={dark ? '#fff' : '#000'}>{item.value}</Accordion.Control>
            <Accordion.Panel fz={14}>{item.description}</Accordion.Panel>
        </Accordion.Item>
    ));

    return (
        <MantineProvider defaultColorScheme="dark">
            <Container size="sm" pb={{ base: 60, md: 80 }} c={dark ? '#fff' : '#000'} py={{ base: '60px', sm: "80px"}}>
                <Title order={2} ta='center' fz={{ base: 32, sm: 40, lg: 45 }} mb={{ base: 30, md: 60 }}>
                    Your Questions <Text component="span" fw={700} c='#3CDFCD' fz={'inherit'}>Answer</Text>
                </Title>
                <Accordion variant="contained" defaultValue="Why sell my car with Trade Dept?">
                    {items}
                </Accordion>
            </Container>
        </MantineProvider>
    )
}

export default FAQs