import { Box, Flex, Image, Modal, Text, Title } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { carService } from '@/services';
import { useEffect } from 'react';

const Congratulations = ({ carName, id, carImage }) => {
    const [opened, { open, close }] = useDisclosure(true);
    const updateCongBox = async () => {
        await carService.updateWinBox(id);
    }
    useEffect(() => {
        if (id)
            updateCongBox()
    }, [id])
    return (
        <>
            <Modal size="md" opened={opened} onClose={close} withCloseButton={false} centered className='congratulations-model' pos='relative'>
                <Box pos='absolute' top={{base: '-60px', sm: '-70px'}} left='50%' w={{base: '120', sm: '140'}} h={{base: '120', sm:'140'}} bg='#50D7C8' style={{ borderRadius: '50%',overflow: 'hidden', transform: 'translateX(-50%)' }}>
                    <Image src='/assets/car-animation.gif' alt='car animation' />
                </Box>
                <Box className='modal-content' py={{ base: '100 30', sm: '120 60' }}>
                    <Flex className='car-img' align="center" justify="center" mb="md">
                        {
                            carImage &&
                            <img src={carImage} alt="car img" width="150" height="150" style={{ borderRadius: "20px", overflow: "hidden" }} />
                        }
                    </Flex>
                    <Flex className='congratulations-img' align="center" justify="center" mb="md">
                        {/* <img src="./assets/congratulation.png" alt="congrats img" /> */}
                        <Title c='#fff' fw='500' fz={{base: '40', sm: '55'}} mb='0' style={{ textShadow: '2px 2px 4px #000000', }}>Winner</Title>
                    </Flex>
                    <Text c='white' align="center" fz='20'>
                        Car {carName}
                    </Text>
                </Box>
            </Modal>
        </>
    )
}

export default Congratulations