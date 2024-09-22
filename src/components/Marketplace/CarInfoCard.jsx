import {
  Card,
  Image,
  Text,
  Group,
  Stack,
  Center,
  Button,
  Badge,
  Divider,
  Flex,
  Box,
} from "@mantine/core";
import {
  IconCalendar,
  IconEngine,
  IconGauge,
  IconHeart,
  IconSearch,
  IconUser,
} from "@tabler/icons-react";
import classes from "@/styles/CarInfoCard.module.css";
import { currencyFormater } from "@/constants/data";
import { replaceBaseUrl } from "@/helpers";
import { userService } from "@/services";

export function CarInfoCard(props) {
  const {
    exteriorImages,
    interiorImages,
    year,
    make,
    model,
    lot,
    mileage,
    invoiceSent,
    User,
    myId,
    onClick,
    isListStyle,
    status,
    seats,
    fuelType,
    engine,
    price,
  } = props;
  const imgUrls = JSON.parse(exteriorImages);
  const demoImage =
    imgUrls.length > 0
      ? imgUrls[0]
      : "https://placehold.co/320x240?text=NoImage";

  return (
    <Card
      withBorder
      radius="lg"
      className={classes.card}
      onClick={onClick}
      p={isListStyle === true ? 0 : "16px"}
      maw={isListStyle ? 800 : 420}
      mx="auto"
      style={{ height: "100%" }}
    >
      {isListStyle === true ? (
        <>
          <Group wrap="nowrap" gap={20} justify="space-between">
            <Image src={demoImage} alt="Car" height="220px" mah="220px" />
            <Stack p="md" gap="md" w="100%">
              <Group justify="space-between" align="top">
                <div style={{ width: "calc(100% - 40px)" }}>
                  <Text className={classes.title} mr="sm">
                    {" "}
                    {make} {model} {engine}
                  </Text>
                </div>
                <IconHeart stroke={1.5} color="#3CDFCD" />
              </Group>
              <Flex justify="space-between" align="center">
                <Group grow>
                  <Group
                    justify="flex-end"
                    align="center"
                    gap="10"
                    wrap="nowrap"
                    className={classes.currentPrice}
                  >
                    <Text className={classes.title} px="10" py="3" fw={500}>
                      {price ? `€${currencyFormater(price)}` : "No price yet"}
                    </Text>
                  </Group>
                </Group>
                {/* <Text fw={500}>Lot # {lot}</Text> */}
              </Flex>
              <Group justify="space-between" gap={10} align="middle">
                <Group
                  wrap="nowrap"
                  gap={5}
                  p={5}
                  className={classes.iconWrapper}
                >
                  <IconUser size="1.2rem" stroke={1.5} color="#3CDFCD" />
                  <Divider orientation="vertical" />
                  <Text size="0.9rem" c="ocean-blue">
                    {seats} passengers
                  </Text>
                </Group>
                <Group
                  wrap="nowrap"
                  gap={5}
                  p={5}
                  className={classes.iconWrapper}
                >
                  <IconGauge size="1.2rem" stroke={1.5} color="#3CDFCD" />
                  <Divider orientation="vertical" />
                  <Text size="0.9rem" c="ocean-blue">
                    {currencyFormater(mileage)} KM
                  </Text>
                </Group>
              </Group>
            </Stack>
          </Group>
        </>
      ) : (
        <>
          <Card.Section
            className={classes.imageSection}
            style={{ position: "relative" }}
          >
            <Image
              src={replaceBaseUrl(demoImage)}
              alt="Car"
              width="100%"
              height="220px"
              mah="220px"
            />
            <Badge
              style={{
                position: "absolute",
                top: "15px",
                right: "15px",
                width: "70px",
                color: '#000',
              }}
              leftSection={<div className="blob-icon"></div>}
            >
              {status}
            </Badge>
          </Card.Section>
          <Stack gap={0} h="100%" justify="space-between" pt="sm">
            <Card.Section className={classes.section} px={0}>
              <Group justify="space-between" align="top" px="md" gap="sm">
                <Box style={{ width: "calc(100% - 40px)" }}>
                  <Text className={classes.title} lineClamp={2}>
                    {" "}
                    {make} {model} {engine}{" "}
                  </Text>
                </Box>
                <IconHeart stroke={1.5} color="#3CDFCD" />
              </Group>
              <Flex
                justify="space-between"
                px="md"
                align="center"
                mt="sm"
                gap={5}
              >
                <Group grow>
                  <Group
                    justify="flex-end"
                    align="center"
                    gap="10"
                    wrap="nowrap"
                    className={classes.currentPrice}
                  >
                    <Text className={classes.title} px="10" py="3" fw={500}>
                      {price ? `€${currencyFormater(price)}` : "No price yet"}
                    </Text>
                  </Group>
                </Group>
                {/* <Text fw={500} lh={1.2} align="end">
                  Lot # {lot}
                </Text> */}
              </Flex>
              <Group
                justify="space-between"
                mt="md"
                gap={10}
                align="middle"
                px="md"
              >
                <Group
                  wrap="nowrap"
                  gap={5}
                  p={5}
                  className={classes.iconWrapper}
                >
                  <IconUser size="1.2rem" stroke={1.5} color="#3CDFCD" />
                  <Divider orientation="vertical" />
                  <Text size="0.9rem">{seats} passengers</Text>
                </Group>
                <Group
                  wrap="nowrap"
                  gap={5}
                  p={5}
                  className={classes.iconWrapper}
                >
                  <IconGauge size="1.2rem" stroke={1.5} color="#3CDFCD" />
                  <Divider orientation="vertical" />
                  <Text size="0.9rem">{currencyFormater(mileage)} KM</Text>
                </Group>
              </Group>
              <Group
                justify="space-between"
                mt="md"
                gap={10}
                align="middle"
                px="md"
              >
                <Group
                  wrap="nowrap"
                  gap={5}
                  p={5}
                  className={classes.iconWrapper}
                >
                  <IconCalendar size="1.2rem" stroke={1.5} color="#3CDFCD" />
                  <Divider orientation="vertical" />
                  <Text size="0.9rem">{year} Year</Text>
                </Group>
                <Group
                  wrap="nowrap"
                  gap={5}
                  p={5}
                  className={classes.iconWrapper}
                >
                  <IconEngine size="1.2rem" stroke={1.5} color="#3CDFCD" />
                  <Divider orientation="vertical" />
                  <Text size="0.9rem">{fuelType}</Text>
                </Group>
              </Group>
            </Card.Section>
          </Stack>
        </>
      )}
      <div className={classes.overlay}>
        <Center h="100%">
          {status === "LIVE" && !!myId ? (
            <Image
              src="/assets/bid.svg"
              style={{ opacity: 0.7 }}
              alt="bid icon"
            />
          ) : (
            <IconSearch size="4.2rem" stroke={2.5} color="#afb8c0" />
          )}
        </Center>
      </div>
      {User?.id === myId &&
        status === "ENDED" &&
        userService.userValue?.role != "ADMIN" && (
          <div className={invoiceSent ? classes.redCap : classes.blueCap}>
            <div>
              <Text fw={500} size="xl" lh={1} mr={3} align="center">
                {invoiceSent
                  ? `Invoice sent on ${new Date(invoiceSent).toDateString()}`
                  : "Invoice is not arrived yet!"}
              </Text>
              <Text fw={500} size="xl" lh={2} mr={3} align="center">
                {invoiceSent && "Pay for this car!"}
              </Text>
            </div>
          </div>
        )}
      {User?.id === myId && status === "PAID" && (
        <div className={classes.bidder}>
          <div>
            <Text fw={500} size="xl" lh={2} mr={3} align="center">
              You paid for this car.
            </Text>
          </div>
        </div>
      )}
    </Card>
  );
}
