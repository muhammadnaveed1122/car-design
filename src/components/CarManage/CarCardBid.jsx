import {
  useCarDispatch,
  bidCar,
  buyCar,
  fetchCarsAsync,
} from "@/redux/carsSlice";
import { Card, Grid, Text, Stack, Container, ScrollArea } from "@mantine/core";
import { carService, userService, paymentService } from "@/services";
import { useLoadingContext } from "@/providers/LoadingProvider";
import CarHeader from "../CarBidData/CarHeader";
import { IconCar } from "@tabler/icons-react";
import ImageGallery from "react-image-gallery";
import { replaceBaseUrl } from "@/helpers";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import parse from "html-react-parser";
import { toastShow } from "@/helpers";
import swal from "sweetalert";
import CarImageGallery from "../CarImageGallery/CarImageGallery";

const bidDiff = 25;
let oldPrice = 0;
export default function CarCardBid({ carId, carInfo }) {
  // console.log("carInfo====", carInfo)
  const leftMin = Math.ceil(
    (new Date(carInfo?.bidDeadline) - new Date()) / (1000 * 60)
  );

  const [car, setCar] = useState(carInfo);
  const [rivals, setRivals] = useState([]);
  const [myPrice, setMyPrice] = useState(0);
  const [isPaymentAccount, setIsPaymentAccount] = useState(false);
  const [totalPercent, setTotalPercent] = useState(0);
  const [disableMinus, setdisableMinus] = useState(true);
  const [timeElapsed, setTimeElapsed] = useState(leftMin);
  const [bidError, setBidError] = useState({});

  const [fakeView, setFakeViews] = useState(
    Math.floor(Math.random() * (150 - 60 + 1)) + 60
  );
  const [fakeBidder, setFakeBidder] = useState(
    // car?.autoBid ? JSON.parse(car?.autoBid) : {}
    car?.autoBid ? {} : {}
  );

  const router = useRouter();
  const dispatch = useCarDispatch();
  const loadingContext = useLoadingContext();

  const imgUrls = car.images ? JSON.parse(car.images) : [];
  const urlImages =
    imgUrls.length > 0
      ? imgUrls.map((image) => ({
        original: replaceBaseUrl(image),
        thumbnail: replaceBaseUrl(image),
      }))
      : [
        {
          original: "https://placehold.co/640x480?text=NoImage",
          thumbnail: "https://placehold.co/320x240?text=NoImage",
        },
      ];

  const getCarDetails = async () => {
    carService.getBySlug(carId).then((carData) => {
      const remaingTime = Math.ceil(
        (new Date(carData?.bidDeadline) - new Date()) / (1000 * 60)
      );
      setTimeElapsed(remaingTime);
      const bidData = carData?.autoBid ? JSON.parse(carData?.autoBid) : {};
      // setFakeBidder(bidData);
      const currentBidPrice = carData?.bidPrice;
      const initialBidPrice = carData?.initialBidPrice;
      const fakeCheck = Object.keys(bidData).length !== 0;
      if (
        (oldPrice != currentBidPrice && !fakeCheck) ||
        (oldPrice == currentBidPrice && fakeCheck)
      ) {
        updatePrice(currentBidPrice, initialBidPrice, fakeCheck, bidData);
      }
      setCar(carData);
      if (carData.status !== "LIVE") {
        router.push("/");
      }
      const activities = carData?.Activities;
      if (activities && activities.length > 0) {
        const actions = activities.sort((a, b) => b.price - a.price);

        setRivals(
          actions?.length === 0 || (actions[0] && actions[0].bidCount > 0)
            ? actions
            : actions.slice(0, 1)
        );
      } else {
        setRivals([]);
        // setFakeBidder(carData?.autoBid ? JSON.parse(carData?.autoBid) : {});
      }
    });
  };

  const updatePrice = (
    currentBidPrice,
    initialBidPrice,
    fakeCheck,
    bidData
  ) => {
    let newPrice = currentBidPrice;
    if (myPrice <= currentBidPrice + bidDiff) {
      if (initialBidPrice === currentBidPrice) {
        setMyPrice(newPrice);
      } else if (rivals.length) {
        setMyPrice(newPrice + bidDiff);
      } else {
        setMyPrice(newPrice);
      }
    } else {
      setMyPrice(newPrice);
    }
    oldPrice = currentBidPrice;
    setdisableMinus(true);
  };

  const convertElapsedDuration = (t) => {
    const min = t % 60;
    const hours = Math.floor(t / 60) % 24;
    const days = Math.floor(t / (60 * 24));

    if (days > 0) {
      return `Ends in ${days} Day${days > 1 ? "s" : ""}`;
    } else {
      const formattedHours = hours < 10 ? `0${hours}` : `${hours}`;
      const formattedMinutes = min < 10 ? `0${min}` : `${min}`;
      return `${formattedHours}:${formattedMinutes}`;
    }
  };

  const onBidClicked = async () => {
    if (myPrice === 0 || !myPrice) {
      toastShow("Invaild price", "error");
      return;
    }
    if (myPrice.toString().includes(".")) {
      toastShow("Decimal are not allowed", "error");
      return;
    }

    const lastPrice = car?.bidPrice;
    if (rivals?.length == 0 || car?.fakeName) {
      setMyPrice(car?.bidPrice + bidDiff);
    }
    // if (rivals.length) {
    //   lastPrice = car?.bidPrice + bidDiff;
    // } else {
    //   lastPrice = car?.bidPrice;
    // }
    let bidPrice = myPrice;
    if (myPrice < lastPrice) {
      bidPrice = lastPrice;
      setMyPrice((prv) => lastPrice);
    }
    loadingContext.setIsLoading(true);

    await dispatch(
      bidCar({
        carId: car.id,
        userId: userService?.userValue?.id,
        price: bidPrice,
        loadingContext: loadingContext,
        router: router,
        referal: userService?.userValue.referal,
        getCarDetails: getCarDetails,
      })
    );
    setTotalPercent((prv) => 100);
    setTimeout(() => {
      setTotalPercent((prv) => 0);
    }, 2000);
    dispatch(
      fetchCarsAsync({
        id: userService?.userValue?.id,
        referal: userService?.userValue.referal,
      })
    );
    setFakeBidder({});
  };

  const onBuyClicked = () => {
    swal({
      content: {
        element: "div",
        attributes: {
          innerHTML: `
            <img src="./../assets/buy-icon.png" style="width: 80px; height: 80px; margin-bottom: 10px;">
            <h3 style="text-align: center;color: #fff;">Are you sure you want to buy this car?</h3>
          `,
        },
      },
      dangerMode: true,
      buttons: true,
      className: "buy-car-model",
    }).then((willBuy) => {
      if (willBuy) {
        dispatch(
          buyCar({
            carId: car?.id,
            userId: userService?.userValue?.id,
            router,
          })
        );
        dispatch(userService.getById(userService?.userValue?.id));
      }
    });
  };

  const getPaymentDetails = async () => {
    try {
      const data = await paymentService.getById(userService.userValue?.id);
      if (data.pAccount) {
        setIsPaymentAccount(true);
      }
    } catch (error) {
      setIsPaymentAccount(false);
    }
  };

  const checkPriceDetails = async (value) => {
    if (carInfo?.bidPrice > value - 25) {
      bidError.bid = "minimum bid diffirence is 25";
    } else {
      setBidError({});
    }
  };
  useEffect(() => {
    if (carId) {
      loadingContext.setIsLoading(true);
      carService
        .getBySlug(carId)
        .then((car) => {
          setCar(car);
          if (car.status !== "LIVE") {
            router.push("/");
          }
          const activities = car?.Activities;
          if (activities && activities.length > 0) {
            const actions = activities.sort((a, b) => b.price - a.price);
            setRivals(
              actions?.length === 0 || (actions[0] && actions[0].bidCount > 0)
                ? actions
                : actions.slice(0, 1)
            );
          } else {
            setRivals([]);
            // setFakeBidder(car?.autoBid ? JSON.parse(car?.autoBid) : {});
          }
          loadingContext.setIsLoading(false);
        })
        .catch((err) => {
          loadingContext.setIsLoading(false);
          toastShow("Error getting latest data, Please reload page", "error");
        });
    }
  }, [carId]);

  useEffect(() => {
    const currentBidPrice = car?.bidPrice;
    const initialBidPrice = car?.initialBidPrice;
    const fakeCheck = Object.keys(fakeBidder).length !== 0;
    if (oldPrice !== currentBidPrice) {
      updatePrice(currentBidPrice, initialBidPrice, fakeCheck, fakeBidder);
    }
  }, [car?.bidPrice]);

  if (car) {
    useEffect(() => {
      const intervalId = setInterval(() => {
        setTimeElapsed((cur) => cur - 1);
      }, 1000 * 60);
      return () => clearInterval(intervalId);
    }, [car?.bidDeadline]);

    useEffect(() => {
      const intervalId = setInterval(() => {
        getCarDetails();
      }, 30000);
      return () => clearInterval(intervalId);
    }, []);
  }
  useEffect(() => {
    if (userService.userValue?.id) {
      getPaymentDetails();
    }
  }, [userService.userValue?.id]);
  return (
    <Container size="xl" p={'0 10px'}>
      <Grid>
        <Grid.Col span={{ base: 12, md: 8 }}>
          {/* <Card withBorder mx={{ sm: "md" }} radius="lg" shadow="sm">
            <Card.Section>
              <ImageGallery
                items={urlImages}
                showThumbnails={true}
                showPlayButton={false}
                autoPlay={false}
                showNav={true}
              />
            </Card.Section>
          </Card> */}
          <CarImageGallery car={car} />
          <Card
            visibleFrom="sm"
            mt="xl"
            withBorder
            mx={{ sm: "md" }}
            radius="lg"
            shadow="sm"
          >
            <Card.Section withBorder inheritPadding p="lg">
              <Stack align="center" gap={0}>
                <IconCar
                  size={30}
                  stroke={1.6}
                  color="var(--mantine-color-ocean-blue-filled)"
                />
                <Text fz={14} c="ocean-blue" fw={500}>
                  Vehicle Description
                </Text>
              </Stack>
            </Card.Section>
            <Card.Section withBorder inheritPadding>
              <div
                className="ck-editor-text"
                dangerouslySetInnerHTML={{ __html: car?.specs }}
              />
              {/* <ScrollArea p="xl">{parse(car?.specs || "")}</ScrollArea> */}
            </Card.Section>
          </Card>
        </Grid.Col>
        <CarHeader
          car={car}
          convertElapsedDuration={convertElapsedDuration}
          timeElapsed={timeElapsed}
          rivals={rivals}
          fakeView={fakeView}
          fakeBidder={fakeBidder}
          totalPercent={totalPercent}
          myPrice={myPrice}
          disableMinus={disableMinus}
          setdisableMinus={setdisableMinus}
          setMyPrice={setMyPrice}
          onBidClicked={onBidClicked}
          onBuyClicked={onBuyClicked}
          isPaymentAccount={isPaymentAccount}
          getPaymentDetails={getPaymentDetails}
          getCarDetails={getCarDetails}
          bidError={bidError}
          checkPriceDetails={checkPriceDetails}
        />
        <Grid.Col hiddenFrom="sm" span={{ base: 12, md: 8 }}>
          <Card withBorder mx={{ sm: "md" }} radius="lg" shadow="sm">
            <Card.Section withBorder inheritPadding p="lg">
              <Stack align="center" gap={0}>
                <IconCar
                  size={30}
                  stroke={1.6}
                  color="var(--mantine-color-ocean-blue-filled)"
                />
                <Text fz={14} c="ocean-blue" fw={500}>
                  Vehicle Description
                </Text>
              </Stack>
            </Card.Section>
            <Card.Section withBorder inheritPadding>
              {/* <ScrollArea p="xl">{parse(car?.specs || "")}</ScrollArea> */}
              <div
                className="ck-editor-text"
                dangerouslySetInnerHTML={{ __html: car?.specs }}
              />
            </Card.Section>
          </Card>
        </Grid.Col>
      </Grid>
    </Container>
  );
}
