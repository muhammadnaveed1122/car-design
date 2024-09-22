import {
  Box,
  Tabs,
  Text,
  Title,
  useMantineColorScheme,
  Grid,
  FileInput,
  Group,
  Button,
  Image,
} from "@mantine/core";
import React, { useEffect, useState } from "react";
import { userService, identityService } from "@/services";
import style from "../../styles/support.module.css";
import { toastShow } from "@/helpers";
import { identityType } from "@/constants/data";
import { useRouter } from "next/router";
import isAuth from "@/components/Auth/auth";
import { IconUpload } from "@tabler/icons-react";

const Identity = ({ close }) => {
  const router = useRouter();

  const identityDetails = {
    identityType: identityType[0],
    backImage: null,
    frontImage: null,
    UserId: userService.userValue?.id,
    approve: false,
  };

  const formData = new FormData();

  const { colorScheme } = useMantineColorScheme();
  const [dark, setDark] = useState(true);
  const [loading, setLoading] = useState(false);
  const [identityInfo, setIdentityInfo] = useState(identityDetails);
  const [activeTab, setActiveTab] = useState(identityType[0]);
  const [errors, setErrors] = useState();
  const [backImage, setBackImage] = useState(null);
  const [frontImage, setFrontImage] = useState(null);

  useEffect(() => {
    setDark(colorScheme === "dark");
  }, [colorScheme]);

  const handleFrontImageChange = (event) => {
    const file = event;
    if (file) {
      setIdentityInfo({ ...identityInfo, frontImage: event });
      delete errors?.frontImage;
    } else {
      setIdentityInfo({ ...identityInfo, frontImage: null });
    }
    handlefrontImagePreview(event);
  };

  const handleBackImageChange = (event) => {
    const file = event;
    if (file) {
      setIdentityInfo({ ...identityInfo, backImage: event });
      delete errors?.backImage;
    } else {
      setIdentityInfo({ ...identityInfo, backImage: null });
    }
    handleBackImagePreview(event);
  };
  const handleBackImagePreview = (event) => {
    const file = event;
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setBackImage(reader.result);
      };
      reader.readAsDataURL(file);
    } else {
      setBackImage(null);
    }
  };
  const handlefrontImagePreview = (event) => {
    const file = event;
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFrontImage(reader.result);
      };
      reader.readAsDataURL(file);
    } else {
      setFrontImage(null);
    }
  };

  const validateIdentity = () => {
    let isValid = true;
    const newErrors = {};
    if (!identityInfo.backImage) {
      newErrors.backImage = "Back Image is required";
      isValid = false;
    } else {
      delete newErrors.backImage;
    }

    if (!identityInfo.frontImage) {
      newErrors.frontImage = "Front Image is required";
      isValid = false;
    } else {
      delete newErrors.frontImage;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    formData.append("identityType", activeTab);
    formData.append("UserId", userService.userValue?.id);
    formData.append("backImage", identityInfo.backImage);
    formData.append("frontImage", identityInfo.frontImage);
    if (!validateIdentity()) {
      return;
    }
    setLoading(true);
    try {
      const data = await identityService.create(formData);
      if (data.message) {
        toastShow(data.message);
        close();
        router.push("/home");
      }
    } catch (err) {
      console.log(err);
    }
    setLoading(false);
  };
  const handleTabChange = (value) => {
    setActiveTab(value);
    setIdentityInfo({ ...identityInfo, identityType: value });
  };

  useEffect(() => {
    identityInfo.backImage = null;
    identityInfo.frontImage = null;
    setBackImage(null);
    setFrontImage(null);
  }, [activeTab]);

  console.log("image", frontImage);
  return (
    <Box ta="center" style={{ borderRadius: "16px" }}>
      <Title fz={{ base: 20, md: 24 }} fw="700">
        Verify Your Identity
      </Title>
      <Text fz={{ base: 16 }} mb="20">
        Upload photos of ID document such as a ID Card or Driving Licence.
      </Text>
      <Tabs defaultValue={identityType[0]} active={activeTab}>
        <Tabs.List mb={20} className="identity-tab-wrapper" pl={{ base: 15 }}>
          <Tabs.Tab
            value="IDCARD"
            className="identity-tab"
            p={{ base: "15 15 15 30" }}
            miw="150"
            leftSection={
              <Image
                src="/assets/ic_idCard.svg"
                alt="id card icon"
                w={{ base: 40 }}
                h={{ base: 40 }}
              />
            }
            style={{ borderRadius: "10px" }}
            onClick={() => handleTabChange(identityType[0])}
          >
            <Text fz={16}>ID Card</Text>
          </Tabs.Tab>
          <Tabs.Tab
            value="LICENSE"
            className="identity-tab"
            p={{ base: "15 15 15 30" }}
            onTabChange={handleTabChange}
            leftSection={
              <Image
                src="/assets/license.svg"
                alt="id card icon"
                w={{ base: 40 }}
                h={{ base: 40 }}
              />
            }
            onClick={() => handleTabChange(identityType[1])}
            style={{ borderRadius: "10px" }}
          >
            <Text fz={16}>Driving License</Text>
          </Tabs.Tab>
        </Tabs.List>
      </Tabs>

      <Grid gutter="sm" mb={20}>
        <Grid.Col span={{ md: 12 }}>
          <Box pos="relative" className="img-input-wrapper">
            <FileInput
              className="img-input"
              // label="Front side"
              placeholder="Upload Card Front Side"
              onChange={handleFrontImageChange}
              leftSection={<IconUpload size={30} />}
              accept="image/png,image/jpeg,image/jpg,image/webp"
              required
            />
            {frontImage && (
              <Box
                className="image-preview"
                pos="absolute"
                bottom={4}
                left={4}
                style={{
                  width: "calc(100% - 8px)",
                  zIndex: 10,
                  height: "calc(100% - 8px)",
                  borderRadius: "13px",
                  overflow: "hidden",
                }}
              >
                <img
                  src={frontImage}
                  alt="Front side preview"
                  style={{ height: "100%", maxWidth: "100%" }}
                />
              </Box>
            )}
          </Box>
          <div className={style.error_message}>{errors?.frontImage}</div>
        </Grid.Col>
        <Grid.Col span={{ md: 12 }}>
          <Box pos="relative" className="img-input-wrapper">
            <FileInput
              className="img-input"
              // label="Back side"
              placeholder="Upload Card Back Side"
              onChange={handleBackImageChange}
              leftSection={<IconUpload size={30} />}
              accept="image/png,image/jpeg,image/jpg,image/webp"
              required
            />
            {backImage && (
              <Box
                className="image-preview"
                pos="absolute"
                bottom={4}
                left={4}
                style={{
                  width: "calc(100% - 8px)",
                  zIndex: 10,
                  height: "calc(100% - 8px)",
                  borderRadius: "13px",
                  overflow: "hidden",
                }}
              >
                <img
                  src={backImage}
                  alt="Back side preview"
                  style={{ height: "100%", maxWidth: "100%" }}
                />
              </Box>
            )}
          </Box>
          <div className={style.error_message}>{errors?.backImage}</div>
        </Grid.Col>
      </Grid>

      <Group justify="center">
        <Button
          onClick={() => {
            close();
          }}
          color="#cacaca"
          w="150"
          radius="xl"
        >
          Cancel
        </Button>
        <Button onClick={handleSubmit} color="#3CDFCD" w="150" radius="xl">
          {loading ? "Uploading..." : "Submit"}
        </Button>
      </Group>
    </Box>
  );
};

export default isAuth(Identity);
