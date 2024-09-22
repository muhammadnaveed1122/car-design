import { Box, Flex, RingProgress, Text } from '@mantine/core'

const ProgressRing = (
    { bidPrice, name, percent }
) => {
    return (
        <Box className='progress-ring' align="center">
            <RingProgress
                size={200}
                sections={[{ value: percent, color: '#3CDFCD' }]}
                label={
                    <>
                        <Flex align="center" justify="center" direction="column" px="xs" className='progress-inside'>
                            <Box className='profile-img' align="center" mb="5">
                            </Box>
                            <Text c="#757575" fz="sm">
                                {name}
                            </Text>
                            <Text color="var(--mantine-color-ocean-blue-filled)" fw={700} ta="center" fz="xl">
                                ${bidPrice}
                            </Text>
                            <Flex className={`bid-done ${percent == 100 ? 'show' : ""}`} align="center" justify="center">
                                <Text fz="xl" fw="700" c="white">Done</Text>
                            </Flex>
                        </Flex>
                    </>
                }
            />
        </Box>
    )
}

export default ProgressRing