
import { Grid, Modal, Group, Text, ScrollArea } from '@mantine/core';
import MyPagination from '@/components/CarManage/MyPagination';
import { useWindowSize } from '@/hooks/useWindowSize';
import InvoiceTemplate from './InvoiceTemplate';
import { useDisclosure } from '@mantine/hooks';
import { CarInfoCard } from './CarInfoCard';
import { useState, useEffect } from 'react';
import { userService } from '@/services';

export default function CarCardEnded({ carCount, cList }) {

  const [opened, { open, close }] = useDisclosure(false);
  const [carList, setCarList] = useState([]);
  const [bidCarId, setBidCarId] = useState(0);
  const [myId, setMyId] = useState(null);
  const [offset, setOffset] = useState(0);
  const windowWidth = useWindowSize();

  useEffect(() => {
    setCarList(cList);
  }, [cList]);

  useEffect(() => {
    setMyId(userService?.userValue?.id);
  }, [userService?.userValue]);

  return (
    <>
      <Modal
        size="xl"
        opened={opened}
        onClose={close}
        overlayProps={{
          backgroundOpacity: 0.55,
          blur: 3,
        }}
        zIndex={500}
      >
        <ScrollArea h="calc(100vh - 200px)">
          <InvoiceTemplate carId={bidCarId} />
        </ScrollArea>
      </Modal>
      <Grid>
        {carList.slice(offset, offset + 6).map((car, i) => (
          <Grid.Col p="md" span={{ base: 12, sm: 6, lg: 4 }} key={`demo${i}`}>
            <CarInfoCard
              {...car}
              isListStyle={windowWidth > 650 && windowWidth < 768}
              myId={myId}
              onClick={() => {
                if (car.invoiceSent) {
                  setBidCarId(car.id); open();
                }
              }} />
          </Grid.Col>
        ))}
        {myId > 0 &&
          <Grid.Col span={12}>
            <Group p="lg">
              <Text fw={700}>
                {carCount} Result{carCount > 1 ? 's' : ''}
              </Text>
              <MyPagination
                totalPages={Math.ceil(carCount / 6)}
                onChange={(val) => setOffset((val - 1) * 6)}
              />
            </Group>
          </Grid.Col>
        }
      </Grid>
    </>
  )
}
