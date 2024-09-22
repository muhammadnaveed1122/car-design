import { useEffect } from "react";
import {
  IconEye,
  IconHomeUp,
  IconCreditCard,
  IconThumbUp,
  IconSearch,
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
  IconSteeringWheel,
  IconGasStation,
  IconCylinder,
  Icon123,
  IconMailFilled,
  IconPhoneFilled,
  IconMapPinFilled,
  IconShare,
  IconBrandWhatsapp,
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
  Divider,
  NavLink,
  Flex,
  ThemeIcon,
  useMantineTheme,
  MantineProvider,
} from "@mantine/core";
import { CarInfoToggle } from "../CarManage/CarInfoToggle";
import { currencyFormater } from "@/constants/data";
import { userService } from "@/services";
import Link from "next/link";
import { replaceBaseUrl } from "@/helpers";

function CarSideBar({ car, fakeView, getCarDetails }) {
  const theme = useMantineTheme();
  const primaryColor = theme.colorScheme === "dark" ? "#3CDFCD" : "#3CDFCD";

  useEffect(() => {
    const timer = setTimeout(() => {
      getCarDetails();
    }, 2000);

    return () => {
      clearTimeout(timer);
    };
  }, []);

  return (
    <MantineProvider defaultColorScheme="dark">
      <Grid.Col span={{ base: 12, md: 4 }}>
        <Card withBorder mx={{ sm: "sm" }} radius="lg" shadow="sm">
          <Card.Section withBorder inheritPadding py="xl">
            <Group align="top" mb="md" wrap="nowrap">
              <Text
                fw={700}
                fz="lg"
                w="calc(100% - 2rem)"
                color="var(--mantine-color-ocean-blue-filled)"
              >
                {car?.make} {car?.model} {car?.year}
              </Text>
            </Group>
            <Flex justify="space-between" mb="md" align="center" gap={15}>
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
                <Text fw={500} fz="lg">
                  {car?.companyName ? car?.companyName : "Trade Dept"}
                </Text>
              </Group>
              <Group gap={12} wrap="nowrap">
                <ThemeIcon
                  component={Link}
                  href={`https://wa.me/${car?.phoneNumber}`}
                  variant="outline"
                  color={primaryColor}
                  size="lg"
                  target="_blank"
                  radius="xl"
                >
                  <IconBrandWhatsapp style={{ width: "60%", height: "60%" }} />
                </ThemeIcon>
                <ThemeIcon
                  variant="outline"
                  color={primaryColor}
                  radius="xl"
                  size="lg"
                >
                  <IconShare style={{ width: "60%", height: "60%" }} />
                </ThemeIcon>
              </Group>
              {/* <Text>Private</Text> */}
            </Flex>
            {/* <Group mb="md">
              <Group gap="xs">
                <IconEye stroke={1.5} color={primaryColor} />
                <Text fw={500} fz={14}>
                  {fakeView}
                </Text>
              </Group>
            </Group> */}
            {/* <Group justify="space-between" mb="md">
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
                            <Group gap="xs">
                                <IconEye stroke={1.5} />
                                <Text fw={500} c="dimmed" fz={14}>
                                    {fakeView}
                                </Text>
                            </Group>
                        </Group> */}
            <Text fz={16} mb="md">
              Istoricul este oferit gratuit de Trade Dept.
            </Text>
            {car?.pdf && (
              <Group justify="space-between" align="center">
                {/* {userService.userValue?.id ? (
                                    // <a href={car?.pdf} download="document.pdf" target="_blank">
                                    <Button
                                        variant="outline"
                                        color={primaryColor}
                                        component={Link} href={car?.pdf} download="document.pdf" radius="lg"
                                    >
                                        Vezi Istoric Gratuit
                                    </Button>
                                    // </a>
                                ) : (
                                    <Button
                                        variant="outline"
                                        color={primaryColor}
                                        component={Link} href={"/signin"} radius="lg" target="_blank"
                                    >
                                       Vezi Istoric Gratuit
                                    </Button>
                                )} */}
                <a href={car?.pdf} download="document.pdf" target="_blank">
                  <Button radius="lg" c="#000">
                    Istoric Gratuit
                  </Button>
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
            {/* <Group justify="space-between" mt="xl"></Group> */}
          </Card.Section>
          <Card.Section withBorder inheritPadding py="xl">
            <Group mb="md">
              <Button
                component={Link}
                href={`mailto:`}
                variant="filled"
                color={primaryColor}
                size="md"
                radius="xl"
                fullWidth
                leftSection={
                  <ThemeIcon color="#141414" variant="transparent">
                    <IconMailFilled size={22} />
                  </ThemeIcon>
                }
              >
                <Text fw={600} c="#141414">
                  Email
                </Text>
              </Button>
              <Button
                component={Link}
                href={`tel:${car?.phoneNumber}`}
                variant="outline"
                color={primaryColor}
                size="md"
                radius="xl"
                fullWidth
                leftSection={
                  <ThemeIcon color={primaryColor} variant="transparent">
                    <IconPhoneFilled size={22} />
                  </ThemeIcon>
                }
              >
                Telefon
              </Button>
            </Group>
            <Flex gap={12} align="center">
              <ThemeIcon color={primaryColor} variant="transparent">
                <IconMapPinFilled size={30} height={30} />
              </ThemeIcon>
              4th Floor 1 Tony Wilson Place Manchester M15 4FN United Kingdom
            </Flex>
            {/* <Link
                            href={`tel:${car?.phoneNumber}`}
                            position="left"
                            style={{
                                marginBottom: '10px',
                                marginTop: '20px',
                                display: "inline-flex",
                                gap: '10px',
                            }}
                        >
                            <ThemeIcon color={primaryColor} variant="light" >
                                <IconPhoneCall size={30} />
                            </ThemeIcon>
                            <Text c="#3CDFCD">{car?.phoneNumber}</Text>
                        </Link> */}
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
                color={primaryColor}
                my="md"
                href="/delivery"
                target="_blank"
                label="Free Home Delivery"
                leftSection={<IconHomeUp size="1rem" stroke={1.5} />}
                active
              />
              <NavLink
                color={primaryColor}
                my="md"
                href="/return"
                target="_blank"
                label="7 Day Money-Back Guarantee"
                leftSection={<IconCreditCard size="1rem" stroke={1.5} />}
                active
              />
              <NavLink
                color={primaryColor}
                my="md"
                href="/warranty"
                target="_blank"
                label="90 Days Warranty"
                leftSection={<IconThumbUp size="1rem" stroke={1.5} />}
                active
              />
              <NavLink
                color={primaryColor}
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
    </MantineProvider>
  );
}

export default CarSideBar;
