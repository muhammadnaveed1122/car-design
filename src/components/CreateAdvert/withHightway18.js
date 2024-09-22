import { BackgroundImage, Box, Container, Grid, Image, Stack, Text, Title } from '@mantine/core'
import React from 'react'

const WithHightway18 = () => {
    return (
        <BackgroundImage src='/assets/highway-18-sec-bg.png' c='white' pos={'relative'}>
            <Container size="lg" py={{ base: 60, md: 80 }} style={{ zIndex: 100 }}>
                <Title order={2} ta='center' fz={{ base: 32, sm: 40, lg: 45 }} mb={{ base: 10, md: 15 }}>
                    With Trade Dept, <Text component="span" fw={700} c='#3CDFCD' fz={'inherit'}>It's Simple</Text>
                </Title>
                <Text ta='center' fz={18}>The number of cross-platform visits to our website each month*</Text>
                <Grid mt={{ base: 30, sm: 40, lg: 60 }}>
                    <Grid.Col span={{ span: 12, sm: 6 }}>
                        <Stack gap={20}>
                            <Box p={{ base: '15 12', md: '20 15' }} bd='1px solid #707070' style={{ borderRadius: '4px' }}>
                                <Title order={4} fz={{ base: 22, sm: 25, lg: 28 }} fw={600} mb={10}>Advertise To Millions</Title>
                                <Text fz={14}>
                                    With the UK's largest audience of car buyers, it's highly likely someone is currently searching our website for the car that's sat on your driveway. If you have a popular model, it can sell within 24 hours!
                                </Text>
                            </Box>
                            <Box p={{ base: '15 12', md: '20 15' }} bd='1px solid #707070' style={{ borderRadius: '4px' }}>
                                <Title order={4} fz={{ base: 22, sm: 25, lg: 28 }} fw={600} mb={10}>Free Online Valuation</Title>
                                <Text fz={14}>
                                    Our powerful valuation tool helps you to price your car competitively so you can make sure you're getting a fair price. We'll guide you through creating your advert and give helpful tips to make it stand out.
                                </Text>
                            </Box>
                        </Stack>
                    </Grid.Col>
                </Grid>
            </Container>
            <Box w={'calc( 50% - 15px)'} pos={'absolute'} display={{ base: 'none', sm: 'block' }} bottom={40} right={0}>
                <Image src='/assets/highway-sec-car.png' />
            </Box>
        </BackgroundImage>
    )
}

export default WithHightway18