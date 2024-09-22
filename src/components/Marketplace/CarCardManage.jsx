import CarInfoForm from "./CarInfoForm";
import { SimpleGrid } from '@mantine/core';
import { CarInfoCard } from "./CarInfoCard";
import { useState, useEffect } from "react";
import { useDisclosure } from "@mantine/hooks";
import { userCarStatus } from "@/constants/data";
import MyPagination from "@/components/CarManage/MyPagination";
import { useLoadingContext } from "@/providers/LoadingProvider";
import { Grid, Button, Modal, Checkbox, Group, Text, ScrollArea } from "@mantine/core";
import { deleteUserCarsAsync, resetUserCars, updateStatusCarAsync, useUserCarDispatch } from "@/redux/userCarsSlice";
import CardSkeleton from "../CardLoader/CardSkeleton";
import CardLoader from "../CardLoader/cardLoader";

export default function CarCardManage({
  carCount,
  isListStyle,
  cList,
  carType,
  fetchData,
  loading
}) {
  const dispatch = useUserCarDispatch();
  const loadingContext = useLoadingContext();
  const [opened, { open, close }] = useDisclosure(false);

  const [offset, setOffset] = useState(0);
  const [carInfo, setCarInfo] = useState({});
  const [carList, setCarList] = useState([]);
  const [checkedList, setCheckedList] = useState([]);

  const areAllItemsSelected = () => {
    const nonZeroItems = carList
      .filter((car) => car.id !== 0)
      .map((car) => car.id);

    return nonZeroItems
      .slice(offset, offset + 6)
      .every((id) => checkedList.includes(id));
  };

  const toggleChecked = (carId) => {
    if (checkedList.indexOf(carId) === -1) {
      setCheckedList([...checkedList, carId]);
      if (carId === 0) {
        setCheckedList([
          ...carList.slice(offset, offset + 6).map((car) => car.id),
          0,
        ]);
      }
    } else {
      setCheckedList(checkedList.filter((val) => val != carId));
      if (carId === 0) setCheckedList([]);
    }
  };

  const updateStatus = async (id) => {
    loadingContext.setIsLoading(true);
    await dispatch(updateStatusCarAsync({ status: userCarStatus[1], id: id }))
    dispatch(resetUserCars())
    fetchData()
    loadingContext.setIsLoading(false);
    close();
  }
  const handleDelete = () => {
    dispatch(deleteUserCarsAsync(checkedList));
    fetchData()
    setOffset(0);
  };

  useEffect(() => {
    setCarList(cList);
    setCheckedList([]);
  }, [cList]);

  if (loading) {
    return <SimpleGrid cols={3} spacing="lg">
      {[...Array(3)].map((_, index) => (
        <CardSkeleton key={index} />
      ))}
    </SimpleGrid>
  }
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
        title="Car Information"
        centered
      >
        <ScrollArea h="calc(100vh - 200px)">
          <CarInfoForm {...carInfo} onSubmit={close} type={carType} fetchData={fetchData} />
        </ScrollArea>
      </Modal>

      <Grid>
        <Grid.Col span={12}>
          <Group p="lg">
            <Text fw={700}>
              {carCount === 0 ? "No Result" : `${carCount} Result${carCount > 1 ? "s" : ""}`}
            </Text>
            <MyPagination
              totalPages={Math.ceil(carCount / 6)}
              onChange={(val) => setOffset((val - 1) * 6)}
            />
            <Button
              leftSection={
                <Checkbox
                  disabled={carCount === 0 ? true : false}
                  key={`checkAll`}
                  checked={areAllItemsSelected()}
                  onChange={() => toggleChecked(0)}
                />
              }
              disabled={carCount === 0 ? true : false}
              onClick={() => toggleChecked(0)}
            >
              Select All
            </Button>
            <Button
              bg="green"
              onClick={() => {
                setCarInfo({});
                open();
              }}
            >
              Create
            </Button>
            <Button
              bg="red"
              onClick={handleDelete}
              disabled={checkedList.length === 0}
            >
              Delete
            </Button>
            {
              carType == "LIVE" && <Button
                onClick={() => {
                  checkedList.map((car) => {
                    car != 0 ? updateStatus(car) : null
                  })
                }}
                disabled={checkedList.length === 0}
              >
                Marked As Sold
              </Button>
            }

          </Group>
        </Grid.Col>

        {carList.slice(offset, offset + 6).map((car, i) => (
          <Grid.Col
            p="md"
            maw={isListStyle ? 800 : 420}
            mx={{ md: "0", base: "auto" }}
            w="100%"
            span={isListStyle ? 12 : { xs: 6, lg: 4 }}
            key={`demo${i}`}
            style={{ position: "relative" }}
          >
            <Checkbox
              style={{
                position: "relative",
                zIndex: 100,
                marginBottom: "-30px",
                marginTop: "10px",
                marginLeft: "10px",
                w: "20",
                h: "20",
              }}
              key={`check${car.id}`}
              checked={checkedList.indexOf(car.id) !== -1}
              onChange={() => toggleChecked(car.id)}
              onClick={(e) => e.stopPropagation()}
            />
            <CarInfoCard
              {...car}
              isListStyle={isListStyle}
              onClick={() => {
                setCarInfo(car);
                open();
              }}
            />
          </Grid.Col>
        ))}
      </Grid>

    </>
  );
}
