import {
  TextInput,
  PasswordInput,
  Stepper,
  rem,
  Group,
  Button,
  Select,
  Checkbox,
  Anchor,
  Stack,
  Box,
  Title,
  Text,
  Grid,
  PinInput,
  ThemeIcon,
  Image,
 
  Flex,
} from "@mantine/core";
import {
  IconUserCheck,
  IconMailForward,
  IconPhoneCheck,
 
} from "@tabler/icons-react";

import { isValidPhoneNumber } from "react-phone-number-input";
import classes from "@/styles/LittleComponent.module.css";
import { packageModes, userRole } from "@/constants/data";
import { termsData } from "@/constants/termsandcondition";
import * as PInput from "react-phone-number-input/input";
import { userService, verifyService } from "@/services";
import { addressToString, toastShow } from "@/helpers";
import { useEffect, useState, useRef } from "react";
import "react-phone-number-input/style.css";
import { useForm } from "@mantine/form";
import { useRouter } from "next/router";

export { GoogleSignUpForm };

function GoogleSignUpForm({ email, fullName }) {
  const router = useRouter();
  const [signing, setSigning] = useState(false);
  const [requireReferal, setRequireReferal] = useState(false);

  const form = useForm({
    initialValues: {
      referal: "",
      email: "",
      phone: "",
      firstName: "",
      lastName: "",
      packageMode: null,
      avatar: null,
    },

    validate: {
      phone: (val) =>
        !isValidPhoneNumber(val)
          ? "Input valid phone number"
          : phoneVerified === val
          ? null
          : "Verify your phone number",
      packageMode: (val) => (val === null ? "Select Package mode" : null),
      referal: (val) =>
        requireReferal && val === "" ? "Input Referral Code" : null,
    },
  });

  useEffect(() => {
    if (!!email) form.setFieldValue("email", email);
    if (!!fullName) {
      const names = (fullName || " ").split(" ");
      form.setFieldValue("firstName", names[0]);
      form.setFieldValue("lastName", names[1]);
    }
  }, [email, fullName]);

  const handleFormSubmit = (signUpData) => {
    const formData = new FormData();
    for (const key in signUpData) {
      if (key == "packageMode")
        formData.append(key, packageModes[signUpData[key]]);
      else if (key == "referal") {
        if (signUpData[key] != "") formData.append(key, signUpData[key]);
      }
    }
    setSigning(true);
    return userService
      .googleLogin(signUpData)
      .then(() => {
        toastShow("Registered successfuly!");
        const { userValue } = userService;
        if (
          userValue?.role === userRole[1] ||
          userValue?.role === userRole[2]
        ) {
          router.push("/admin/users");
        } else {
          router.push("/marketplace");
        }
      })
      .catch((error) => {
        toastShow(error, "error");
        setSigning(false);
      });
  };

  const stepFields = [
    ["firstName", "lastName", "packageMode", "referal"],
    ["phone"],
  ];
  const [active, setActive] = useState(0);
  const setActiveStep = (targetStep) => {
    let isValid = true;
    if (targetStep > active) {
      for (let i = active; i < targetStep; i++) {
        stepFields[i].forEach((field) => {
          const validation = form.validateField(field);
          if (validation.hasError === true) {
            isValid = false;
          }
        });
      }
    }

    if (!isValid) return; // Prevent moving to the next step if validation fails
    setActive(targetStep);
    if (targetStep === 4)
      stepRef.current.scrollIntoView({ behavior: "smooth" });
  };

  const nextStep = () => setActiveStep(active < 2 ? active + 1 : active);
  const prevStep = () => setActiveStep(active > 0 ? active - 1 : active);

  const [code2, setCode2] = useState("");
  const [sending, setSending] = useState(false);
  const [checking, setChecking] = useState(false);
  const [phoneVerified, setPhoneVerified] = useState(null);

  const sendCode = async (verifyType) => {
    setSending(true);
    try {
      if (verifyType === "email") {
        await verifyService.sendToEmail({ emailTo: form.values.email });
        setTimeout(() => {
          toastShow("4-Digit Code Sent to Email");
          setSending(false);
        }, 1000);
      } else if (verifyType === "phone") {
        await verifyService.sendToPhone({ phoneNum: form.values.phone });
        setTimeout(() => {
          toastShow("4-Digit Code Sent to Phone");
          setSending(false);
        }, 1000);
      }
    } catch (err) {
      toastShow(err, "error");
      setSending(false);
    }
  };

  const checkCode = (verifyType) => {
    setChecking(true);
    if (verifyType === "phone") {
      verifyService
        .verifyPhone({
          phoneNum: form.values.phone,
          code: code2,
        })
        .then((res) => {
          setTimeout(() => {
            setChecking(false);
            if (res === true) {
              setPhoneVerified(form.values.phone);
              toastShow("Phone Verified!");
            } else {
              toastShow("Phone Verification Code Incorrect!", "error");
            }
          }, 1000);
        });
    }
  };

  useEffect(() => {
    if (phoneVerified !== form.values.phone && code2.length === 4)
      checkCode("phone");
  }, [code2]);

  const stepRef = useRef(null);

  useEffect(() => {
    const reff = localStorage.getItem("referral");
    form.setFieldValue("referal", reff);
    const user = JSON.parse(localStorage.getItem("user"));
    if (user) {
      userService.getById(user?.id).then(() => {
        if (
          userService.userValue?.role === "ADMIN" ||
          userService.userValue?.role === "SUBADMIN"
        ) {
          router.push("/admin/users");
        } else {
          router.push("/marketplace");
        }
      });
    }
    //   else {
    //     router.push("/signup");
    //   }
  }, []);

  return (
    <Grid align="stretch">
      <Grid.Col span={12}>
        <form
          className="signupForm"
          onSubmit={(e) => {
            if (active < 1) {
              e.preventDefault();
              nextStep();
            } else {
              form.onSubmit(handleFormSubmit)(e);
            }
          }}
        >
          <Stepper active={active} onStepClick={setActiveStep} ref={stepRef}>
            <Stepper.Step
              icon={
                <IconUserCheck
                  style={{ width: rem(18), height: rem(18), color: "#5E6471" }}
                />
              }
            >
              <Grid>
                <Grid.Col
                  order={{ base: 2, md: 1 }}
                  span={{ base: 12, md: 5 }}
                  pt={{ base: "50px", md: "120px" }}
                  px={{ base: "30px", sm: "50px" }}
                  pb={{ base: "50px", md: "80px" }}
                  bg="linear-gradient(180deg, #3CDFCD 0%, #272B3D 100%, #D6D6D6 100%)"
                >
                  <Box maw={{ base: "400px", md: "100%" }} m="0 auto">
                    <Image src="/assets/create-account.png" alt="image" />
                  </Box>
                </Grid.Col>
                <Grid.Col
                  order={{ base: 1, md: 2 }}
                  span={{ base: 12, md: 7 }}
                  pt={{ base: "0", md: "120" }}
                  pb={{ base: "50", md: "80" }}
                  px={{ base: "20", sm: "50", md: "80" }}
                >
                  <Stack>
                    <Title mb={{ base: "5", md: "15" }}>
                      Create Your Account
                    </Title>
                    <Grid>
                      <Grid.Col span={6}>
                        <TextInput
                          required
                          label="First Name"
                          placeholder="Your first name"
                          value={form.values.firstName}
                          onChange={(event) =>
                            form.setFieldValue(
                              "firstName",
                              event.currentTarget.value
                            )
                          }
                          error={form.errors.firstName}
                          {...form.getInputProps("firstName")}
                          radius="md"
                        />
                      </Grid.Col>
                      <Grid.Col span={6}>
                        <TextInput
                          required
                          label="Last Name"
                          placeholder="Your last name"
                          value={form.values.lastName}
                          onChange={(event) =>
                            form.setFieldValue(
                              "lastName",
                              event.currentTarget.value
                            )
                          }
                          {...form.getInputProps("lastName")}
                          error={form.errors.lastName}
                          radius="md"
                        />
                      </Grid.Col>
                    </Grid>

                    <Select
                      mt="lg"
                      radius="lg"
                      placeholder="Select Package"
                      allowDeselect={false}
                      value={form.values.packageMode}
                      onChange={(value) => {
                        form.setFieldValue("packageMode", value);
                        setRequireReferal(value?.includes("TRIAL"));
                      }}
                      data={Object.keys(packageModes)}
                      error={form.errors.packageMode}
                    />

                    {requireReferal && (
                      <TextInput
                        required
                        label="Referral Code"
                        placeholder="Your referral code"
                        value={form.values.referal}
                        onChange={(event) =>
                          form.setFieldValue(
                            "referal",
                            event.currentTarget.value
                          )
                        }
                        error={form.errors.referal}
                        radius="md"
                      />
                    )}
                  </Stack>
                  <Box justify="space-between" mt="xl" align="middle">
                    <Anchor
                      component="button"
                      type="button"
                      c="dimmed"
                      onClick={() => {
                        router.push("/signin");
                      }}
                      size="xs"
                    >
                      Already have an account? Login
                    </Anchor>

                    <Group justify="center" mt="md">
                      {active < 6 ? (
                        <Button
                          variant="default"
                          onClick={prevStep}
                          radius="xl"
                          disabled={active == 0}
                          key={"prevStep"}
                          bg="#E4E4E4"
                          c="#34464A"
                        >
                          Back
                        </Button>
                      ) : (
                        <Button
                          variant="default"
                          onClick={() => {
                            router.push("/signin");
                          }}
                          radius="xl"
                          key={"toLogin"}
                        >
                          Go to Login
                        </Button>
                      )}
                      <Button
                        type="submit"
                        loading={signing}
                        radius="xl"
                        disabled={active > 2}
                      >
                        {active < 2 ? "Next step" : "Sign Up"}
                      </Button>
                    </Group>
                  </Box>
                </Grid.Col>
              </Grid>
            </Stepper.Step>

            <Stepper.Step
              icon={
                <IconPhoneCheck
                  style={{ width: rem(18), height: rem(18), color: "#5E6471" }}
                />
              }
            >
              <Grid>
                <Grid.Col
                  order={{ base: 2, md: 1 }}
                  span={{ base: 12, md: 5 }}
                  pt={{ base: "50px", md: "120px" }}
                  px={{ base: "30px", sm: "50px" }}
                  pb={{ base: "50px", md: "80px" }}
                  bg="linear-gradient(180deg, #3CDFCD 0%, #272B3D 100%, #D6D6D6 100%)"
                >
                  <Box maw={{ base: "400px", md: "100%" }} m="0 auto">
                    <Image src="/assets/verify-number.png" alt="image" />
                  </Box>
                </Grid.Col>
                <Grid.Col
                  order={{ base: 1, md: 2 }}
                  span={{ base: 12, md: 7 }}
                  pt={{ base: "0", md: "120" }}
                  pb={{ base: "50", md: "80" }}
                  px={{ base: "20", sm: "50", md: "80" }}
                >
                  <Stack>
                    <Text align="center">
                      <IconPhoneCheck
                        size={80}
                        stroke={1.2}
                        color="var(--mantine-color-ocean-blue-filled)"
                      />
                    </Text>
                    <Text fw={900} fz={{ base: "22", md: "30" }} align="center">
                      Verify your Phone Number
                    </Text>
                    <Text c="dimmed">
                      To enhance the security of the Trade Dept community,
                      we require phone number verification.
                    </Text>
                    <Group>
                      <Box
                        w="100%"
                        className={
                          !!form.errors.phone &&
                          phoneVerified !== form.values.phone
                            ? "phoneError"
                            : ""
                        }
                      >
                        <div className="PhoneInputInput PhoneInput">
                          +1{" "}
                          <PInput.default
                            country="US"
                            className="PhoneInputInput"
                            placeholder="Enter phone number"
                            value={form.values.phone}
                            onChange={(value) => {
                              console.log(form.values.phone);
                              if (typeof value === "string")
                                form.setFieldValue("phone", value);
                            }}
                          />
                        </div>
                        <ThemeIcon
                          variant="light"
                          color={
                            !isValidPhoneNumber(form.values.phone)
                              ? "gray"
                              : phoneVerified === form.values.phone
                              ? "green"
                              : "red"
                          }
                          title="Verify Phone"
                          style={{ left: "calc(100% - 32px)", top: -32 }}
                        >
                          <IconPhoneCheck size={18} stroke={2.5} />
                        </ThemeIcon>
                        <Text c="red" fz={12} style={{ marginTop: -28 }}>
                          {form.errors.phone}
                        </Text>
                      </Box>
                    </Group>
                    <Text c="dimmed">
                      Please enter the 4-digit code sent to your mobile device:
                    </Text>
                    <Grid>
                      <Grid.Col span={{ sm: "12" }}>
                        <Text
                          fz={{ base: "14" }}
                          fw={600}
                          lh={2}
                          align={{ sm: "center" }}
                        >
                          Phone 4-Digit Code
                        </Text>
                      </Grid.Col>
                      <Flex gap="15" px="8">
                        <PinInput
                          type={/^[0-9]+/}
                          disabled={phoneVerified === form.values.phone}
                          value={code2}
                          onChange={(value) => setCode2(value)}
                          inputMode="numeric"
                        />
                        <Button
                          fullWidth
                          disabled={
                            phoneVerified === form.values.phone ||
                            !isValidPhoneNumber(form.values.phone)
                          }
                          loading={sending || checking}
                          onClick={() => sendCode("phone")}
                          leftSection={<IconMailForward />}
                          p={{ base: "0 4px", sm: "0 12px" }}
                          c='#000'
                        >
                          Send Code
                        </Button>
                      </Flex>
                    </Grid>
                  </Stack>
                  <Box justify="space-between" mt="xl" align="middle">
                    <Anchor
                      component="button"
                      type="button"
                      c="dimmed"
                      onClick={() => {
                        router.push("/signin");
                      }}
                      size="xs"
                    >
                      Already have an account? Login
                    </Anchor>
                    <Group justify="center" mt="md">
                      {active < 6 ? (
                        <Button
                          variant="default"
                          onClick={prevStep}
                          radius="xl"
                          disabled={active == 0}
                          key={"prevStep"}
                          bg="#E4E4E4"
                          c="#34464A"
                        >
                          Back
                        </Button>
                      ) : (
                        <Button
                          variant="default"
                          onClick={() => {
                            router.push("/signin");
                          }}
                          radius="xl"
                          key={"toLogin"}
                        >
                          Go to Login
                        </Button>
                      )}
                      <Button
                        type="submit"
                        loading={signing}
                        radius="xl"
                        disabled={active > 1}
                      >
                        {active < 1 ? "Next step" : "Sign Up"}
                      </Button>
                    </Group>
                  </Box>
                </Grid.Col>
              </Grid>
            </Stepper.Step>

            {/* <Stepper.Completed>
                <Grid>
                  <Grid.Col
                    order={{ base: 2, md: 1 }}
                    span={{ base: 12, md: 5 }}
                    pt={{ base: "50px", md: "120px" }}
                    px={{ base: "30px", sm: "50px" }}
                    pb={{ base: "50px", md: "80px" }}
                    bg="linear-gradient(180deg, #3CDFCD 0%, #272B3D 100%, #D6D6D6 100%)"
                  >
                    <Box maw={{ base: "400px", md: "100%" }} m="0 auto">
                      <Image src="/assets/terms-condition.png" alt="image" />
                    </Box>
                  </Grid.Col>
                  <Grid.Col
                    order={{ base: 1, md: 2 }}
                    span={{ base: 12, md: 7 }}
                    pt={{ base: "0", md: "150" }}
                    pb={{ base: "50", md: "80" }}
                    px={{ base: "20", sm: "50", md: "80" }}
                  >
                    <Stack>
                      <Title align="center">COMPLETED,</Title>
                      <Text fz={30} align="center">
                        Please wait for approval.
                      </Text>
                    </Stack>
                  </Grid.Col>
                </Grid>
              </Stepper.Completed> */}
          </Stepper>
        </form>
      </Grid.Col>
    </Grid>
  );
}
