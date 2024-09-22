'use client'

import { BackgroundImage, Box, Center, Container, Divider, Flex, Grid, Group, Stack, Text, Title } from '@mantine/core'
import { Icon12Hours } from '@tabler/icons-react'
import React from 'react'

const GuidesToSelling = ({ dark }) => {
    return (
        <Container size="lg" c={dark ? '#fff' : '#000'} py={{ base: 60, md: 80 }} style={{ zIndex: 100 }}>
            <Title order={2} ta='center' fz={{ base: 32, sm: 40, lg: 45 }} mb={{ base: 30, sm: 40, md: 60 }}>
                Guides To Selling <Text component="span" fw={700} c='#3CDFCD' fz={'inherit'}>Your Car</Text>
            </Title>
            <Group wrap='wrap'>
                <Group display={{ base: 'none', sm: 'flex' }} gap={{ base: 60, md: 40 }} className='steps-number' justify='space-around' w={{ base: 60, sm: '100%' }} >
                    <Text component='span' ta='center' fz={{ base: 50, sm: 75, md: 90 }} fw={600} lh={1.2} display='inline-block' pos={'relative'}>01
                        <span className='number-icon'></span>
                    </Text>
                    <Text component='span' ta='center' fz={{ base: 50, sm: 75, md: 90 }} fw={600} lh={1.2} display='inline-block' pos={'relative'}>02
                        <span className='number-icon'></span>
                    </Text>
                    <Text component='span' ta='center' fz={{ base: 50, sm: 75, md: 90 }} fw={600} lh={1.2} display='inline-block' pos={'relative'}>03
                        <span className='number-icon'></span>
                    </Text>
                    <Text component='span' ta='center' fz={{ base: 50, sm: 75, md: 90 }} fw={600} lh={1.2} display='inline-block' pos={'relative'}>04
                        <span className='number-icon'></span>
                    </Text>
                </Group>
                <Grid gutter={{ base: 15, md: 50 }} className='steps-number' pos={'relative'}>
                    <Grid.Col span={{ base: 12, sm: 3 }} ta={{ base: 'left', sm: 'center' }}>
                        <Flex gap={15}>
                            <Text component='span' miw={'60'} fz={50} fw={600} lh={1.2} h={'100%'} bg={dark ? '#242424' : '#fff'} display={{ base: 'block', sm: 'none' }} pos={'relative'}>01
                                <span className='number-icon'></span>
                            </Text>
                            <Stack gap={5} w={'calc(100%)'}>
                                <Title order={5} fz={{ base: '20', sm: '22' }}>Preparing Your Car</Title>
                                <Text fz={14}>From keeping it clean to sorting repairs, here's how to get your car ready for sale.</Text>
                            </Stack>
                        </Flex>
                    </Grid.Col>
                    {/* <Divider w={200} h={2} color={'red'} pos={'absolute'} /> */}
                    <Grid.Col span={{ base: 12, sm: 3 }} ta={{ base: 'left', sm: 'center' }}>
                        <Flex gap={15}>
                            <Text component='span' miw={'60'} fz={50} fw={600} lh={1.2} h={'100%'} bg={dark ? '#242424' : '#fff'} display={{ base: 'inline-block', sm: 'none' }} pos={'relative'}>02
                                <span className='number-icon'></span>
                            </Text>
                            <Stack gap={5} w={'100%'}>
                                <Title order={5} fz={{ base: '20', sm: '22' }}>Greating Your Advert</Title>
                                <Text fz={14}>Good-quality adverts lead to a fast sale. Read our tips to create an effective advert.</Text>
                            </Stack>
                        </Flex>
                    </Grid.Col>
                    <Grid.Col span={{ base: 12, sm: 3 }} ta={{ base: 'left', sm: 'center' }}>
                        <Flex gap={15}>
                            <Text component='span' miw={'60'} fz={50} fw={600} lh={1.2} h={'100%'} bg={dark ? '#242424' : '#fff'} display={{ base: 'inline-block', sm: 'none' }} pos={'relative'}>03
                                <span className='number-icon'></span>
                            </Text>
                            <Stack gap={5} w={'100%'}>
                                <Title order={5} fz={{ base: '20', sm: '22' }}>Taking Payment</Title>
                                <Text fz={14}>Cash, bank transfer, cheque? Learn the best way to accept payment and keep yourself secure.</Text>
                            </Stack>
                        </Flex>

                    </Grid.Col>
                    <Grid.Col span={{ base: 12, sm: 3 }} ta={{ base: 'left', sm: 'center' }}>
                        <Flex gap={15}>
                            <Text component='span' miw={'60'} fz={50} fw={600} lh={1.2} h={'100%'} bg={dark ? '#242424' : '#fff'} display={{ base: 'inline-block', sm: 'none' }} pos={'relative'}>04
                                <span className='number-icon'></span>
                            </Text>
                            <Stack gap={5} w={'100%'}>
                                <Title order={5} fz={{ base: '20', sm: '22' }}>Avoiding Scams</Title>
                                <Text fz={14}>Learn how to stay safe online and protect yourself from fraud.</Text>
                            </Stack>
                        </Flex>
                    </Grid.Col>
                </Grid>
            </Group>
        </Container>
    )
}

export default GuidesToSelling