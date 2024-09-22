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
  IconGauge,
  IconHeart,
  IconSearch,
  IconClockHour4,
  IconUser,
  IconEngine,
} from "@tabler/icons-react";
import classes from "@/styles/CarInfoCard.module.css";
import { currencyFormater } from "@/constants/data";
import { replaceBaseUrl } from "@/helpers";
import { useState, useEffect } from "react";
import { userService } from "@/services";
import { BidIcon } from "./BidIcon";
import { IconCalendar } from "@tabler/icons-react";

export function CarInfoCard(props) {
  const {
    images,
    year,
    make,
    model,
    lot,
    bidPrice,
    mileage,
    invoiceSent,
    bidDeadline,
    User,
    myId,
    onClick,
    isListStyle,
    status,
    seats,
    price,
    updatedAt,
    autoBid,
    fuelType,
    engine,
  } = props;
  const imgUrls = images.length > 0 ? JSON.parse(images) : [];
  const demoImage =
    imgUrls.length > 0
      ? imgUrls[0]
      : "https://placehold.co/320x240?text=NoImage";
  const [timeElapsed, setTimeElapsed] = useState(0);
  const [fakeBidder, setFakeBidder] = useState(
    {}
  );

  const convertElapsedDuration = (t) => {
    const min = t % 60;
    const hours = Math.floor(t / 60) % 24;
    const days = Math.floor(t / (60 * 24));

    if (days >= 1) {
      const formattedHours = hours < 10 ? `${hours}` : `${hours}`;
      const formattedMinutes = min < 10 ? `0${min}` : `${min}`;
      return `${days}D ${days > 1 ? "" : ""} & ${formattedHours}H`;
    } else {
      const formattedHours = hours < 10 ? `0${hours}` : `${hours}`;
      const formattedMinutes = min < 10 ? `0${min}` : `${min}`;
      return `${formattedHours}:${formattedMinutes}`;
    }
  };

  useEffect(() => {
    let intervalId;
    if (bidDeadline) {
      const leftMin = Math.ceil(
        (new Date(bidDeadline) - new Date()) / (1000 * 60)
      );
      setTimeElapsed(() => leftMin);
      intervalId = setInterval(() => {
        setTimeElapsed((prevTime) => prevTime - 1);
      }, 1000 * 60);
    } else {
      setTimeElapsed(0); // Reset timeElapsed if bidDeadline is falsy
    }
    return () => clearInterval(intervalId);
  }, [props.bidDeadline]);
  // useEffect(() => {

  //   if (autoBid) {
  //     setFakeBidder()
  //   }
  // }, [autoBid])
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
              <Flex gap="5px" justify="space-between">
                <Stack justify="space-between" gap="3">
                  <Text c="#3CDFCD">Bid End</Text>
                  {status != "ENDED" && status != "PAID" && timeElapsed > 0 ? (
                    <Group gap="5">
                      <IconClockHour4 size="1.2rem" />
                      <Text size="0.9rem" fw={600}>
                        {timeElapsed > 0
                          ? convertElapsedDuration(timeElapsed)
                          : "00:00"}
                      </Text>
                    </Group>
                  ) : status == "NEW" ? (
                    <Center>
                      <IconClockHour4 size="1.2rem" />
                      <Text size="0.9rem" fw={600}>
                        {" "}
                        00:00
                      </Text>
                    </Center>
                  ) : null}
                </Stack>
                <Divider orientation="vertical" />
                <Stack justify="end" gap="3">
                  <Text c="#3CDFCD" align="end">
                    Current Offer
                  </Text>
                  <Group
                    justify="flex-end"
                    align="center"
                    gap="5"
                    wrap="nowrap"
                  >
                    <BidIcon size="1.2rem" />
                    <Text className={classes.title} fw={600}>
                      {fakeBidder?.price &&
                        userService.userValue?.role === "USER"
                        ? `€${currencyFormater(fakeBidder.price)}`
                        : `€${currencyFormater(bidPrice)}`}
                    </Text>
                  </Group>
                </Stack>
              </Flex>
              <Button fullWidth c='#000'>{"View Auction"}</Button>
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
                    {make} {model} {engine} {" "}
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
              <Divider my={15} />
              <Flex px="md" gap="5px" justify="space-between">
                <Stack justify="space-between" gap="3">
                  <Text c="#3CDFCD">Bid End</Text>
                  {status != "ENDED" && status != "PAID" && timeElapsed > 0 ? (
                    <Group gap="5">
                      <IconClockHour4 size="1.2rem" />
                      <Text size="0.9rem" fw={600}>
                        {timeElapsed > 0
                          ? convertElapsedDuration(timeElapsed)
                          : "00:00"}
                      </Text>
                    </Group>
                  ) : status == "NEW" ? (
                    <Center>
                      <IconClockHour4 size="1.2rem" />
                      <Text size="0.9rem" fw={600}>
                        {" "}
                        00:00
                      </Text>
                    </Center>
                  ) : null}
                </Stack>
                <Divider orientation="vertical" />
                <Stack justify="end" gap="3">
                  <Text c="#3CDFCD" align="end">
                    Current Offer
                  </Text>
                  <Group
                    justify="flex-end"
                    align="center"
                    gap="5"
                    wrap="nowrap"
                  >
                    <BidIcon size="1.2rem" />
                    <Text className={classes.title} fw={600}>
                      {fakeBidder?.price &&
                        userService.userValue?.role === "USER"
                        ? `€${currencyFormater(fakeBidder.price)}`
                        : `€${currencyFormater(bidPrice)}`}
                    </Text>
                  </Group>
                </Stack>
              </Flex>
            </Card.Section>
            <Button fullWidth bg="#3CDFCD" c='#000'>
              {"View Auction"}
            </Button>
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
