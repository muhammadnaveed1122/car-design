import {
  Grid,
  Button,
  Modal,
  Checkbox,
  Group,
  Text,
  ScrollArea,
} from "@mantine/core";
import { useCarDispatch, deleteCar, fetchCarsAsync } from "@/redux/carsSlice";
import { useLoadingContext } from "@/providers/LoadingProvider";
import MyPagination from "@/components/CarManage/MyPagination";
import { useDisclosure } from "@mantine/hooks";
import { CarInfoCard } from "./CarInfoCard";
import { useState, useEffect } from "react";
import ReferalModal from "./ReferalModal";
import CarInfoForm from "./CarInfoForm";
import { carService } from "@/services";
import { toastShow } from "@/helpers";

export default function CarCardManage({
  carCount,
  isListStyle,
  cList,
  carType,
}) {
  const dispatch = useCarDispatch();
  const loadingContext = useLoadingContext();

  const [opened, { open, close }] = useDisclosure(false);
  const [carInfo, setCarInfo] = useState({});
  const [carList, setCarList] = useState([]);
  const [checkedList, setCheckedList] = useState([]);
  const [offset, setOffset] = useState(0);
  const [isReferal, setIsReferal] = useState(false);
  const [duplicatedCar, setDuplicatedCar] = useState();
  const [isDisable, setIsDisable] = useState(true);

  const checkIsEnable = () => {
    if (
      (checkedList.includes(0) && checkedList.length === 2) ||
      checkedList.length === 1
    ) {
      setIsDisable(false);
    } else {
      setIsDisable(true);
    }
  };
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

  const handleDelete = () => {
    dispatch(deleteCar(checkedList));
    setOffset(0);
  };
  const handleDuplicate = async () => {
    const foundItem = cList.find((item) => item.id === checkedList[0]);
    const clonedItem = JSON.parse(JSON.stringify(foundItem));

    if (clonedItem) {
      delete clonedItem.createdAt;
      delete clonedItem.id;

      delete clonedItem.updatedAt;
      delete clonedItem?.User;
      clonedItem.bidCount = 0;
      clonedItem.purchaseSteps = 0;
      clonedItem.bidderId = null;
      clonedItem.invoiceSent = null;
    }
    try {
      if (clonedItem.referal) {
        setIsReferal(true);
        setDuplicatedCar(clonedItem);
      } else {
        const formData = JSON.stringify(clonedItem);
        loadingContext.setIsLoading(true);

        const res = await carService.duplicateCar(formData);
        if (res) {
          toastShow("Car duplicated sucessfully");
        }
      }

      dispatch(fetchCarsAsync({ referal: "ALL" }));
      loadingContext.setIsLoading(false);
    } catch (err) {
      toastShow("Something went Wrong", "error");
      loadingContext.setIsLoading(false);
    }
  };
  useEffect(() => {
    setCarList(cList);
    setCheckedList([]);
  }, [cList]);
  useEffect(() => {
    checkIsEnable();
  }, [checkedList]);
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
          <CarInfoForm {...carInfo} onSubmit={close} type={carType} />
        </ScrollArea>
      </Modal>

      <Grid>
        <Grid.Col span={12}>
          <Group p="lg">
            <Text fw={700}>
              {carCount} Result{carCount > 1 ? "s" : ""}
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
            <Button bg="#27a3ff" onClick={handleDuplicate} disabled={isDisable}>
              Duplicate
            </Button>
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
      {isReferal ? (
        <ReferalModal car={duplicatedCar} setIsReferal={setIsReferal} />
      ) : null}
    </>
  );
}
