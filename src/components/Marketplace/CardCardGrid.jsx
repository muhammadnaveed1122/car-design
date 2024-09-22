
import { Flex, Grid, Text } from '@mantine/core';
import { useWindowSize } from '@/hooks/useWindowSize';
import { useState, useEffect } from 'react';
import { userService } from '@/services';
import Link from 'next/link';
import { CarInfoCard } from './CarInfoCard';
import MyPagination from '../CarManage/MyPagination';

export default function CarCardGridDesktop({ cList }) {
    const [carList, setCarList] = useState([]);
    const [myId, setMyId] = useState(null);
    const windowWidth = useWindowSize();
    const [offset, setOffset] = useState(0);

    useEffect(() => {
        setMyId(userService?.userValue?.id);
    }, [userService?.userValue]);

    const setCarsFilter = () => {
        const filteredList = cList.filter(item => !item.referal);
        let targetCar = [];
        if (userService?.userValue && userService?.userValue.referal && cList) {
            const ind = cList.findIndex(item => item.referal === userService?.userValue.referal);

            if (ind >= 0) {
                targetCar = [cList[ind]];
            }

            const filteredLists = [...targetCar, ...filteredList];
            setCarList(filteredLists);
        } else if (cList && cList.length >= 1) {
            setCarList(filteredList);
        } else {
            setCarList(cList);
        }
    };

    useEffect(() => {
        if (cList) {
            setCarsFilter()
        }
        else {
            setCarList(cList);
        }
    }, [userService?.userValue, cList]);

    return (
        <>
            <Flex px={12} mb={15} justify={{ base: 'center', sm: 'start' }} wrap="wrap">
                <Text fw={700} pr={20} mt={3}>
                    {carList?.length} Result{carList?.length > 1 ? "s" : ""}
                </Text>
                <MyPagination
                    totalPages={Math.ceil(carList?.length / 6)}
                    onChange={(val) => setOffset((val - 1) * 6)}
                />
            </Flex>
            <Grid> {
                carList && carList.slice(offset, offset + 6).map((car, i) => (
                    <Grid.Col p="md" span={{ base: 12, sm: 6, lg: 4 }} key={`demo${i}`}>
                        <Link href={`market/${car.slug}`}>
                            <CarInfoCard
                                {...car}
                                isListStyle={windowWidth > 650 && windowWidth < 768}
                                myId={myId}
                            />
                        </Link>
                    </Grid.Col>
                ))
            }
            </Grid>
        </>
    )
}