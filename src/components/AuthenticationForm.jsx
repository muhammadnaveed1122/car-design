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
  Divider,
  ThemeIcon,
  Image,
  useCombobox,
  Combobox,
  ScrollArea,
  Flex,
} from "@mantine/core";
import {
  IconUserCheck,
  IconMailOpened,
  IconMailForward,
  IconMailCheck,
  IconPhoneCheck,
  IconMapPinCheck,
  IconAlertSquare,
} from "@tabler/icons-react";
import { signInWithGooglePopup } from "@/services/firebase.service";
import { signIn, signOut, useSession } from "next-auth/react";
import { useLoadingContext } from "@/providers/LoadingProvider";
import { isValidPhoneNumber } from "react-phone-number-input";
import classes from "@/styles/LittleComponent.module.css";
import { packageModes, userRole } from "@/constants/data";
import { termsData } from "@/constants/termsandcondition";
import * as PInput from "react-phone-number-input/input";
import { userService, verifyService } from "@/services";
import { addressToString, toastShow } from "@/helpers";
import { useEffect, useState, useRef } from "react";
import { TwitterButton } from "./TwitterButton";
import { FaceBookButton, GoogleButton } from "./GoogleButton";
import "react-phone-number-input/style.css";
import { useForm } from "@mantine/form";
import { useRouter } from "next/router";
// import Cookies from 'js-cookie';

export { LoginForm, SignUpForm, ProfileForm, AddressForm, ResetForm };

const emailValidation = (val) =>
  val.length === 0
    ? "Input Email Address"
    : /^\S+@\S+\.\S+$/.test(val)
      ? null
      : "Invalid email";

function LoginForm() {
  const { data: session } = useSession();
  const router = useRouter();
  const loadingContext = useLoadingContext();
  const form = useForm({
    initialValues: {
      email: "",
      password: "",
    },
    validate: {
      email: (val) => (/^\S+@\S+\.\S+$/.test(val) ? null : "Invalid email"),
      password: (val) =>
        val.length < 6 ? "Password should include at least 6 characters" : null,
    },
  });
  const handleFormSubmit = async (values) => {
    const { email, password } = values;
    loadingContext.setIsLoading(true);
    try {
      await userService.login(email, password);
      toastShow("Logged In successfully!");
      const { userValue } = userService;
      if (userValue?.role === userRole[1] || userValue?.role === userRole[2]) {
        router.push("/admin/users");
      } else {
        router.push("/marketplace");
      }
    } catch (error) {
      toastShow(error, "error");
    } finally {
      loadingContext.setIsLoading(false);
    }
  };

  useEffect(() => {
    if (session) {
      router
        .push(
          `/googleSignUp?email=${session.user.email}&fullName=${session.user.name}`
        )
        .then(() => {
          signOut({ redirect: false }).then(() => {
            console.log("User signed out");
          });
        });
    }
  }, [session?.user]);

  const signInWithGoogle = async () => {
    const { user } = await signInWithGooglePopup();
    try {
      loadingContext.setIsLoading(true);

      await userService.login(user?.email, null);

      toastShow("Logged In successfully!");

      const { userValue } = userService;
      if (userValue?.role === userRole[1] || userValue?.role === userRole[2]) {
        router.push("/admin/users");
      } else {
        router.push("/marketplace");
      }
    } catch (error) {
      loadingContext.setIsLoading(false);

      if (!error?.startsWith("You are")) {
        toastShow("Your Account is not registered yet!", "error");
        router.push(`/signup?email=${user.email}&fullName=${user.displayName}`);
      }
    }
  };

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (user) {
      userService.getById(user?.id).then(() => {
        const { userValue } = userService;
        if (
          userValue?.role === userRole[1] ||
          userValue?.role === userRole[2]
        ) {
          router.push("/admin/users");
        } else {
          router.push("/marketplace");
        }
      });
    }
  }, []);

  return (
    <div className={classes.formContainer}>
      <Text size="lg" fw={500} align="center" mb="lg">
        Log into Trade Dept!
      </Text>
      <Group grow mb="md" mt="md">
        <GoogleButton
          radius="xl"
          className={classes.socialButton}
          onClick={() => signIn("google")}
        >
          Google
        </GoogleButton>
        <FaceBookButton
          radius="xl"
          className={classes.socialButton}
          onClick={() => signIn("facebook")}
        >
          Facebook
        </FaceBookButton>
      </Group>

      <Divider label="Or continue with email" labelPosition="center" my="lg" />

      <form onSubmit={form.onSubmit(handleFormSubmit)}>
        <Stack>
          <TextInput
            required
            label="Email"
            placeholder="user@example.com"
            value={form.values.email}
            onChange={(event) =>
              form.setFieldValue("email", event.currentTarget.value)
            }
            error={form.errors.email}
            radius="md"
          />

          <PasswordInput
            required
            label="Password"
            placeholder="Your password"
            value={form.values.password}
            onChange={(event) =>
              form.setFieldValue("password", event.currentTarget.value)
            }
            error={form.errors.password}
            radius="md"
          />
        </Stack>

        <Group justify="space-between" mt="xl">
          <Anchor
            component="button"
            type="button"
            c="dimmed"
            onClick={() => {
              router.push("/reset");
            }}
            size="md"
            fw={600}
          >
            Forget Password?
          </Anchor>
          <Group justify="center">
            <Button type="submit" radius="xl" c={'#000'}>
              Sign in
            </Button>
            <Button
              radius="xl"
              variant="outline"
              color="#1acab7" c="#fff"
              onClick={() => {
                router.push("/signup");
              }}
            >
              Sign up
            </Button>
          </Group>
        </Group>
      </form>
    </div>
  );
}

