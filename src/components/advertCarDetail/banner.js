import { BackgroundImage, Button, Container, Group, Modal, Text, Title } from '@mantine/core'
import { useDisclosure } from '@mantine/hooks';
import { IconEdit } from '@tabler/icons-react'
import React from 'react'
import { currencyFormater } from "@/constants/data";
const Banner = ({ dark ,carData}) => {
    console.log("🚀 ~ Banner ~ carData:", carData)
    const [opened, { open, close }] = useDisclosure(false);
    return (
        <>
            <Modal opened={opened} onClose={close} centered>
                {/* Modal content */}
            </Modal>
            <BackgroundImage src='/assets/banners/detail-bg.png' style={{ backgroundColor: '#040509' }} c={dark ? '#fff' : '#fff'} ta={'center'}>
                <Container size='lg' py={100}>
                    <Title order={2} fz={{ base: 32, sm: 40, lg: 45 }}>
                    {carData?.make} <Text component='span' fz={'inherit'} fw={600} c={'#3CDFCD'}> {carData?.model} ({carData?.year})</Text>
                    </Title>
                    <Text mb={30}>3.0 V6 4 Saloon 5dr Petrol PDK 4WD Euro 6 (s/s) (330 ps)</Text>
                    <Group align='center' justify='center'>
                        <Text component='span' fz={{ base: 40, sm: 45, lg: 60 }} fw={600}>£ {currencyFormater(carData?.price)}</Text>
                        {/* <Button variant='outline' color='#3CDFCD' c={dark ? '#fff' : '#fff'} size='md' ml={{ base: '0', md: '20'}} radius='xl'
                            leftSection={
                                <IconEdit width={20} />
                            }
                            onClick={() => open()}
                        >
                            Edit Price
                        </Button> */}
                    </Group>
                </Container>
            </BackgroundImage>
        </>
    )
}

export default Banner