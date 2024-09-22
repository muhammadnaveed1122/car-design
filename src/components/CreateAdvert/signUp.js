import { BackgroundImage, Box, Button, Container, Grid, Input, Text, Title } from '@mantine/core'
import Link from 'next/link'
import React from 'react'

const SignUp = ({ dark }) => {
    return (
        <BackgroundImage src={dark ? '/assets/sign-up-sec-bg.png' : '/assets/sign-up-sec-light-bg.png'} c={dark ? '#fff' : '#06070A'}>
            <Container size='lg' py={40}>
                <Grid gutter={{ base: 20, md: 40 }} align="center">
                    <Grid.Col span={{ base: 12, md: 6 }}>
                        <Title order={4} fz={{ base: 22, sm: 24, md: 28 }} mb={{ base: 5, md: 15 }}>
                            Send me great Auto Trader offers and the latest vehicle reviews.
                        </Title>
                        <Text>By signing up, you agree to receive marketing emails in accordance with our <Link href='/terms-and-condition' style={{ color: '#3CDFCD' }}>privacy notice</Link>. You can unsubscribe at any time.</Text>
                    </Grid.Col>
                    <Grid.Col span={{ base: 12, md: 6 }}>
                        <Box pos='relative' className='signup-input'>
                            <Input
                                color={'#000'}
                                variant="unstyled"
                                bg={'#FFFFFF'} bd='1px solid #707070' pl={20} py={6} c={'black'}
                                style={{ borderRadius: '30px' }}
                                styles={(theme) => ({
                                    input: {
                                      borderRadius: '30px',
                                      color: '#000',
                                      fontSize: '25px',
                                      '::placeholder': {
                                        // color: '#000', // Placeholder color
                                      },
                                    },
                                  })}
                                rightSection={
                                    <>
                                        {/* <Button variant="filled" c={''} w={'100%'} radius='xl'>Button</Button> */}
                                    </>
                                } placeholder='Enter Your Email' />
                            <Button c={'#040509'} w={115} pos={'absolute'} top={7} right={6} radius='xl'>Sign up</Button>
                        </Box>
                    </Grid.Col>
                </Grid>
            </Container>
        </BackgroundImage>
    )
}

export default SignUp