function SignUpForm({ referalCode, email, fullName }) {
  const router = useRouter();
  const [signing, setSigning] = useState(false);
  const [requireReferal, setRequireReferal] = useState(false);
  const [allowTerm, setAllowTerm] = useState(false);

  const form = useForm({
    initialValues: {
      referal: "",
      email: "",
      phone: "",
      password: "",
      confirmPassword: "",
      firstName: "",
      lastName: "",
      address: {
        streetLine: "",
        city: "",
        state: "",
        zipcode: "",
      },
      packageMode: null,
      avatar: null,
      terms: false,
    },

    validate: {
      email: (val) =>
        emailValidation(val) ||
        (emailVerified === val ? null : "Verify your email address"),
      phone: (val) =>
        !isValidPhoneNumber(val)
          ? "Input valid phone number"
          : phoneVerified === val
            ? null
            : "Verify your phone number",
      password: (val) =>
        val.length < 6 ? "Password should include at least 6 characters" : null,
      confirmPassword: (value, values) =>
        value !== values.password ? "Passwords did not match" : null,
      firstName: (val) => {
        if (val.trim().length === 0) {
          return `Please input your first name ${val.startsWith(" ") ? "without space" : ""
            }`;
        } else if (val.trim().length < 2 || val.trim().length > 50) {
          return "First name should be between 2 and 50 characters";
        }
        return null;
      },
      lastName: (val) => {
        if (val.trim().length === 0) {
          return `Please input your last name ${val.startsWith(" ") ? "without space" : ""
            }`;
        } else if (val.trim().length < 2 || val.trim().length > 50) {
          return "Last name should be between 2 and 50 characters";
        }
        return null;
      },
      address: (val) =>
        !val.zipcode || val.zipcode.length === 0
          ? "Zip code is required"
          : null,
      packageMode: (val) => (val === null ? "Select Package mode" : null),
      referal: (val) =>
        requireReferal && val === "" ? "Input Referral Code" : null,
      terms: (val) => (val === false ? "Check for terms and conditions" : null),
    },
  });

  useEffect(() => {
    if (!!referalCode) form.setFieldValue("referal", referalCode);
    if (!!email) form.setFieldValue("email", email);
    if (!!fullName) {
      const names = (fullName || " ").split(" ");
      form.setFieldValue("firstName", names[0]);
      form.setFieldValue("lastName", names[1]);
    }
  }, [email, fullName, referalCode]);

  const handleFormSubmit = (signUpData) => {
    const formData = new FormData();
    for (const key in signUpData) {
      if (key == "address") {
        const address = signUpData[key];
        formData.append("zipCode", address.zipcode);
        formData.append("address", JSON.stringify(address));
      } else if (key == "packageMode")
        formData.append(key, packageModes[signUpData[key]]);
      else if (key == "referal") {
        if (signUpData[key] != "") formData.append(key, signUpData[key]);
      } else if (key != "confirmPassword" && signUpData[key] != null)
        formData.append(key, signUpData[key]);
    }
    setSigning(true);
    return userService
      .register(formData)
      .then(() => {
        toastShow("Registered successfuly!");
        setSigning(false);
        localStorage.removeItem("referral");
        nextStep();
      })
      .catch((error) => {
        toastShow(error, "error");
        setSigning(false);
      });
  };

  const stepFields = [
    [
      "firstName",
      "lastName",
      "password",
      "confirmPassword",
      "packageMode",
      "referal",
    ],
    ["email"],
    ["phone"],
    ["address"],
    ["terms"],
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
    if (targetStep === 6)
      stepRef.current.scrollIntoView({ behavior: "smooth" });
  };

  const nextStep = () => setActiveStep(active < 5 ? active + 1 : active);
  const prevStep = () => setActiveStep(active > 0 ? active - 1 : active);

  const [code1, setCode1] = useState("");
  const [code2, setCode2] = useState("");
  const [sending, setSending] = useState(false);
  const [checking, setChecking] = useState(false);
  const [emailVerified, setEmailVerified] = useState(null);
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
    if (verifyType === "email") {
      verifyService
        .verifyEmail({
          emailTo: form.values.email,
          code: code1,
        })
        .then((res) => {
          setTimeout(() => {
            setChecking(false);

            if (res === true) {
              setEmailVerified(form.values.email);
              toastShow("Email Verified!");
              setActive(2);
            } else {
              toastShow("Email Verification Code Incorrect!", "error");
            }
          }, 1000);
        });
    } else if (verifyType === "phone") {
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
              setActive(3);
            } else {
              toastShow("Phone Verification Code Incorrect!", "error");
            }
          }, 1000);
        });
    }
  };

  useEffect(() => {
    if (emailVerified !== form.values.email && code1.length === 4)
      checkCode("email");
  }, [code1]);

  useEffect(() => {
    if (phoneVerified !== form.values.phone && code2.length === 4)
      checkCode("phone");
  }, [code2]);

  const stepRef = useRef(null);
  const termsRef = useRef(null);
  const combobox = useCombobox();
  const [entryAddr, setEntryAddr] = useState("");
  const [addrList, setAddrList] = useState([]);

  const options = addrList.map((item, i) => (
    <Combobox.Option value={item} key={`addr${i}`}>
      {item.streetLine}, {item.city}, {item.state}, {item.zipcode}
    </Combobox.Option>
  ));

  const autoCompleteAddress = (lookup) => {
    verifyService.findAddress({ lookup }).then((res) => {
      setAddrList(res.result);
      if (res.result.length > 0) combobox.openDropdown();
      else combobox.closeDropdown();
    });
  };

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
    } else {
      router.push("/signup");
    }
  }, []);

  return (
    <Grid align="stretch">
      <Grid.Col span={12}>
        <form
          className="signupForm"
          onSubmit={(e) => {
            if (active < 4) {
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
                    <PasswordInput
                      label="Password"
                      placeholder="Your password"
                      value={form.values.password}
                      onChange={(event) =>
                        form.setFieldValue(
                          "password",
                          event.currentTarget.value
                        )
                      }
                      error={form.errors.password}
                      radius="md"
                      required
                    />
                    <PasswordInput
                      label="Confirm Password"
                      placeholder="Confirm password"
                      value={form.values.confirmPassword}
                      onChange={(event) =>
                        form.setFieldValue(
                          "confirmPassword",
                          event.currentTarget.value
                        )
                      }
                      error={form.errors.confirmPassword}
                      radius="md"
                      required
                    />
                    <Select
                      mt="lg"
                      radius="md"
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
                        disabled={active > 4}
                        c='#000'
                      >
                        {active < 4 ? "Next step" : "Sign Up"}
                      </Button>
                    </Group>
                  </Box>
                </Grid.Col>
              </Grid>
            </Stepper.Step>
            <Stepper.Step
              icon={
                <IconMailOpened
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
                    <Image src="/assets/send-mail.png" alt="image" />
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
                      <IconMailCheck
                        size={80}
                        stroke={1.2}
                        color="var(--mantine-color-ocean-blue-filled)"
                      />
                    </Text>
                    <Text fw={900} fz={{ base: "22", md: "30" }} align="center">
                      Verify your Email
                    </Text>
                    <Text c="dimmed">
                      To enhance the security of the Trade Dept community, we
                      require email address verification.
                    </Text>
                    <TextInput
                      label="Email"
                      placeholder="Your Email"
                      value={form.values.email}
                      onChange={(event) =>
                        form.setFieldValue("email", event.currentTarget.value)
                      }
                      error={
                        emailVerified === form.values.email
                          ? null
                          : form.errors.email
                      }
                      radius="md"
                      rightSection={
                        <ThemeIcon
                          variant="light"
                          color={
                            !!emailValidation(form.values.email)
                              ? "gray"
                              : emailVerified === form.values.email
                                ? "green"
                                : "red"
                          }
                          title="Verify Email"
                        >
                          <IconMailCheck size={18} stroke={2.5} />
                        </ThemeIcon>
                      }
                    />
                    <Text c="dimmed">
                      Please check your inbox/spam for an email and enter the
                      4-digit code sent to it
                    </Text>
                    <Grid>
                      <Grid.Col>
                        <Text
                          fz={{ base: "14" }}
                          fw={600}
                          lh={2}
                          align={{ sm: "center" }}
                        >
                          Email 4-Digit Code
                        </Text>
                      </Grid.Col>
                      {/* <Grid.Col span={{ base: '12', sm: '5' }}>
                        <PinInput
                          type={/^[0-9]+/}
                          disabled={emailVerified === form.values.email}
                          value={code1}
                          onChange={(value) => setCode1(value)}
                          inputMode="numeric"
                        />
                      </Grid.Col>
                      <Grid.Col span={{ base: '12', sm: '4' }}>
                        <Button
                          fullWidth
                          disabled={
                            emailVerified === form.values.email ||
                            !!emailValidation(form.values.email)
                          }
                          loading={sending || checking}
                          onClick={() => sendCode("email")}
                          leftSection={<IconMailForward />}
                          p={{ base: '0 4px', sm: '0 12px' }}
                        >
                          Send Code
                        </Button>
                      </Grid.Col> */}
                      <Flex gap="15" px="8">
                        <PinInput
                          type={/^[0-9]+/}
                          disabled={emailVerified === form.values.email}
                          value={code1}
                          onChange={(value) => setCode1(value)}
                          inputMode="numeric"
                        />
                        <Button
                          fullWidth
                          disabled={
                            emailVerified === form.values.email ||
                            !!emailValidation(form.values.email)
                          }
                          loading={sending || checking}
                          onClick={() => sendCode("email")}
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
                        disabled={active > 4}
                        c='#000'
                      >
                        {active < 4 ? "Next step" : "Sign Up"}
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
                      To enhance the security of the Trade Dept community, we
                      require phone number verification.
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
                        disabled={active > 4}
                        c='#000'
                      >
                        {active < 4 ? "Next step" : "Sign Up"}
                      </Button>
                    </Group>
                  </Box>
                </Grid.Col>
              </Grid>
            </Stepper.Step>
            <Stepper.Step
              icon={
                <IconMapPinCheck
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
                    <Image src="/assets/send-mail.png" alt="image" />
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
                    <Text fw={900} fz={{ base: "22", md: "30" }} align="center">
                      Verify your Address
                    </Text>
                    <Text pb="md" c="dimmed">
                      As part of our effort to enhance our services and tailor
                      them to your needs, we request your address information
                      during the registration process.
                    </Text>

                    <Combobox
                      onOptionSubmit={(address) => {
                        form.setFieldValue("address", address);
                        setEntryAddr(addressToString(address));
                        combobox.closeDropdown();
                      }}
                      store={combobox}
                    >
                      <Combobox.Target>
                        <TextInput
                          label="Enter Full Address"
                          value={entryAddr}
                          placeholder="1 1 1 Hwy, Brazoria, TX 77422"
                          onChange={(e) => {
                            setEntryAddr(e.target.value);
                          }}
                          radius="md"
                          required
                          error={form.errors.address}
                        />
                      </Combobox.Target>

                      <Combobox.Dropdown>
                        <Combobox.Options>{options}</Combobox.Options>
                      </Combobox.Dropdown>
                    </Combobox>

                    <TextInput
                      label="Street Address"
                      value={form.values.address.streetLine}
                      onChange={(e) =>
                        form.setFieldValue("address", {
                          ...form.values.address,
                          streetLine: e.target.value,
                        })
                      }
                      radius="md"
                      placeholder="1 1 1 Hwy"
                    />
                    <Grid>
                      <Grid.Col span={6}>
                        <TextInput
                          label="City"
                          value={form.values.address.city}
                          onChange={(e) =>
                            form.setFieldValue("address", {
                              ...form.values.address,
                              city: e.target.value,
                            })
                          }
                          radius="md"
                          placeholder="Brazoria"
                        />
                      </Grid.Col>
                      <Grid.Col span={6}>
                        <TextInput
                          label="State"
                          value={form.values.address.state}
                          onChange={(e) =>
                            form.setFieldValue("address", {
                              ...form.values.address,
                              state: e.target.value,
                            })
                          }
                          radius="md"
                          placeholder="TX"
                        />
                      </Grid.Col>
                    </Grid>
                    <TextInput
                      label="Zip Code"
                      value={form.values.address.zipcode}
                      onChange={(e) =>
                        form.setFieldValue("address", {
                          ...form.values.address,
                          zipcode: e.target.value,
                        })
                      }
                      radius="md"
                      error={form.errors.address}
                      placeholder="77422"
                      required
                    />
                    <TextInput
                      label="Country"
                      value="United States"
                      readOnly
                      radius="md"
                      placeholder="United States"
                    />
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
                        disabled={active > 4}
                        c='#000'
                      >
                        {active < 4 ? "Next step" : "Sign Up"}
                      </Button>
                    </Group>
                  </Box>
                </Grid.Col>
              </Grid>
            </Stepper.Step>
            <Stepper.Step
              icon={
                <IconAlertSquare
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
                    <Image src="/assets/terms-condition.png" alt="image" />
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
                    <Text fw={900} fz={{ base: "22", md: "30" }} align="center">
                      Terms & Conditions
                    </Text>
                    <ScrollArea
                      h={600}
                      pr={18}
                      viewportRef={termsRef}
                      onScrollPositionChange={(pos) => {
                        if (pos.y + 650 > termsRef.current.scrollHeight)
                          setAllowTerm(true);
                      }}
                    >
                      <Text fw={400} fz={16}>
                        {termsData}
                      </Text>
                    </ScrollArea>

                    <Checkbox
                      label="I accept terms and conditions"
                      checked={form.values.terms}
                      disabled={!allowTerm}
                      onChange={(event) =>
                        form.setFieldValue("terms", event.currentTarget.checked)
                      }
                      error={form.errors.terms}
                    />
                  </Stack>
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
                      disabled={active > 4}
                      c='#000'
                    >
                      {active < 4 ? "Next step" : "Sign Up"}
                    </Button>
                  </Group>
                </Grid.Col>
              </Grid>
            </Stepper.Step>
            <Stepper.Completed>
              <Grid align="center">
                <Grid.Col order={{ base: 2, md: 1 }} span={{ base: 12, md: 5 }} pt={{ base: "50px", md: "120px" }} px={{ base: "30px", sm: "50px" }} pb={{ base: "50px", md: "80px" }} bg="linear-gradient(180deg, #3CDFCD 0%, #272B3D 100%, #D6D6D6 100%)">
                  <Box maw={{ base: "400px", md: "100%" }} m="0 auto">
                    <Image src="/assets/signup-complete.png" alt="image" />
                  </Box>
                </Grid.Col>
                <Grid.Col order={{ base: 1, md: 2 }} span={{ base: 12, md: 7 }} pb={{ base: "50", md: "80" }} px={{ base: "20", sm: "50", md: "80" }}>
                  <Stack>
                    <Title align="center">COMPLETED,</Title>
                    <Text fz={30} align="center">
                      Please wait for approval.
                    </Text>
                  </Stack>
                </Grid.Col>
              </Grid>
            </Stepper.Completed>
          </Stepper>
        </form>
      </Grid.Col>
    </Grid>
  );
}

function ProfileForm({ onSubmitEnd }) {
  const isCustomer = userService.userValue?.role !== "ADMIN";
  const form = useForm({
    initialValues: {
      firstName: userService.userValue?.firstName,
      lastName: userService.userValue?.lastName,
      email: userService.userValue?.email,
      curPassword: "",
      password: "",
      confirmPassword: "",
      packageMode: packageModes[userService.userValue?.packageMode],
    },

    validate: {
      email: emailValidation,
      curPassword: (val) =>
        val.length === 0 ? "Input your current password" : null,
      password: (val) =>
        val && val.length < 6
          ? "Password should include at least 6 characters"
          : null,
      confirmPassword: (value, values) =>
        values.password && value !== values.password
          ? "Passwords did not match"
          : null,
      firstName: (val) => {
        if (val.trim().length === 0) {
          return "Please input your first name";
        } else if (val.trim().length < 2 || val.trim().length > 50) {
          return "First name should be between 2 and 50 characters";
        }
        return null; // Validation passed
      },
      lastName: (val) => {
        if (val.trim().length === 0) {
          return "Please input your last name";
        } else if (val.trim().length < 2 || val.trim().length > 50) {
          return "Last name should be between 2 and 50 characters";
        }
        return null; // Validation passed
      },
      packageMode: (val) => (val === null ? "Select Package mode" : null),
    },
  });

  const handleFormSubmit = (values) => {
    let params = {};
    let paramKeys = [
      "firstName",
      "lastName",
      "email",
      "curPassword",
      "password",
    ];
    if (isCustomer) {
      paramKeys = [...paramKeys, "packageMode"];
      values["packageMode"] = packageModes[values.packageMode];
    }
    paramKeys.forEach((key) => {
      if (values[key] !== "") params[key] = values[key];
    });
    return userService
      .update(userService.userValue.id, params)
      .then(() => {
        toastShow("Profile updated successfuly!");
        onSubmitEnd();
      })
      .catch((error) => {
        toastShow(error, "error");
      });
  };

  return (
    <form onSubmit={form.onSubmit(handleFormSubmit)}>
      <Stack>
        <Grid>
          <Grid.Col span={6}>
            <TextInput
              required
              label="First Name"
              placeholder="Your first name"
              value={form.values.firstName}
              onChange={(event) =>
                form.setFieldValue("firstName", event.currentTarget.value)
              }
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
                form.setFieldValue("lastName", event.currentTarget.value)
              }
              {...form.getInputProps("lastName")}
              radius="md"
            />
          </Grid.Col>
        </Grid>
        <TextInput
          required
          label="Email"
          placeholder="Your Email"
          value={form.values.email}
          onChange={(event) =>
            form.setFieldValue("email", event.currentTarget.value)
          }
          disabled
          error={form.errors.email && "Invalid email"}
          radius="md"
        />

        <PasswordInput
          required
          label="Current Password"
          placeholder="Your current password"
          value={form.values.curPassword}
          onChange={(event) =>
            form.setFieldValue("curPassword", event.currentTarget.value)
          }
          error={form.errors.curPassword}
          radius="md"
        />
        <PasswordInput
          label="New Password"
          placeholder="Your new password"
          value={form.values.password}
          onChange={(event) =>
            form.setFieldValue("password", event.currentTarget.value)
          }
          error={
            form.errors.password &&
            "New Password should include at least 6 characters"
          }
          radius="md"
        />
        <PasswordInput
          label="Confirm New Password"
          placeholder="Confirm New Password"
          value={form.values.confirmPassword}
          onChange={(event) =>
            form.setFieldValue("confirmPassword", event.currentTarget.value)
          }
          error={
            form.errors.confirmPassword &&
            "Confirm New Password should be same as New Password"
          }
          radius="md"
        />

        {isCustomer && (
          <Select
            mt="lg"
            radius="lg"
            placeholder="Select Package"
            value={form.values.packageMode}
            onChange={(value) => form.setFieldValue("packageMode", value)}
            data={Object.keys(packageModes)}
            disabled
          />
        )}
      </Stack>
      <Group justify="end" mt="xl">
        <Group justify="center" mt="xl">
          <Button type="submit" radius="xl">
            Update
          </Button>
        </Group>
      </Group>
    </form>
  );
}

function AddressForm({ onSubmitEnd }) {
  let addr = {
    streetLine: "",
    city: "",
    state: "",
    zipcode: "",
  };
  const [entryAddr, setEntryAddr] = useState("");

  if (userService?.userValue?.address)
    addr = JSON.parse(userService?.userValue?.address);

  const form = useForm({
    initialValues: {
      curPassword: "",
      address: addr,
      entryAddr,
    },

    validate: {
      curPassword: (val) =>
        val.length === 0 ? "Input your current password" : null,
      address: {
        zipcode: (val) => {
          if (!val || val.trim().length === 0) {
            return "Zipcode is required";
          }
          return null;
        },
      },
      entryAddr: (val) => {
        if (!val || val.trim().length === 0) {
          return "Street Address is required";
        }
        return null;
      },
    },
  });

  const handleFormSubmit = (values) => {
    let params = {};
    params["curPassword"] = values.curPassword;
    params["zipCode"] = values.address.zipcode;
    params["address"] = JSON.stringify(values.address);
    return userService
      .update(userService.userValue.id, params)
      .then(() => {
        toastShow("Address updated successfuly!");
        onSubmitEnd();
      })
      .catch((error) => {
        toastShow(error, "error");
      });
  };

  const combobox = useCombobox();
  const [addrList, setAddrList] = useState([]);

  const options = addrList.map((item, i) => (
    <Combobox.Option value={item} key={`addr${i}`}>
      {item.streetLine}, {item.city}, {item.state}, {item.zipcode}
    </Combobox.Option>
  ));

  const autoCompleteAddress = (lookup) => {
    verifyService.findAddress({ lookup }).then((res) => {
      setAddrList(res.result);
      if (res.result.length > 0) combobox.openDropdown();
      else combobox.closeDropdown();
    });
  };

  return (
    <form onSubmit={form.onSubmit(handleFormSubmit)}>
      <Stack>
        <Text>Your Address Settings</Text>

        <PasswordInput
          label="Current Password"
          placeholder="Your current password"
          value={form.values.curPassword}
          onChange={(event) =>
            form.setFieldValue("curPassword", event.currentTarget.value)
          }
          error={form.errors.curPassword}
          required
          radius="md"
        />

        <Combobox
          onOptionSubmit={(address) => {
            form.setFieldValue("address", address);
            setEntryAddr(addressToString(address));
            combobox.closeDropdown();
          }}
          store={combobox}
        >
          <Combobox.Target>
            <TextInput
              label="Enter Street Address"
              value={entryAddr}
              onChange={(e) => {
                form.setFieldValue("entryAddr", event.currentTarget.value);
                setEntryAddr(e.target.value);
              }}
              radius="md"
              required
              {...form.getInputProps("entryAddr")}
            />
          </Combobox.Target>

          <Combobox.Dropdown>
            <Combobox.Options>{options}</Combobox.Options>
          </Combobox.Dropdown>
        </Combobox>

        <TextInput
          label="Street Address"
          value={form.values.address.streetLine}
          onChange={(e) =>
            form.setFieldValue("address", {
              ...form.values.address,
              streetLine: e.target.value,
            })
          }
          radius="md"
        />
        <Grid>
          <Grid.Col span={6}>
            <TextInput
              label="City"
              value={form.values.address.city}
              onChange={(e) =>
                form.setFieldValue("address", {
                  ...form.values.address,
                  city: e.target.value,
                })
              }
              radius="md"
            />
          </Grid.Col>
          <Grid.Col span={6}>
            <TextInput
              label="State"
              value={form.values.address.state}
              onChange={(e) =>
                form.setFieldValue("address", {
                  ...form.values.address,
                  state: e.target.value,
                })
              }
              radius="md"
            />
          </Grid.Col>
        </Grid>
        <TextInput
          label="Zip Code"
          value={form.values.address.zipcode}
          onChange={(e) =>
            form.setFieldValue("address", {
              ...form.values.address,
              zipcode: e.target.value,
            })
          }
          required
          radius="md"
          {...form.getInputProps("address.zipcode")}
        />
        <TextInput label="Country" value="United States" readOnly radius="md" />
      </Stack>
      <Group justify="end" mt="xl">
        <Group justify="center" mt="xl">
          <Button type="submit" radius="xl">
            Update
          </Button>
        </Group>
      </Group>
    </form>
  );
}

function ResetForm() {
  const router = useRouter();

  const form = useForm({
    initialValues: {
      email: "",
      phone: "",
      password: "",
      confirmPassword: "",
    },

    validate: {
      email: emailValidation,
      phone: (val) =>
        !isValidPhoneNumber(val) ? "Input valid phone number" : null,
      password: (val) =>
        val.length < 6 ? "Password should include at least 6 characters" : null,
      confirmPassword: (value, values) =>
        value !== values.password ? "Passwords did not match" : null,
    },
  });

  const handleFormSubmit = (values) => {
    const params = {
      email: values.email,
      phone: values.phone,
      password: values.password,
    };
    return userService
      .reset(params)
      .then(() => {
        toastShow("Password changed successfuly!");
        router.push("/signin");
      })
      .catch((error) => {
        toastShow(error, "error");
      });
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
        } else {
          router.push("/marketplace");
        }
      });
    }
  }, []);
  return (
    <form onSubmit={form.onSubmit(handleFormSubmit)}>
      <Stack>
        <TextInput
          required
          label="Email"
          placeholder="Your Email"
          value={form.values.email}
          onChange={(event) =>
            form.setFieldValue("email", event.currentTarget.value)
          }
          error={form.errors.email && "Invalid email"}
          radius="md"
        />

        <Box w="100%" className={!!form.errors.phone ? "phoneError" : ""}>
          <div className="PhoneInputInput PhoneInput">
            +1{" "}
            <PInput.default
              country="US"
              className="PhoneInputInput"
              placeholder="Enter phone number"
              value={form.values.phone}
              onChange={(value) => {
                if (typeof value === "string")
                  form.setFieldValue("phone", value);
              }}
            />
          </div>
          <Text c="red" fz={12} style={{ marginTop: 0 }}>
            {form.errors.phone}
          </Text>
        </Box>

        <Divider my="xs" />

        <PasswordInput
          label="New password"
          placeholder="Your password"
          value={form.values.password}
          onChange={(event) =>
            form.setFieldValue("password", event.currentTarget.value)
          }
          error={
            form.errors.password &&
            "New Password should include at least 6 characters"
          }
          radius="md"
        />
        <PasswordInput
          label="Confirm New Password"
          placeholder="Confirm Password"
          value={form.values.confirmPassword}
          onChange={(event) =>
            form.setFieldValue("confirmPassword", event.currentTarget.value)
          }
          error={
            form.errors.confirmPassword &&
            "Confirm New Password should be same as Password"
          }
          radius="md"
        />
      </Stack>
      <Group justify="space-between" mt="xl">
        <Anchor
          component="button"
          type="button"
          c="dimmed"
          onClick={() => {
            router.push("/signin");
          }}
          size="sm"
          fw={600}
        >
          Go to Login
        </Anchor>
        <Group justify="center">
          <Button type="submit" radius="xl" c='#000'>
            Reset Password
          </Button>
        </Group>
      </Group>
    </form>
  );
}
