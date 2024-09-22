import {
  Container,
  Image,
  Button,
  Group,
  Box,
  useMantineColorScheme,
  BackgroundImage,
  TextInput,
  Center,
  Text,
  Title,
  Loader,
  Modal,
} from "@mantine/core";
import { useLoadingContext } from "@/providers/LoadingProvider";
import { Country, State, City } from "country-state-city";
import { paymentService, userService } from "@/services";
import { IconCreditCard } from "@tabler/icons-react";
import React, { useEffect, useState } from "react";
import Form from "@/components/Payments/Form";
import { useRouter } from "next/router";
import { toastShow } from "@/helpers";
import { useDisclosure } from "@mantine/hooks";

const stripe = require("stripe")(
  "pk_test_51P6SCuJTWQgDBaTpolFsGDPWMRoNsXz5aBH2LPCK4YSGjnjdbQQoP6neOavrcaX0wTjsWdsjnJsEoDvLRyaGUqma00S4MSfgf9"
);

const PaymentDetails = ({ onClose, setShow1, setCall }) => {
  const countries = Country.getAllCountries();
  const updatedStates = () =>
    State.getStatesOfCountry("US").map((state) => ({
      label: state.name,
      value: state.countryCode,
      ...state,
    }));

  const updatedCountries = countries
    .filter((country) => country.isoCode === "US")
    .map((country) => ({
      label: country.name,
      value: country.isoCode,
      ...country,
    }));

  const cardDetails = {
    cardNumber: "",
    userName: "",
    cvc: "",
    expireDate: "", // Format: 'MM/YYYY'
    address: "",
    state: null,
    city: null,
    zipcode: "",
    country: updatedCountries[0],
    UserId: userService.userValue?.id,
  };
  const [opened, { open, close: closePayment }] = useDisclosure(false);

  const router = useRouter();
  const loadingContext = useLoadingContext();
  const { colorScheme } = useMantineColorScheme();
  const [dark, setDark] = useState(true);
  const [errors, setErrors] = useState({});
  const [cardInfo, setCardInfo] = useState(cardDetails);
  const [loader, setLoader] = useState(false);

  const updatedCities = (countryId, stateId) =>
    City.getCitiesOfState(countryId, stateId).map((city) => ({
      label: city.name,
      value: city.id,
      ...city,
    }));

  const handleCardDetailsChange = (fieldName, value) => {
    let formattedValue = value;
    switch (fieldName) {
      case "userName":
        if (!value.trim()) {
          setErrors({
            ...errors,
            userName: "Name is required",
          });
        } else {
          formattedValue = value;
          setErrors({
            ...errors,
            userName: "",
          });
        }
        break;
      case "cardNumber":
        if (!value.trim()) {
          setErrors({
            ...errors,
            cardNumber: "Card Number is required",
          });
        } else {
          formattedValue = value
            .replace(/\D/g, "")
            .replace(/(\d{4})(?=\d)/g, "$1 ");

          if (formattedValue.length > 19) {
            formattedValue = formattedValue.slice(0, 19);
          }
          setErrors({
            ...errors,
            cardNumber: "",
          });
        }
        break;
      case "cvc":
        if (!value.trim()) {
          setErrors({
            ...errors,
            cvc: "CVC is required",
          });
        } else {
          formattedValue = value.slice(0, 4);
          setErrors({
            ...errors,
            cvc: "",
          });
        }
        break;
      case "expireDate":
        if (!value.trim()) {
          setErrors({
            ...errors,
            expireDate: "Expiration date is required",
          });
        } else {
          formattedValue = value
            .replace(/\D/g, "")
            .replace(/(\d{2})(\d{0,4})/, "$1/$2");
          const parts = formattedValue.split("/");
          if (parts.length === 2) {
            let month = parseInt(parts[0], 10);
            let year = parseInt(parts[1], 10);

            if (month > 12) {
              month = 12;
            }
            if (year.toString().length == 2 && year) {
            } else {
              if (year) {
                year = year % 100;

                const currentYear = new Date().getFullYear() % 100;
                if (year < currentYear) {
                  if (year.toString().length === 2) {
                    year = currentYear;
                  }
                } else if (year > 99) {
                  year = 99;
                }
                formattedValue = `${month
                  .toString()
                  .padStart(2, "0")}/${year.toString()}`;
              } else {
                formattedValue = `${month.toString().padStart(2, "0")}`;
              }
            }
          }
          setErrors({
            ...errors,
            expireDate: "",
          });
        }
        break;
      case "zipcode":
        if (!value.trim()) {
          setErrors({
            ...errors,
            zipcode: "Zip Code is required",
          });
        } else {
          formattedValue = value.slice(0, 5).replace(/\D/g, "");
          setErrors({
            ...errors,
            zipcode: "",
          });
        }
        break;
      default:
        break;
    }
    setCardInfo((prevCardDetails) => ({
      ...prevCardDetails,
      [fieldName]: formattedValue,
    }));
  };

  const validateError = () => {
    const error = validateFields({
      cardNumber: cardInfo.cardNumber,
      userName: cardInfo.userName,
      cvc: cardInfo.cvc,
      expireDate: cardInfo.expireDate,
      address: cardInfo.address,
    });
    setErrors(error);
    return error;
  };

  const handleVerfication = async (e) => {
    e.preventDefault();

    const errors = validateError();

    if (Object.keys(errors).length === 0) {
      const parts = cardInfo.expireDate.split("/");

      let month = parseInt(parts[0], 10);
      let year = parseInt(parts[1], 10);
      setLoader(true);
      try {
        await stripe.tokens.create({
          card: {
            number: cardInfo.cardNumber?.trim(),
            exp_month: month,
            exp_year: year,
            cvc: cardInfo.cvc,
          },
        });
        const obj = cardInfo;
        obj.state = cardInfo?.state?.name;
        obj.city = cardInfo?.city?.name;
        obj.country = "United States";
        obj.cardNumber = obj.cardNumber?.trim();
        const data = await paymentService.create(obj);
        if (data.message) {
          toastShow(data.message);
          setLoader(false);
          onClose(false);
          setCall(true)
        }
      } catch (err) {
        const { param, message } = err;
        toastShow(message, "error");
        setLoader(false);
        switch (param) {
          case "number":
            setErrors({
              ...errors,
              cardNumber: message,
            });
            break;
          case "cvc":
            setErrors({
              ...errors,
              cvc: message,
            });
            break;
        }
      }
    } else {
      setErrors(errors);
      console.log("Validation errors:", errors);
    }
  };

  const validateFields = (fields) => {
    console.log(fields);
    const errors = {};

    // Validate card number
    if (!fields?.cardNumber || !fields?.cardNumber?.trim()) {
      errors.cardNumber = "Card number is required";
    }
    // Validate name
    if (!fields?.userName || !fields?.userName?.trim()) {
      errors.userName = "Name is required";
    }
    // Validate cvc
    if (!fields?.cvc || !fields?.cvc?.trim()) {
      errors.cvc = "CVC is required";
    }
    // Validate expiration date
    if (!fields?.expireDate || !fields?.expireDate?.trim()) {
      errors.expireDate = "Expiration date is required";
    } else {
      const parts = fields.expireDate.split("/");
      const month = parseInt(parts[0], 10);
      const year = parseInt(parts[1], 10);
      const currentYear = new Date().getFullYear() % 100;
      if (
        parts.length !== 2 ||
        isNaN(month) ||
        isNaN(year) ||
        month < 1 ||
        month > 12 ||
        year < currentYear
      ) {
        errors.expireDate = "Invalid expiration date";
      }
    }

    return errors;
  };

  const getPaymentDetails = async () => {
    try {
      const data = await paymentService.getById(userService.userValue?.id);
      if (data.pAccount) {
        // toastShow("Payment Account already exists")
        // router.push("/");
        // setCardInfo(data.pAccount)
      }
    } catch (error) {}
  };

  useEffect(() => {
    setDark(colorScheme === "dark");
  }, [colorScheme]);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (user) {
      userService.getById(user?.id).then(() => {
        if (
          userService.userValue?.role === "ADMIN" ||
          userService.userValue?.role === "SUBADMIN"
        ) {
          router.push("/admin/users");
        } else if (userService.userValue?.inPurchase) {
          router.push("/");
        }
      });
    } else {
      router.push("/");
    }
    loadingContext.setIsLoading(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Box p={{ base: "0 0 20" }}>
      {/* <BackgroundImage py={80} px='sm'
        src={dark ? '/assets/payment-bg.png' : '/assets/payment-bg-light.png'}
      >
        <Container size="xs" bg={dark ? '#333333' : '#F3F5F9'} px={{ base: 20, sm: 50 }} py={50} style={{ borderRadius: '16px' }}> */}
      <Group display="flex" justify="center" mb={30} style={{ width: "100%" }}>
        <Image src="../assets/payment-method.svg" />
        <Title order={2}>Payment Details</Title>
      </Group>
      <Box mb="md">
        <Title order={3}>Payment method</Title>
        <Text>(Your card will not be charged at this time)</Text>
      </Box>
      <Group
        className="credit-card"
        bg={dark ? "#2E2E2E" : "#FFFFFF"}
        p="xs"
        mb="md"
        c={dark ? "#C9C9C9" : "#000"}
        justify="center"
        gap="sm"
      >
        <IconCreditCard size={22} />
        Debit or Credit Card
      </Group>

      <Form
        handleVerfication={handleVerfication}
        cardInfo={cardInfo}
        handleCardDetailsChange={handleCardDetailsChange}
        errors={errors}
        updatedCities={updatedCities}
        updatedStates={updatedStates}
        updatedCountries={updatedCountries}
        setCardInfo={setCardInfo}
        router={router}
        onClose={onClose}
        loader={loader}
        setShow1={setShow1}
      />

      {/* </Container>
      </BackgroundImage > */}
    </Box>
  );
};

export default PaymentDetails;
