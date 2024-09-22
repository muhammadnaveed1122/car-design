import { Flex, Grid, Group, Modal, ScrollArea, Text } from "@mantine/core";
import { useWindowSize } from "@/hooks/useWindowSize";
import { useDisclosure } from "@mantine/hooks";
import { useState, useEffect } from "react";
import { CarInfoCard } from "./CarInfoCard";
import MyPagination from "./MyPagination";
import { userService } from "@/services";
import CarCardBid from "./CarCardBid";
import Link from "next/link";
import { base } from "@faker-js/faker";
import { useRouter } from "next/router";
export default function CarCardGridDesktop({ cList }) {
  const router = useRouter();
  const currentPageName = router.pathname;
  const [opened, { open, close }] = useDisclosure(false);
  const [carList, setCarList] = useState([]);
  const [bidCarId, setBidCarId] = useState(0);
  const [bidCarInfo, setBidCarInfo] = useState({});
  const [myId, setMyId] = useState(null);
  const windowWidth = useWindowSize();
  const [offset, setOffset] = useState(0);
  const [perPage, setPerPage] = useState(6);
  const [currentPage, setCurrentPage] = useState(1);
  useEffect(() => {
    setMyId(userService?.userValue?.id);
  }, [userService?.userValue]);

  const setCarsFilter = () => {
    const filteredList = cList.filter((item) => !item.referal);
    let targetCar = [];
    if (userService?.userValue && userService?.userValue.referal && cList) {
      const ind = cList.findIndex(
        (item) => item.referal === userService?.userValue.referal
      );

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
      setCarsFilter();
    } else {
      setCarList(cList);
    }
  }, [userService?.userValue, cList]);

  useEffect(() => {
    const savedPage = localStorage.getItem('currentPage');
    if (savedPage) {
      setCurrentPage(Number(savedPage));
      setOffset((Number(savedPage) - 1) * perPage); 
    }
  }, []);

  const handlePageChange = (val) => {
    setCurrentPage(val);
    localStorage.setItem('currentPage', val); 
    setOffset((val - 1) * perPage); 
  };
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
      <Flex
        px={12}
        mb={15}
        justify={{ base: "center", sm: "start" }}
        wrap="wrap"
      >
        <Text fw={700} pr={20} mt={3}>
          {carList?.length} Result{carList?.length > 1 ? "s" : ""}
        </Text>
        <MyPagination
          totalPages={Math.ceil(carList?.length / perPage)}
          onChange={handlePageChange} // Pass the handler to MyPagination
          value={currentPage} // Pass currentPage as a prop
        />
      </Flex>
      <Grid>
        {" "}
        {carList &&
          carList.slice(offset, offset + 6).map((car, i) => (
            <Grid.Col p="md" span={{ base: 12, sm: 6, lg: 4 }} key={`demo${i}`}>
              <Link href={`car-details/${car.slug}`}>
                <CarInfoCard
                  {...car}
                  isListStyle={windowWidth > 650 && windowWidth < 768}
                  myId={myId}
                />
              </Link>
            </Grid.Col>
          ))}
      </Grid>
    </>
  );
}
