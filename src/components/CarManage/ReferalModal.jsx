import { fetchCarsAsync, useCarDispatch } from '@/redux/carsSlice';
import { Button, Flex, Input, Modal, Title } from '@mantine/core';
import { useLoadingContext } from '@/providers/LoadingProvider';
import React, { useEffect, useState } from 'react'
import { useDisclosure } from '@mantine/hooks';
import { carService } from '@/services';
import { toastShow } from '@/helpers';

function ReferalModal({ car, setIsReferal }) {
    const [referal, setReferal] = useState()
    const [opened, { open, close }] = useDisclosure(false);
    const loadingContext = useLoadingContext();
    const dispatch = useCarDispatch();

    const duplicate = async () => {
        if (referal) {
            car.referal = referal
            loadingContext.setIsLoading(true);
            const formData = JSON.stringify(car)
            try {
                const res = await carService.duplicateCar(formData)
                if (res) {
                    toastShow("Car duplicated sucessfully")
                }
                dispatch(fetchCarsAsync({ referal: "ALL" }))
                loadingContext.setIsLoading(false);
                setIsReferal(false)
                close()
            } catch (error) {
                toastShow("Something went Wrong", "error")
                loadingContext.setIsLoading(false);
                setIsReferal(false)
                close()

            }
        } else {
            toastShow("Referral code required", "error")
        }
    }
    useEffect(() => {
        open()
    }, [])
    return (
        <Modal opened={opened} onClose={() => {
            setIsReferal(false)
            close()
        }} centered>
            <Title mb={20}>Referral</Title>
            <Flex gap={20} wrap="">
                <Input
                    rightSectionPointerEvents="all"
                    w="100%"
                    placeholder="Enter the Referral"
                    radius="md"
                    value={referal}
                    onChange={(e) => setReferal(e.target.value)}
                />
                <Button onClick={duplicate} w="120px">Submit</Button>
            </Flex>
        </Modal>
    )
}

export default ReferalModal