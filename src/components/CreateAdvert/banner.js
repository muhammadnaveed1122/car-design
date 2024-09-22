import Section from '@/layouts/Section'
import { BackgroundImage, Box, Button, Container, Grid, List, rem, Text, ThemeIcon, Title } from '@mantine/core'
import { IconCheck } from '@tabler/icons-react'
import Link from 'next/link'
import React from 'react'

const Banner = () => {
    return (
        <BackgroundImage src='/assets/banners/create-advert.png' c='white'>
            <Container size="xl" py={{ base: 60, md: 80 }}>
                <Grid>
                    <Grid.Col span={{ base: 12, md: 6 }}>
                        <Text component="span" fz={{ base: 22, sm: 25, md: 30 }} lh={1} c='#3CDFCD'>Sell my car</Text>
                        <Text fz={{ base: 26, sm: 30, md: 40 }} lh={1}>Place an advert on</Text>
                        <Box pos='relative' display='inline-block' mb={{ base: 30, md: 40 }}>
                            <Title order={1} fz={{ base: 48, sm: 60, md: 70 }} lh={1}>
                                Trade Dept
                            </Title>
                            <Text component="span" fz={{ base: 22, md: 30 }} c='#3CDFCD' pos='absolute' right={0} bottom={{ base: -28, md: -34 }}>Sales</Text>
                        </Box>
                        <Text fz={{ base: 20, md: 22 }} mb={{ base: 18, md: 24 }}>
                            3 simple steps to get your advert online
                        </Text>
                        <List
                            spacing="xs"
                            size={{ base: 'md', md: 'lg' }}
                            center
                            mb={{ base: 30, md: 50 }}
                            icon={
                                <ThemeIcon color="none" size={24} radius="xl">
                                    <IconCheck color='#3CDFCD' style={{ width: rem(20), height: rem(20) }} />
                                </ThemeIcon>   
                            }
                        >
                            <List.Item>Free, instant online valuation</List.Item>
                            <List.Item>Advertise to millions</List.Item>
                            <List.Item>Dedicated support team</List.Item>
                        </List>
                        <Button component={Link} href='/sell-car' variant='primary' radius='xl' c='#0C0000' size='lg'>
                            Create your advert
                        </Button>
                    </Grid.Col>
                </Grid>
            </Container>
        </BackgroundImage>
    )
}

export default Banner