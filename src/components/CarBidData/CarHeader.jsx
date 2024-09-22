import { useEffect, useState } from "react";
import {
  IconHeart,
  IconEye,
  IconHomeUp,
  IconCreditCard,
  IconThumbUp,
  IconSearch,
  IconPremiumRights,
  IconHourglassLow,
  IconCalendar,
  IconCar,
  IconCarSuv,
  IconGauge,
  IconEngine,
  IconArmchair,
  IconDoor,
  IconCarGarage,
  IconTransfer,
  IconCarTurbine,
  IconHeartHandshake,
  IconPlus,
  IconMinus,
  IconSteeringWheel,
  IconGasStation,
  IconCylinder,
  Icon123,
} from "@tabler/icons-react";
import {
  Card,
  Group,
  Grid,
  Text,
  Button,
  Image,
  Box,
  Stack,
  NumberInput,
  Divider,
  NavLink,
  Badge,
  Flex,
  Modal,
  darken,
} from "@mantine/core";
import { modals } from "@mantine/modals";
import { CarInfoToggle } from "../CarManage/CarInfoToggle";
import ProgressRing from "../CarManage/progressRing";
import { currencyFormater } from "@/constants/data";
import { userService } from "@/services";
import { useRouter } from "next/router";
import Link from "next/link";
import { useDisclosure } from "@mantine/hooks";
import PaymentDetails from "@/components/Payments/payment";
import { replaceBaseUrl } from "@/helpers";

