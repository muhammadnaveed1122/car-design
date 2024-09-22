import { Box, Center, Group, Image, Stepper, rem } from "@mantine/core";
import { useLoadingContext } from "@/providers/LoadingProvider";
import { IconCheck, IconMapPin } from "@tabler/icons-react";
import Congratulations from "@/components/congratulations";
import MetaDecorator from "@/components/Meta/metaDecor";
import { useWindowSize } from "@/hooks/useWindowSize";
import { carService, userService } from "@/services";
import React, { useEffect, useState } from "react";
import isAuth from "@/components/Auth/auth";
import { useRouter } from "next/router";
import Section from "@/layouts/Section";

const PurchaseInProgress = () => {
  const router = useRouter();
  const windowSize = useWindowSize();
  const loadingContext = useLoadingContext();

  const [purchase, setPurchase] = useState(0);
  const [image, setImage] = useState([]);
  const [car, setCar] = useState({});

  const getLatestActivity = async (id) => {
    const data = await carService.getLatestByActivities(id);
    setPurchase(data?.Car?.purchaseSteps);
    const img = data?.Car?.images.length
      ? JSON.parse(data?.Car?.images)
      : ["https://i.imgur.com/ZL52Q2D.png"];
    setImage(img);
    setCar(data?.Car);
  };

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (user) {
      userService.getById(user?.id).then(() => {
        if (
          userService.userValue?.role === "ADMIN" ||
          userService.userValue?.role === "SUBADMIN"
        ) {
          router.push("/admin/users");
        } else if (!userService.userValue?.inPurchase) {
          router.push("/");
        }
      });
    } else {
      router.push("/");
    }
    loadingContext.setIsLoading(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (userService.userValue?.id) {
      getLatestActivity(userService.userValue?.id);
    }

    const intervalId = setInterval(() => {
      if (userService.userValue?.id) {
        getLatestActivity(userService.userValue?.id);
      }
    }, 0.3 * 60 * 1000); // 5 minutes in milliseconds

    return () => clearInterval(intervalId);
  }, [userService?.userValue?.id]);

  return (
    <>
      <MetaDecorator title="Trade Dept | Progress" />
      {
        <>
          {car?.winBox && (
            <Congratulations
              carName={`${car?.make} ${car?.model}`}
              id={car?.id}
              carImage={image[0]}
            />
          )}
          <Section size="xl" py="100">
            <Center>
              {windowSize > 767 ? (
                <>
                  <Group Center className="progress-steppsers">
                    <Box
                      maw={400}
                      mx="auto"
                      style={{ borderRadius: "50px", overflow: "hidden" }}
                    >
                      {userService.userValue?.inPurchase && image[0] && (
                        <Image src={image[0]} />
                      )}
                    </Box>
                    <Stepper
                      className="car-stepper"
                      active={purchase}
                      orientation="vertical"
                      completedIcon={
                        <IconCheck
                          style={{
                            width: rem(30),
                            height: rem(30),
                            fontWeight: "900",
                          }}
                        />
                      }
                    >
                      <Stepper.Step
                        icon={
                          <img
                            src="/assets/invoice-bill.svg"
                            style={{ width: rem(16), height: rem(16) }}
                          />
                        }
                        label="Invoice & Bill of Sale "
                      />
                      <Stepper.Step
                        icon={
                          <img
                            src="/assets/payment-confirmation.png"
                            style={{ width: rem(22), height: rem(22) }}
                          />
                        }
                        label="Payment Confirmation"
                        Center
                      />
                      <Stepper.Step
                        icon={
                          <img
                            src="/assets/shipping-initiated.png"
                            style={{ width: rem(20), height: rem(20) }}
                          />
                        }
                        label="Shipping Initiated"
                      />
                      <Stepper.Step
                        icon={
                          <img
                            src="/assets/vehicle-dispatches.png"
                            style={{ width: rem(18), height: rem(18) }}
                          />
                        }
                        label="Vehicle Dispatched"
                      />
                      <Stepper.Step
                        icon={
                          <IconMapPin
                            style={{ width: rem(18), height: rem(18) }}
                          />
                        }
                        label="Delivered"
                      />
                    </Stepper>
                  </Group>
                </>
              ) : (
                <Group Center className="progress-steppsers" px="sm">
                  <Box
                    maw={400}
                    mx="auto"
                    style={{ borderRadius: "50px", overflow: "hidden" }}
                  >
                    <Image src={image[0]} alt="Tesla Model S" />
                  </Box>
                  <Stepper
                    className="car-stepper"
                    active={purchase}
                    orientation="vertical"
                    completedIcon={
                      <IconCheck
                        style={{
                          width: rem(30),
                          height: rem(30),
                          fontWeight: "900",
                        }}
                      />
                    }
                  >
                    <Stepper.Step
                      icon={
                        <img
                          src="/assets/invoice-bill.svg"
                          style={{ width: rem(16), height: rem(16) }}
                        />
                      }
                      label="Invoice & Bill of Sale "
                    />
                    <Stepper.Step
                      icon={
                        <img
                          src="/assets/payment-confirmation.png"
                          style={{ width: rem(22), height: rem(22) }}
                        />
                      }
                      label="Payment Confirmation"
                      Center
                    />
                    <Stepper.Step
                      icon={
                        <img
                          src="/assets/shipping-initiated.png"
                          style={{ width: rem(20), height: rem(20) }}
                        />
                      }
                      label="Shipping Initiated"
                    />
                    <Stepper.Step
                      icon={
                        <img
                          src="/assets/vehicle-dispatches.png"
                          style={{ width: rem(18), height: rem(18) }}
                        />
                      }
                      label="Vehicle Dispatched"
                    />
                    <Stepper.Step
                      icon={
                        <IconMapPin
                          style={{ width: rem(18), height: rem(18) }}
                        />
                      }
                      label="Delivered"
                    />
                  </Stepper>
                </Group>
              )}
            </Center>
          </Section>
        </>
      }
    </>
  );
};
export default isAuth(PurchaseInProgress);
