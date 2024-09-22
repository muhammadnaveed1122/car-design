import classes from "@/styles/AuctionSteps.module.css";
import { useWindowSize } from "@/hooks/useWindowSize";
import { Stepper } from "@mantine/core";
import { useState } from "react";

const steps = [
  {
    label: "User Registration and Login",
    description:
      "Users register accounts and log into participate in car auctions.",
  },
  {
    label: "Auction Bidding",
    description: "Users bid on their desired cars in live auctions.",
  },
  {
    label: "Winning and Payment",
    description: "Winners complete payment for the cars they've won.",
  },
  {
    label: "Delivery and Feedback",
    description:
      "Arrange car delivery, and users leave feedback on the buying experience.",
  },
];

export default function AuctionSteps() {
  const [active, setActive] = useState(2);

  const windowSize = useWindowSize();

  return (
    <>
      {windowSize > 1120 ? (
        <Stepper
          classNames={classes}
          active={active}
          onStepClick={setActive}
          breakpoint="sm"
          px="xl"
          py={120}
        >
          {steps.map((step, i) => (
            <Stepper.Step {...step} loading={active === i} key={`step${i}`} />
          ))}
        </Stepper>
      ) : windowSize > 575 ? (
        <>
        <Stepper
          classNames={classes}
          orientation="vertical"
          active={active}
          onStepClick={setActive}
          breakpoint="sm"
          px="xl"
          py={120}
        >
          {steps.map((step, i) => (
            <Stepper.Step {...step} loading={active === i} key={`step${i}`} />
          ))}
        </Stepper>
        </>
      ) : (
        <>
          <Stepper
            classNames={classes.mobileSteper}
            active={active}
            onStepClick={setActive}
            breakpoint="sm"
            px="xl"
            py={120}
          >
            {steps.map((step, i) => (
              <Stepper.Step {...step} loading={active === i} key={`step${i}`} />
            ))}
          </Stepper>
        </>
      )}
    </>
  );
}