const bidDiff = 25;
function CarHeader({
  car,
  convertElapsedDuration,
  timeElapsed,
  rivals,
  fakeView,
  fakeBidder,
  totalPercent,
  myPrice,
  disableMinus,
  setMyPrice,
  setdisableMinus,
  onBuyClicked,
  onBidClicked,
  isPaymentAccount,
  getPaymentDetails,
  getCarDetails,
  bidError,
  checkPriceDetails,
}) {
  const [opened, { open, close }] = useDisclosure(false);
  const [call, setCall] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const timer = setTimeout(() => {
      getCarDetails();
    }, 2000);

    return () => {
      clearTimeout(timer);
    };
  }, []);

  useEffect(() => {
    if (call) {
      getPaymentDetails();
    }
  }, [call]);

  return (
    <>
      <Modal
        size="md"
        opened={opened}
        onClose={close}
        overlayProps={{
          backgroundOpacity: 0.55,
          blur: 3,
        }}
        // fullScreen
        zIndex={500}
        className="paymentDetailModal"
      >
        <PaymentDetails onClose={close} setCall={setCall} />
        {/* <PaymentOption onClose={close} opened={open} /> */}
      </Modal>
      <Grid.Col span={{ base: 12, md: 4 }}>
        <Card withBorder mx={{ sm: "sm" }} radius="lg" shadow="sm">
          <Card.Section withBorder inheritPadding pt="md">
            <Group justify="flex-end" gap="20">
              <Badge
                py="6px"
                h='auto'
                rightSection={<IconHourglassLow size="1rem" />}
                size="md"
                c='#000'
              >
                {car?.status == "LIVE"
                  ? convertElapsedDuration(timeElapsed)
                  : "ENDED"}
              </Badge>
            </Group>
            <Flex mt="xs" justify="space-between" align="center" gap={15}>
              <Group wrap="nowrap">
                <Box
                  style={{
                    borderRadius: "50%",
                    overflow: "hidden",
                    flex: "0 0 auto",
                  }}
                >
                  <Image
                    src={
                      car?.companyImage
                        ? replaceBaseUrl(car?.companyImage)
                        : "/assets/cars/car1.webp"
                    }
                    style={{ width: "40px", height: "40px" }}
                    alt=""
                  />
                </Box>
                <Text fw={500} fz="xl">
                  {car?.companyName
                    ? car?.companyName
                    : "Trade Dept"}
                </Text>
              </Group>
              <Text>Private</Text>
            </Flex>
            <Group align="top" my="xs" wrap="nowrap">
              <Text
                fw={700}
                fz="lg"
                w="calc(100% - 2rem)"
                color="var(--mantine-color-ocean-blue-filled)"
              >
                {car?.make} {car?.model} {car?.year}
              </Text>
            </Group>
            <Group justify="space-between" my="md">
              {car?.location ? (
                <Group wrap="nowrap">
                  <Box
                    style={{
                      borderRadius: "50%",
                      overflow: "hidden",
                      flex: "0 0 auto",
                    }}
                  >
                    <Image
                      src="/assets/usa.png"
                      style={{ width: "22px", height: "22px" }}
                      alt="flag img"
                    />
                  </Box>
                  <Text fw={500} fz={14}>
                    {car?.location ? car?.location : " "}
                  </Text>
                </Group>
              ) : (
                ""
              )}
              {/* <Group>
                <Group gap="xs">
                  <IconHeart stroke={1.5} />
                  <Text fw={500} fz={14}>
                    {rivals.length}
                  </Text>
                </Group>
                <Group gap="xs">
                  <IconEye stroke={1.5} />
                  <Text fw={500} c="dimmed" fz={14}>
                    {fakeView}
                  </Text>
                </Group>
              </Group> */}
            </Group>
            <Group justify="space-between" align="top" my="md">
              <Group></Group>
            </Group>
            <Text c="dimmed" fz={14} mb="sm">
            Istoricul este oferit gratuit de Trade Dept.
            </Text>
            {car?.pdf && (
              <Group justify="space-between" align="center">
                {/* {userService.userValue?.id ? (
                  <a href={car?.pdf} download="document.pdf" target="_blank">
                    <Button radius="lg" c='#000'>Istoric Gratuit</Button>
                  </a>
                )
                : (
                  <Link href={"/signin"}>
                    <Button radius="lg" c='#000'>Istoric Gratuit</Button>
                  </Link>
                )} */}
                  <a href={car?.pdf} download="document.pdf" target="_blank">
                    <Button radius="lg" c='#000'>Istoric Gratuit</Button>
                  </a>
                <Image
                  src="/assets/carvertical.png"
                  w="120"
                  alt="vehiclehistory logo"
                />
              </Group>
            )}
            {!car?.pdf && (
              <Box align="right">
                <Image
                  src="/assets/carvertical.png"
                  w="120"
                  alt="vehiclehistory logo"
                />
              </Box>
            )}
            <Group justify="space-between" mt="xl"></Group>
          </Card.Section>
          <Card.Section withBorder inheritPadding px="lg">
            {rivals[0]?.User.id !== userService?.userValue?.id ? (
              <>
                <Text
                  fw={500}
                  fz="xl"
                  ta="center"
                  color="var(--mantine-color-ocean-blue-filled)"
                  style={{ paddingTop: "15px" }}
                >
                  {!car?.referal
                    ? "Current Highest Offer"
                    : "Current Highest Offer"}
                </Text>
                <ProgressRing
                  bidPrice={currencyFormater(
                    !rivals[0]?.price ? car?.price : car?.bidPrice
                  )}
                  name={
                    car?.fakeName
                      ? car?.fakeName
                      : rivals[0]?.User?.firstName || rivals[0]?.User?.lastName
                      ? `${
                          rivals[0]?.User?.firstName ??
                          rivals[0]?.User?.firstName
                        }  ${
                          rivals[0]?.User?.lastName ?? rivals[0]?.User?.lastName
                        }`
                      : ""
                  }
                  avatar={rivals[0]?.User?.avatar}
                  percent={totalPercent}
                />
              </>
            ) : (
              rivals?.map((rival, i) => {
                if (rival.User.id === userService?.userValue?.id) {
                  return (
                    <ProgressRing
                      bidPrice={currencyFormater(car?.bidPrice)}
                      name={
                        car?.fakeName
                          ? car?.fakeName
                          : userService?.userValue?.firstName ||
                            userService?.userValue?.lastName
                          ? `${
                              userService?.userValue?.firstName ??
                              userService?.userValue?.firstName
                            }  ${
                              userService?.userValue?.lastName ??
                              userService?.userValue.lastName
                            }`
                          : ""
                      }
                      avatar={userService?.userValue?.avatar}
                      percent={totalPercent}
                    />
                  );
                }
              })
            )}
            <Group my="md" gap={5}>
              <Flex justify="space-between" gap="15">
                <NumberInput
                  placeholder="Enter bid amount"
                  value={currencyFormater(myPrice)}
                  onChange={(val) => {
                    setMyPrice(val);
                    checkPriceDetails(val);
                  }}
                  thousandSeparator=","
                  step={bidDiff}
                  leftSection={<IconPremiumRights color="#3CDFCD" />}
                  rightSectionPointerEvents="none"
                  radius="lg"
                  clampBehavior="strict"
                  allowDecimal={false}
                  allowNegative={false}
                  min={0}
                  max={10000000000000000}
                  w="100%"
                  className="bid-number"
                />
                <Flex gap="15">
                  <Button
                    radius="md"
                    color="#7f859d"
                    disabled={disableMinus}
                    onClick={() => {
                      if (myPrice > car?.bidPrice) {
                        if (car?.bidPrice === myPrice - bidDiff) {
                          setdisableMinus(true);
                          if (myPrice - bidDiff < car?.bidPrice) {
                            setMyPrice(car?.bidPrice);
                          } else {
                            setMyPrice(myPrice - bidDiff);
                          }
                        } else {
                          // setMyPrice(myPrice - bidDiff);
                          if (myPrice - bidDiff < car?.bidPrice) {
                            setMyPrice(car?.bidPrice);
                          } else {
                            setMyPrice(myPrice - bidDiff);
                          }
                          setdisableMinus(false);
                        }
                      } else {
                        setdisableMinus(true);
                      }
                    }}
                  >
                    <IconMinus size="20" />
                  </Button>
                  <Button
                    radius="md"
                    onClick={() => {
                      setMyPrice(parseInt(myPrice + bidDiff));
                      setdisableMinus(false);
                    }}
                  >
                    <IconPlus />
                  </Button>
                </Flex>
              </Flex>
              {bidError?.bid ? (
                <Text c="red" className="error_message">
                  Raise your bid by $25 minimum.
                </Text>
              ) : (
                ""
              )}
            </Group>
            <Button
              w="100%"
              c='#000'
              onClick={() => {
                if (!userService?.userValue?.id) {
                  router.push("/signin");
                } else if (bidError?.bid) {
                } else if (!isPaymentAccount) {
                  open(true);
                } else {
                  onBidClicked();
                }
              }}
              disabled={car?.status != "LIVE"}
              size="md"
              radius="lg"
            >
              Make an offer
            </Button>
            <Divider my="sm" />
            <Group grow my="sm" withBorder>
              <Button
                size="md"
                radius="lg"
                color="#3CDFCD"
                variant="outline"
                onClick={() => {
                  if (!userService?.userValue?.id) {
                    router.push("/signin");
                  } else if (!isPaymentAccount) {
                    // router.push('/payment');
                    open(true);
                  } else {
                    onBuyClicked();
                  }
                }}
                disabled={car?.bidPrice > car?.price || car?.status != "LIVE"}
              >
                <Text mx="lg" color="#3CDFCD" fw={500}>
                  Buy it now
                </Text>
                <IconPremiumRights /> {currencyFormater(car?.price)}
              </Button>
            </Group>
          </Card.Section>
        </Card>
        <CarInfoToggle title="Key Vehicle Information" toggleOpened={true}>
          <Group gap={"12 0"}>
            <Group gap={10} pl={{ base: "sm", md: "lg" }} w="calc(50% - 10px)">
              <IconCalendar color="var(--mantine-color-ocean-blue-filled)" />
              <Stack gap={1} w="calc(100% - 40px)">
                <Text fz={12} c="dimmed">
                  Year
                </Text>
                <Text fz={12}>{car?.year}</Text>
              </Stack>
            </Group>
            <Group gap={10} pl={{ base: "sm", md: "lg" }} w="calc(50% - 10px)">
              <IconCar color="var(--mantine-color-ocean-blue-filled)" />
              <Stack gap={1} w="calc(100% - 40px)">
                <Text fz={12} c="dimmed">
                  Make
                </Text>
                <Text fz={12}>{car?.make}</Text>
              </Stack>
            </Group>
            <Group gap={10} pl={{ base: "sm", md: "lg" }} w="calc(50% - 10px)">
              <IconCarSuv color="var(--mantine-color-ocean-blue-filled)" />
              <Stack gap={1} w="calc(100% - 40px)">
                <Text fz={12} c="dimmed">
                  Model
                </Text>
                <Text fz={12}>{car?.model}</Text>
              </Stack>
            </Group>
            <Group gap={10} pl={{ base: "sm", md: "lg" }} w="calc(50% - 10px)">
              <IconTransfer color="var(--mantine-color-ocean-blue-filled)" />
              <Stack gap={1} w="calc(100% - 40px)">
                <Text fz={12} c="dimmed">
                  Transmission
                </Text>
                <Text fz={12}>{car?.transmission}</Text>
              </Stack>
            </Group>
            <Group gap={10} pl={{ base: "sm", md: "lg" }} w="calc(50% - 10px)">
              <IconCarTurbine color="var(--mantine-color-ocean-blue-filled)" />
              <Stack gap={1} w="calc(100% - 40px)">
                <Text fz={12} c="dimmed">
                  Lot
                </Text>
                <Text fz={12}>{car?.lot}</Text>
              </Stack>
            </Group>
            <Group gap={10} pl={{ base: "sm", md: "lg" }} w="calc(50% - 10px)">
              <IconCarGarage color="var(--mantine-color-ocean-blue-filled)" />
              <Stack gap={1} w="calc(100% - 40px)">
                <Text fz={12} c="dimmed">
                  Color
                </Text>
                <Text fz={12}>{car?.color}</Text>
              </Stack>
            </Group>
            <Group gap={10} pl={{ base: "sm", md: "lg" }} w="calc(50% - 10px)">
              <IconEngine color="var(--mantine-color-ocean-blue-filled)" />
              <Stack gap={1} w="calc(100% - 40px)">
                <Text fz={12} c="dimmed">
                  Engine
                </Text>
                <Text fz={12}>{car?.engine}</Text>
              </Stack>
            </Group>
            <Group gap={10} pl={{ base: "sm", md: "lg" }} w="calc(50% - 10px)">
              <IconArmchair color="var(--mantine-color-ocean-blue-filled)" />
              <Stack gap={1} w="calc(100% - 40px)">
                <Text fz={12} c="dimmed">
                  Seats
                </Text>
                <Text fz={12}>{car?.seats}</Text>
              </Stack>
            </Group>
            <Group gap={10} pl={{ base: "sm", md: "lg" }} w="calc(50% - 10px)">
              <IconGauge color="var(--mantine-color-ocean-blue-filled)" />
              <Stack gap={1} w="calc(100% - 40px)">
                <Text fz={12} c="dimmed">
                  Mileage
                </Text>
                <Text fz={12}>{currencyFormater(car?.mileage)} KM</Text>
              </Stack>
            </Group>
            <Group gap={10} pl={{ base: "sm", md: "lg" }} w="calc(50% - 10px)">
              <IconDoor color="var(--mantine-color-ocean-blue-filled)" />
              <Stack gap={1} w="calc(100% - 40px)">
                <Text fz={12} c="dimmed">
                  Doors
                </Text>
                <Text fz={12}>{car?.doors}</Text>
              </Stack>
            </Group>
            {car?.cylinders && (
              <Group
                gap={10}
                pl={{ base: "sm", md: "lg" }}
                w="calc(50% - 10px)"
              >
                <IconCylinder color="var(--mantine-color-ocean-blue-filled)" />
                <Stack gap={1} w="calc(100% - 40px)">
                  <Text fz={12} c="dimmed">
                    Cylinders
                  </Text>
                  <Text fz={12}>{car?.cylinders}</Text>
                </Stack>
              </Group>
            )}
            {car?.fuelType && (
              <Group
                gap={10}
                pl={{ base: "sm", md: "lg" }}
                w="calc(50% - 10px)"
              >
                <IconGasStation color="var(--mantine-color-ocean-blue-filled)" />
                <Stack gap={1} w="calc(100% - 40px)">
                  <Text fz={12} c="dimmed">
                    Fuel Type
                  </Text>
                  <Text fz={12}>{car?.fuelType}</Text>
                </Stack>
              </Group>
            )}
            {car?.bodyStyle && (
              <Group
                gap={10}
                pl={{ base: "sm", md: "lg" }}
                w="calc(50% - 10px)"
              >
                <IconCarGarage color="var(--mantine-color-ocean-blue-filled)" />
                <Stack gap={1} w="calc(100% - 40px)">
                  <Text fz={12} c="dimmed">
                    Body Style
                  </Text>
                  <Text fz={12}>{car?.bodyStyle}</Text>
                </Stack>
              </Group>
            )}
            {car?.vin && (
              <Group
                gap={10}
                pl={{ base: "sm", md: "lg" }}
                w="calc(50% - 10px)"
              >
                <Icon123 color="var(--mantine-color-ocean-blue-filled)" />
                <Stack gap={1} w="calc(100% - 40px)">
                  <Text fz={12} c="dimmed">
                    VIN Number
                  </Text>
                  <Text fz={12}>{car?.vin}</Text>
                </Stack>
              </Group>
            )}
            {car?.driveType && (
              <Group
                gap={10}
                pl={{ base: "sm", md: "lg" }}
                w="calc(50% - 10px)"
              >
                <IconSteeringWheel color="var(--mantine-color-ocean-blue-filled)" />
                <Stack gap={1} w="calc(100% - 40px)">
                  <Text fz={12} c="dimmed">
                    Drive Type
                  </Text>
                  <Text fz={12}>{car?.driveType}</Text>
                </Stack>
              </Group>
            )}
          </Group>
        </CarInfoToggle>
        <CarInfoToggle title="Included Services" toggleOpened={true}>
          <Stack grow>
            <Group grow justify="space-between">
              <Box align="center" p="sm">
                <IconHeartHandshake size={60} stroke={1.2} />
                <Text fw={500} align="center">
                  Bid online with confidence
                </Text>
                <Text fw={500} align="center">
                  All of our vehicles include these services:
                </Text>
              </Box>
            </Group>
            <Divider my="md" />
            <Box px="lg">
              <NavLink
                color="#3CDFCD"
                my="md"
                href="/delivery"
                target="_blank"
                label="Free Home Delivery"
                leftSection={<IconHomeUp size="1rem" stroke={1.5} />}
                active
              />
              <NavLink
                color="#3CDFCD"
                my="md"
                href="/return"
                target="_blank"
                label="7 Day Money-Back Guarantee"
                leftSection={<IconCreditCard size="1rem" stroke={1.5} />}
                active
              />
              <NavLink
                color="#3CDFCD"
                my="md"
                href="/warranty"
                target="_blank"
                label="90 Days Warranty"
                leftSection={<IconThumbUp size="1rem" stroke={1.5} />}
                active
              />
              <NavLink
                color="#3CDFCD"
                my="md"
                href="/inspection"
                label="299 Points Inspection"
                target="_blank"
                leftSection={<IconSearch size="1rem" stroke={1.5} />}
                active
              />
            </Box>
          </Stack>
        </CarInfoToggle>
      </Grid.Col>
    </>
  );
}

export default CarHeader;
