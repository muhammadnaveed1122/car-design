import { BackgroundImage, Box, Card, Container, Grid, Image, Text, Title } from '@mantine/core'
import React from 'react'

const HowToSell = ({dark}) => {
    return (
        <>
            <BackgroundImage src='/assets/how-to-sell-bg.png'>
                <Container size="lg" py={{ base: '30 60', sm: '40 60', md: 80}} style={{ zIndex: 100 }}>
                    <Title order={2} ta='center' fz={{base: 32, sm: 40, lg: 45}} mb={{base: 25, sm: 40, lg: 60}} c={dark ? '#fff' : '#000'}>
                        How To Sell <Text component="span" fw={700} c='#3CDFCD' fz={'inherit'}>Your Car,Fast</Text>
                    </Title>
                    <Grid gutter={{base: 20, lg: 50}} c={ dark ? '#fff' : '#06070A'} justify='center'>
                        <Grid.Col span={{ xs: 6, md: 4}} mt={{md: 50}}>
                            <Card c={ dark ? '#fff' : '#06070A'} bg={ dark ? '#141414' : '#FFFFFF'} p={{ base: '20 15 25', md: '25 25 40'}} ta='center' bd={ dark ? '1px solid #575757' : '0'} style={{ borderRadius: '4px', boxShadow: '0px 3px 6px #00000029', borderBottom: '4px solid #3CDFCD !important' }}>
                                <Image src='/assets/ic_photo.png' w={{base: 60, md: 100}} h={{base: 60, md: 100}} mx={'auto'} mb={20} />
                                <Title order={4} fz={{base: 20, md: 24}} lh={1.3} mb={'xs'}>
                                    Take Great Photos
                                </Title>
                                <Text>
                                    It may sound obvious - but taking good-quality photos can have a huge impact on the time it takes to sell your car. Buyers expect to see 20 images on an advert
                                </Text>
                            </Card>
                        </Grid.Col>
                        <Grid.Col span={{ xs: 6, md: 4}}>
                            <Card c={ dark ? '#fff' : '#06070A'} bg={ dark ? '#141414' : '#FFFFFF'} p={{ base: '20 15 25', md: '25 25 40'}} ta='center' bd={ dark ? '1px solid #575757' : '0'} style={{ borderRadius: '4px', boxShadow: '0px 3px 6px #00000029', borderBottom: '4px solid #3CDFCD !important' }}>
                                <Image src='/assets/ic_snappy.png' w={{base: 60, md: 100}} h={{base: 60, md: 100}} mx={'auto'} mb={20} />
                                <Title order={4} fz={{base: 20, md: 24}} lh={1.3} mb={'xs'}>
                                    Keep It Snappy
                                </Title>
                                <Text>
                                    Keep your vehicle description short and simple. Call out optional extras that other similar cars may not have. And don't forget to mention full-service history if you have it.
                                </Text>
                            </Card>
                        </Grid.Col>
                        <Grid.Col span={{ xs: 6, md: 4}} mt={{md: 50}}>
                            <Card c={ dark ? '#fff' : '#06070A'} radius={20} bg={ dark ? '#141414' : '#FFFFFF'} p={{ base: '20 15 25', md: '25 25 40'}} ta='center' bd={ dark ? '1px solid #575757' : '0'} style={{ borderRadius: '4px', boxShadow: '0px 3px 6px #00000029', borderBottom: '4px solid #3CDFCD !important' }}>
                                <Image src='/assets/ic_honest.png' w={{base: 60, md: 100}} h={{base: 60, md: 100}} mx={'auto'} mb={20} />
                                <Title order={4} fz={{base: 20, md: 24}} lh={1.3} mb={'xs'}>
                                    Be Honest
                                </Title>
                                <Text>
                                    It's important that your vehicle description is accurate. If your car has a small scratch on it - be honest about it. It'll save time with needless viewings if buyers are aware of any faults from the get-go.
                                </Text>
                            </Card>
                        </Grid.Col>
                    </Grid>
                </Container>
            </BackgroundImage>
        </>
    )
}

export default HowToSell