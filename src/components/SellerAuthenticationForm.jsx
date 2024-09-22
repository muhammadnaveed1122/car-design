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
import { addressToString, toastShow } from "@/helpers";
import { useEffect, useState, useRef } from "react";
import { TwitterButton } from "./TwitterButton";
import { FaceBookButton, GoogleButton } from "./GoogleButton";
import "react-phone-number-input/style.css";
import { useForm } from "@mantine/form";
import { useRouter } from "next/router";
import { userService, verifyService } from "@/services";
// import Cookies from 'js-cookie';

export { SignUpForm };

const emailValidation = (val) => {
  console.log(val, "val val val")
  val.length === 0
    ? "Input Email Address"
    : /^\S+@\S+\.\S+$/.test(val)
      ? null
      : "Invalid email";
}

function SignUpForm({ referalCode, email, fullName }) {
  const router = useRouter();
  const [signing, setSigning] = useState(false);
  const [requireReferal, setRequireReferal] = useState(false);
  const [allowTerm, setAllowTerm] = useState(false);

  const form = useForm({
    initialValues: {
      // referal: "", 
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
      // packageMode: null,
      avatar: null,
      terms: false,
    },

    validate: {
      email: (value) => (/^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,6}))$/.test(value) ? null : 'Invalid email'),
      // (!emailCodeSend  ? null : "Verify your email address"),
      // phone: (val) =>
      //   !isValidPhoneNumber(val)
      //     ? "Input valid phone number"
      //     : phoneVerified === val
      //       ? null
      //       : "Verify your phone number",
      password: (val) =>
        val.length < 6 ? "Password should include at least 6 characters" : null,
      confirmPassword: (value, values) =>
        value !== values.password ? "Passwords did not match" : null,
      // firstName: (val) => {
      //   if (val.trim().length === 0) {
      //     return `Please input your first name ${val.startsWith(" ") ? "without space" : ""
      //       }`;
      //   } else if (val.trim().length < 2 || val.trim().length > 50) {
      //     return "First name should be between 2 and 50 characters";
      //   }
      //   return null;
      // },
      // lastName: (val) => {
      //   if (val.trim().length === 0) {
      //     return `Please input your last name ${val.startsWith(" ") ? "without space" : ""
      //       }`;
      //   } else if (val.trim().length < 2 || val.trim().length > 50) {
      //     return "Last name should be between 2 and 50 characters";
      //   }
      //   return null;
      // },
      // address: (val) =>
      //   !val.zipcode || val.zipcode.length === 0
      //     ? "Zip code is required"
      //     : null,
      // packageMode: (val) => (val === null ? "Select Package mode" : null),
      // referal: (val) =>
      //   requireReferal && val === "" ? "Input Referral Code" : null,
      // terms: (val) => (val === false ? "Check for terms and conditions" : null),
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

  const { data: session } = useSession();
  useEffect(() => {
    console.log(session, 'session')
    if (session?.provider === 'google') {
      const names = (session.user?.name || " ").split(" ");
      let signUpData = {
        firstName: names[0] || '',
        lastName: names[1] || '', // Provide fallback for missing last name
        email: session.user?.email,
        loginType: "SELLER",
        role: "SELLER",
        phone: "",
      };
      // console.log(session, 'session')
      setSigning(true);
      userService
        .googleLogin(signUpData)
        .then(() => {
          toastShow("Registered successfuly!");
          const { userValue } = userService;
          if (
            userValue?.role === userRole[3]
          ) {
            router.push("/sell-car");
          } else {
            router.push("/marketplace");
          }
        })
        .catch((error) => {
          toastShow(error, "error");
          setSigning(false);
        });
    }
  }, [session?.user]);

  const handleFormSubmit = (signUpData) => {
    console.log(signUpData, 'signUpData signUpData')
    signUpData.role = "SELLER";
    signUpData.status = "APPROVED";
    const formData = new FormData();
    for (const key in signUpData) {
      if (key == "address") {
        const address = signUpData[key];
        formData.append("zipCode", address.zipcode);
        formData.append("address", JSON.stringify(address));
      }
      // else if (key == "packageMode")
      //   formData.append(key, packageModes[signUpData[key]]);
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
        router.push('/')
        // nextStep();
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
      // "packageMode",
      // "referal",
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

  const nextStep = () => setActiveStep(active < 1 ? active + 1 : active);
  const prevStep = () => setActiveStep(active > 0 ? active - 1 : active);

  const [code1, setCode1] = useState("");
  const [code2, setCode2] = useState("");
  const [sending, setSending] = useState(false);
  const [checking, setChecking] = useState(false);
  const [emailVerified, setEmailVerified] = useState(null);
  const [phoneVerified, setPhoneVerified] = useState(null);
  const [emailCodeSend, setEmailCodeSend] = useState(false)
  const sendCode = async (verifyType) => {
    try {
      if (verifyType === "email") {
        if (emailCodeSend) {
          form.setFieldError("email", "Verify your email address")
          toastShow("Verify your email address", "error");
          return false;
        }
        const isValid = form.validate();
        if (isValid.hasErrors) {
          console.log('Cannot submit, there are errors');
          return;
        }
        setSending(true);

        const checkEmail = await verifyService.sendToEmail({ emailTo: form.values.email });
        console.log(checkEmail, 'checkEmail checkEmail')
        if (!checkEmail.status) {
          console.log(checkEmail, "i im idnfdfdsfsd")
          setTimeout(() => {
            toastShow("error", checkEmail.messages);
            setSending(false);
          }, 1000);

        } else {
          setTimeout(() => {
            toastShow("4-Digit Code Sent to Email");
            setSending(false);
            // setEmailVerified(form.values.email)
            setEmailCodeSend(true)

          }, 1000);
        }

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
  console.log(emailVerified, "email vvvvvvvvvvvvvvvvvvvvvvvvvv")
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
              form.clearFieldError('email');
              toastShow("Email Verified!");
              // setActive(2);
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
      router.push("/seller-signup");
    }
  }, []);
  console.log(active, 'activeactiveactiveactiveactive')
  console.log(form.errors, 'errorserrorserrorserrorserrors')

  return (
    <Grid align="stretch">
      <Grid.Col span={12}>
        <form
          className="signupForm"
          onSubmit={(e) => {
            if (active == 0) {
              console.log("ddddddddddddddddddddddddddddddddddddddddddddddddddd")
              e.preventDefault();
              nextStep();
            } else {
              form.onSubmit(handleFormSubmit)(e);
              console.log('submit')
            }
          }}
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
                {/* <Image src="/assets/send-mail.png" alt="image" /> */}
                <Image src="/assets/create-account.png" alt="image" />
              </Box>
            </Grid.Col>
            <Grid.Col
              order={{ base: 1, md: 2 }}
              span={{ base: 12, md: 7 }}
              p={{ base: "60 20 50", md: "80 80 80" }}
            >
              <Stack>
                <Title order={2} fw={700}>
                  Log into Trade Dept!
                </Title>
                <Group grow mb="md" mt="md">
                  <GoogleButton
                    radius="xl"
                    className={classes.socialButton}
                    // onClick={signInWithGoogle}
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
                  {/* <TwitterButton
          radius="xl"
          className={classes.socialButton}
          onClick={signInWithGoogle}
        >
          Twitter
        </TwitterButton> */}
                </Group>
                <Title mb={{ base: "5", md: "15" }}>
                  Create Your Account
                </Title>
                {/* <Text c="dimmed">
                  To enhance the security of the Trade Dept community, we require email address verification.
                </Text> */}
                <TextInput
                  label="Email"
                  placeholder="Your Email"
                  value={form.values.email}
                  onChange={(event) =>
                    form.setFieldValue("email", event.currentTarget.value)
                  }
                  disabled={emailCodeSend}
                  error={
                    emailVerified === form.values.email
                      ? null
                      : form.errors.email
                  }
                  {...form.getInputProps('email')} onBlur={() => form.validateField('email')}
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
                  // error={form.errors.password}
                  {...form.getInputProps('password')} onBlur={() => form.validateField('password')}
                  radius="md"

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
                  // error={form.errors.confirmPassword}
                  {...form.getInputProps('confirmPassword')} onBlur={() => form.validateField('confirmPassword')}
                  radius="md"

                />
                <Group gap={4}>
                  <Checkbox
                    label="I accept"
                    checked={form.values.terms}
                    // disabled={!allowTerm}
                    required
                    onChange={(event) =>
                      form.setFieldValue("terms", event.currentTarget.checked)
                    }
                    error={form.errors.terms}
                  />
                  <Anchor href="/terms-and-condition" target="_blank" c='#3CDFCD'>terms and conditions</Anchor>
                </Group>
                <Text c="dimmed">
                  Please check your inbox/spam for an email and enter the 4-digit code sent to it
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
                        emailVerified === form.values.email
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
                {emailVerified === form.values.email && (

                  <Group justify="center" mt="md">
                    <Button
                      type="submit"
                      loading={signing}
                      size="lg"
                      radius="xl"
                      disabled={active > 4}
                    >
                      Sign Up
                    </Button>
                  </Group>
                )}

              </Box>
            </Grid.Col>
          </Grid>
        </form>
      </Grid.Col>
    </Grid>
  );
}
