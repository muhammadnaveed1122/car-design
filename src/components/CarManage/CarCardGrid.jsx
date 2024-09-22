
import { Grid, Modal, ScrollArea } from '@mantine/core';
import { useWindowSize } from '@/hooks/useWindowSize';
import { useDisclosure } from '@mantine/hooks';
import { CarInfoCard } from './CarInfoCard';
import { useState, useEffect } from 'react';
import { userService } from '@/services';
import CarCardBid from './CarCardBid';
import Link from 'next/link';

export default function CarCardGrid({ cList }) {

  const [opened, { open, close }] = useDisclosure(false);
  const [carList, setCarList] = useState([]);
  const [bidCarId, setBidCarId] = useState(0);
  const [bidCarInfo, setBidCarInfo] = useState({});
  const [myId, setMyId] = useState(null);
  const windowWidth = useWindowSize();
  const [targetedCar, setTargetedCar] = useState(null);

  useEffect(() => {
console.log("cList====", cList)
    if (cList && cList.length >= 1) {
      const filteredList = cList.filter(item => !item.referal);
      const shuffledList = filteredList.sort(() => Math.random() - 0.5).slice(0, 3);
      setCarList(shuffledList);
    } else {
      setCarList(cList);
    }
  }, [cList]);

  useEffect(() => {
    setMyId(userService?.userValue?.id);
  }, [userService?.userValue]);

  useEffect(() => {
    if (userService?.userValue && userService?.userValue.referal && cList) {
      const ind = cList.findIndex(item => item.referal === userService?.userValue.referal)
      if (ind >= 0) {
        setTargetedCar(cList[ind])
      }
    }
  }, [userService?.userValue, cList]);

  return (
    <>
      <Modal
        size="xxl"
        opened={opened}
        onClose={close}
        overlayProps={{
          backgroundOpacity: 0.55,
          blur: 3,
        }}
        fullScreen
        zIndex={500}
      >
        <ScrollArea h="calc(100vh - 80px)">
          <CarCardBid carId={bidCarId} carInfo={bidCarInfo} />
        </ScrollArea>
      </Modal>
      <Grid>
        <>
          {
            targetedCar ?
              <Grid.Col p="md" span={{ base: 12, sm: 6, lg: 4 }} key={`targetedCar${targetedCar.id}`}>
                <Link href={`car-details/${targetedCar.slug}`}>
                  <CarInfoCard
                    {...targetedCar}
                    isListStyle={windowWidth > 650 && windowWidth < 768}
                    myId={myId}
                  />
                </Link>
              </Grid.Col>
              :
              ''
          }
          {
            carList && carList.map((car, i) => (
              <Grid.Col p="md" span={{ base: 12, sm: 6, lg: 4 }} key={`demo${i}`}>
                <Link href={`car-details/${car.slug}`}>
                  <CarInfoCard
                    {...car}
                    isListStyle={windowWidth > 650 && windowWidth < 768}
                    myId={myId}
                  />
                </Link>
              </Grid.Col>
            ))
          }
        </>
      </Grid>
    </>
  )
}
