import {
  Group,
  Grid,
  Button,
  Box,
  Stack,
  TextInput,
  ActionIcon,
  NumberInput,
  FileButton,
  Text,
  Input,
  Select,
} from "@mantine/core";
import {
  createUserCarAsync,
  updateUserCarAsync,
  useUserCarDispatch,
} from "@/redux/userCarsSlice";
import { currencyFormater, userCarStatus } from "@/constants/data";
import { useLoadingContext } from "@/providers/LoadingProvider";
import { IconShare, IconTrash } from "@tabler/icons-react";
import {
  initialPriceRange,
  driveType,
  fuelType,
  transmission,
  vehicleType,
  driveSide,
  carColors
} from "@/constants/data";
import ImageGallery from "react-image-gallery";
import { useEffect, useRef, useState } from "react";
import { useForm } from "@mantine/form";
import { isValidPhoneNumber } from "react-phone-number-input";
import { userService } from "@/services";
import { toastShow, validateVINNumber } from "@/helpers";
import { CustomRichTextEdit } from "../CarManage/CustomRichTextEdit";
import { DropzoneButton } from "../CarManage/DropzoneButton";
import CopyModal from "../CarManage/CopyModal";
import Papa from "papaparse";
export default function CarInfoForm(props) {
  const [fileExteriorImages, setFileExteriorImages] = useState([]);
  const [fileInteriorImages, setFileInteriorImages] = useState([]);
  const [csvData, setCsvData] = useState([]);
  const [carMaker, setCarMaker] = useState([]);
  const [carModel, setCarModel] = useState([]);
  const [carBodyStyle, setCarBodyStyle] = useState([]);
  const [years, setYears] = useState([]);
  const [share, setShare] = useState(false);

  const { onSubmit, fetchData } = props;
  const intriorGallery = useRef(null);
  const extriorGallery = useRef(null);

  const isUpdating = props.hasOwnProperty("id");
  const loadingContext = useLoadingContext();
  const dispatch = useUserCarDispatch();
  const initialValues = {
    Extriorfiles: [],
    Intriorfiles: [],
    interiorImages: isUpdating ? JSON.parse(props.interiorImages) : [],
    exteriorImages: isUpdating ? JSON.parse(props.exteriorImages) : [],
    year: props?.year ? (props?.year.toString()) : "",
    make: props?.make,
    model: props?.model,
    vin: props?.vin,
    lot: props?.lot,
    color: props?.color,
    price: props?.price,
    mileage: props?.mileage,
    doors: props?.doors,
    seats: props?.seats,
    transmission: props?.transmission,
    driveSide: props?.driveSide,
    vehicleType: props?.vehicleType,
    specs: props?.specs,
    engine: props?.engine,
    status: props?.status || userCarStatus[0],
    pdf: props?.pdf,
    companyName: props?.companyName,
    companyImage: props?.companyImage ? props?.companyImage : "",
    bodyStyle: props?.bodyStyle,
    fuelType: props?.fuelType,
    driveType: props?.driveType,
    bodyStyle: props?.bodyStyle,
    cylinders: props?.cylinders,
    slug: props?.slug,
    location: props?.location,
    isPending: props?.isPending,
    carDataJson: props?.carDataJson,
    phoneNumber: props?.phoneNumber,
    creator: props?.creator || userService?.userValue?.id,
  };

  const form = useForm({
    initialValues: initialValues,
    validate: {
      year: (value) => {
        if (
          value < 1930 ||
          value > new Date().getFullYear() ||
          value.toString().includes(".")
        ) {
          return `Please enter a whole number year between 1930 and ${new Date().getFullYear()}`;
        }
        return null;
      },
      price: (value) => {
        if (
          value < initialPriceRange[0] ||
          value > initialPriceRange[1] ||
          value.toString().includes(".")
        ) {
          return `Please enter a whole number price between ${initialPriceRange[0]} and ${initialPriceRange[1]}`;
        }
        return null;
      },
      doors: (value) => {
        if (value < 2 || value > 8 || value.toString().includes(".")) {
          return `Please enter a whole number doors between 2 and 8`;
        }
        return null;
      },
      seats: (value) => {
        if (value < 2 || value > 8 || value.toString().includes(".")) {
          return `Please enter a whole number seats between 2 and 8`;
        }
        return null;
      },
      phoneNumber: (val) => {
        if (!isValidPhoneNumber(val)) {
          return `Input valid phone number`;
        }
        return null;
      },
      vin: (value) => (value ? null : "Please enter a vin number"),
      make: (value) => (value ? null : "Please enter a make"),
      model: (value) => (value ? null : "Please enter a model"),
      lot: (value) => (value ? null : "Please enter a lot number"),
      color: (value) => (value ? null : "Please enter a color"),
    },
  });

  const urlInteriorImages = form.values.interiorImages.map((image) => ({
    original: image,
    thumbnail: image,
  }));

  const urlExteriorImages = form.values.exteriorImages.map((image) => ({
    original: image,
    thumbnail: image,
  }));
  let carInteriorImages = [...urlInteriorImages, ...fileInteriorImages];
  if (carInteriorImages.length === 0)
    carInteriorImages = [
      {
        original: "https://placehold.co/640x480?text=NoImage",
        thumbnail: "https://placehold.co/320x240?text=NoImage",
      },
    ];

  let carExtriorImages = [...urlExteriorImages, ...fileExteriorImages];
  if (carExtriorImages.length === 0)
    carExtriorImages = [
      {
        original: "https://placehold.co/640x480?text=NoImage",
        thumbnail: "https://placehold.co/320x240?text=NoImage",
      },
    ];

  const handleFormSubmit = async (values) => {
    console.log(values,"values")
    const formData = new FormData();

    if (values.Extriorfiles.length > 0) {
      for (let i = 0; i < values.Extriorfiles.length; ++i) {
        formData.append("exteriorImages", values.Extriorfiles[i]);
      }
    }
    if (values.Intriorfiles.length > 0) {
      for (let i = 0; i < values.Intriorfiles.length; ++i) {
        formData.append("interiorImages", values.Intriorfiles[i]);
      }
    }
    loadingContext.setIsLoading(true);
    if (values.vin) {
      const vinRes = await validateVINNumber(values.vin);
      if (!vinRes?.vin) {
        loadingContext.setIsLoading(false);
        toastShow(vinRes?.error, "error");
        loadingContext.setIsLoading(false);
        return;
      }
    }
    if(!isUpdating){
      values.isPending=1;
      values.status="PENDING";
    }
    for (const key in values) {
      if (key !== "files" && values[key] != null) {
        if (key === "interiorImages" || key === "exteriorImages") {
          formData.append(key, JSON.stringify(values[key]));
        }
        {
          formData.append(key, values[key]);
        }
      }
    }

    if (isUpdating) {
      formData.append("id", props.id);
      await dispatch(updateUserCarAsync({ id: props.id, formData }));
    } else {
      loadingContext.setIsLoading(true);
      await dispatch(createUserCarAsync({ formData }));
    }

    fetchData();
    loadingContext.setIsLoading(false);
    onSubmit();
  };

  const handleDeleteInteriorImages = (e) => {
    const index = extriorGallery.current.getCurrentIndex();

    if (index >= form.values.interiorImages.length) {
      form.setFieldValue(
        "Intriorfiles",
        form.values.Intriorfiles.filter(
          (_, i) => i !== index - form.values.interiorImages.length
        )
      );
      setFileInteriorImages((prevState) =>
        prevState.filter((_, i) => i !== index)
      );
    } else {
      // Remove from the original images
      form.setFieldValue(
        "interiorImages",
        form.values.interiorImages.filter((_, i) => i !== index)
      );
    }
  };
  const handleDeleteExteriorImages = (e) => {
    const index = extriorGallery.current.getCurrentIndex();

    if (index >= form.values.exteriorImages.length) {
      // Remove from the new files added
      form.setFieldValue(
        "Extriorfiles",
        form.values.Extriorfiles.filter(
          (_, i) => i !== index - form.values.exteriorImages.length
        )
      );
      setFileExteriorImages((prevState) =>
        prevState.filter((_, i) => i !== index)
      );
    } else {
      // Remove from the original images
      form.setFieldValue(
        "exteriorImages",
        form.values.exteriorImages.filter((_, i) => i !== index)
      );
    }
  };
  const handleFileChange = (File) => form.setFieldValue("pdf", File);
  const readCsvFile = () => {
    fetch("/all-csv-files.csv")
      .then((response) => response.text())
      .then((csvText) => {
        Papa.parse(csvText, {
          header: true, // Parses the header row
          complete: (result) => {
            setCsvData(result.data);
            const yearsList = [
              ...new Set(result.data.map((row) => row.year).filter(Boolean)),
            ];
            const sortedYearsList = yearsList.sort((a, b) => b - a);
            setYears(sortedYearsList);
          },
          error: (error) => {
            console.error("Error reading CSV file:", error);
          },
        });
      });
  };
  useEffect(() => {
    readCsvFile();
  }, []);
  const onChangeYear = (value, setFieldValue) => {
    console.log("this is on change year")
    setFieldValue("year", value);
    const filteredMakes = [
      ...new Set(
        csvData.filter((row) => row.year === value).map((row) => row.make)
      ),
    ];
    console.log(filteredMakes,"filteredMakes filteredMakes")
    setCarMaker(filteredMakes);
  };
  const onChangeMake = (value, setFieldValue) => {
    setFieldValue("make", value);
    const filteredModel = [
      ...new Set(
        csvData.filter((row) => row.make === value).map((row) => row.model)
      ),
    ];
    setCarModel(filteredModel);
  };
  const onChangeModel = (value, setFieldValue) => {
    setFieldValue("model", value)
    const filteredModel = csvData
      .filter((row) => row.model === value)
      .map((row) => {
        try {
          return JSON.parse(row.body_styles);
        } catch (e) {
          return [];
        }
      });
    const uniqueBodyStyles = [...new Set(filteredModel.flat())];
    console.log("🚀 ~ onChangeModel ~ filteredModel:", uniqueBodyStyles);
    setCarBodyStyle(uniqueBodyStyles);
  };

  console.log(form.errors,"erorrr")
  // useEffect(() => {
  //   const isUpdated = JSON.stringify(form.values) !== JSON.stringify(initialValues);

  //   if (isUpdated && initialValues.carDataJson)
  //     setIsValueUpdate(true)
  // }, [form.values])
  useEffect(()=>{
    console.log("🚀 ~ useEffect ~ filteredMakes:", form.values.year)

    if(form.values.year){
      const filteredMakes = [...new Set(csvData.filter(row => row.year === (form.values.year.toString())).map(row => row.make))];
      setCarMaker(filteredMakes)
    }
    if(form.values.make){
      const filteredModel = [...new Set(csvData.filter(row => row.make === form.values.make).map(row => row.model))];
      setCarModel(filteredModel)
    }
    if(form.values.model){
        const filteredModel = csvData
      .filter(row => row.model === form.values.model)
      .map(row => {
        try {
          return JSON.parse(row.body_styles);
        } catch (e) {
          return [];
        }
      });
      const uniqueBodyStyles = [...new Set(filteredModel.flat())];
        setCarBodyStyle(uniqueBodyStyles)
    }
  },[csvData])
  const renderSelectOption = ({ option }) => (
    <Group gap="sm">
      <Box w={30} h={30} bg={option.value} style={{ borderRadius: '50%'}} />
      <Text size="sm">{option.label}</Text>
    </Group>
  );
  return (
    <Box px="lg">
      {share && <CopyModal url={props?.slug} setShare={setShare} />}
      <form onSubmit={form.onSubmit(handleFormSubmit)}>
        <Stack>
          {props.hasOwnProperty("id") && (
            <Group justify="end" mt="xl" mb={"10px"}>
              <Button
                onClick={() => {
                  setShare(true);
                }}
              >
                <Text pr={"5px"}> Share </Text> <IconShare />
              </Button>
            </Group>
          )}
          <Grid>
            <Grid.Col span={{ base: 12, md: 6 }}>
              <Text
                style={{
                  fontSize: "20px",
                  fontWeight: "bolder",
                }}
              >
                Interior Images
              </Text>
              <ActionIcon
                color={"red"}
                onClick={handleDeleteInteriorImages}
                title="Delete current Image"
                style={{
                  top: "80px",
                  marginTop: "-60px",
                  left: "20px",
                  zIndex: 100,
                }}
              >
                <IconTrash size={18} stroke={2.5} />
              </ActionIcon>
              <ImageGallery
                items={carInteriorImages}
                ref={intriorGallery}
                showNav={false}
              />
              <DropzoneButton
                onChange={(files) => {
                  const fileImgs = files.map((file) => {
                    const imageUrl = URL.createObjectURL(file);
                    return {
                      original: imageUrl,
                      thumbnail: imageUrl,
                    };
                  });
                  setFileInteriorImages(fileImgs);
                  form.setFieldValue("Intriorfiles", files);
                }}
              />
            </Grid.Col>
            <Grid.Col span={{ base: 12, md: 6 }}>
              <Text
                style={{
                  fontSize: "20px",
                  fontWeight: "bolder",
                }}
              >
                Exterior Images
              </Text>
              <ActionIcon
                color={"red"}
                onClick={handleDeleteExteriorImages}
                title="Delete current Image"
                style={{
                  top: "80px",
                  marginTop: "-60px",
                  left: "20px",
                  zIndex: 100,
                }}
              >
                <IconTrash size={18} stroke={2.5} />
              </ActionIcon>
              <ImageGallery
                items={carExtriorImages}
                ref={extriorGallery}
                showNav={false}
              />
              <DropzoneButton
                onChange={(files) => {
                  const fileImgs = files.map((file) => {
                    const imageUrl = URL.createObjectURL(file);
                    return {
                      original: imageUrl,
                      thumbnail: imageUrl,
                    };
                  });
                  setFileExteriorImages(fileImgs);
                  form.setFieldValue("Extriorfiles", files);
                }}
              />
            </Grid.Col>
          </Grid>
          <CustomRichTextEdit
            value={form?.values?.specs}
            onChange={(val) => form.setFieldValue("specs", val)}
          />
          <Grid>
            <Grid.Col span={{ base: 12, md: 4 }}>
              {/* <NumberInput
                required
                label="Year"
                placeholder="1930 ~ 2024"
                value={form.values.year}
                onChange={(value) => form.setFieldValue("year", value)}
                radius="md"
                {...form.getInputProps("year")}
              /> */}
              {years.length > 0 && (
                <Select
                  required
                  label="Year"
                  placeholder="Select Year"
                  data={years}
                  value={form.values.year}
                  onChange={(value) => onChangeYear(value, form.setFieldValue)}
                  allowDeselect={false}
                />
              )}
            </Grid.Col>
            <Grid.Col span={{ base: 12, md: 4 }}>
              {/* <TextInput
                required
                label="Make"
                placeholder="Make of this car"
                value={form.values.make}
                onChange={(event) =>
                  form.setFieldValue("make", event.currentTarget.value)
                }
                radius="md"
              /> */}
              <Select
                required
                label="Make"
                placeholder="Select Make of this car"
                data={carMaker}
                value={form.values.make}
                onChange={(value) => onChangeMake(value, form.setFieldValue)}
                allowDeselect={false}

              />
            </Grid.Col>

            <Grid.Col span={{ base: 12, md: 4 }}>
              {/* <TextInput
                required
                label="Model"
                placeholder="Model of the make"
                value={form.values.model}
                onChange={(event) =>
                  form.setFieldValue("model", event.currentTarget.value)
                }
                radius="md"
          
              /> */}
              <Select
                required
                label="Model"
                placeholder="Model of the make"
                data={carModel}
                value={form.values.model}
                onChange={(value) => onChangeModel(value, form.setFieldValue)}
                allowDeselect={false}

              />
            </Grid.Col>
          </Grid>

          <Grid>
            <Grid.Col span={{ base: 12, md: 4 }}>
              <TextInput
                required
                label="VIN"
                placeholder="VIN Number"
                value={form.values.vin}
                onChange={(event) =>
                  form.setFieldValue("vin", event.currentTarget.value)
                }
                radius="md"
                {...form.getInputProps("vin")}
              />
            </Grid.Col>
            <Grid.Col span={{ base: 12, md: 4 }}>
              <TextInput
                required
                label="Lot"
                placeholder="Lot number"
                value={form.values.lot}
                onChange={(event) =>
                  form.setFieldValue("lot", event.currentTarget.value)
                }
                radius="md"
              />
            </Grid.Col>
            <Grid.Col span={{ base: 12, md: 4 }}>
              {/* <TextInput
                required
                label="Color"
                placeholder="Color of this car"
                value={form.values.color}
                onChange={(event) =>
                  form.setFieldValue("color", event.currentTarget.value)
                }
                radius="md"
              /> */}
              <Select
                required
                label="Color"
                placeholder="Color of this car"
                data={carColors}
                value={form.values.color}
                onChange={(value)=>form.setFieldValue('color',value)}
                allowDeselect={false}
                renderOption={renderSelectOption}
              />
            </Grid.Col>
          </Grid>

          <Grid>
            <Grid.Col span={{ base: 12, md: 4 }}>
              <TextInput
                label="Engine #"
                placeholder="Engine Number"
                value={form.values.engine}
                onChange={(event) =>
                  form.setFieldValue("engine", event.currentTarget.value)
                }
                radius="md"
              />
            </Grid.Col>
            <Grid.Col span={{ base: 12, md: 4 }}>
              <NumberInput
                required
                label="Doors"
                value={form.values.doors}
                onChange={(value) => form.setFieldValue("doors", value)}
                radius="md"
                placeholder="Enter doors between 2 to 8"
                {...form.getInputProps("doors")}
              />
            </Grid.Col>
            <Grid.Col span={{ base: 12, md: 4 }}>
              <NumberInput
                required
                label="Seats"
                placeholder="Seats between 2 to 8"
                value={form.values.seats}
                onChange={(value) => form.setFieldValue("seats", value)}
                radius="md"
                {...form.getInputProps("seats")}
              />
            </Grid.Col>
          </Grid>

          <Grid>
            <Grid.Col span={{ base: 12, md: 4 }}>
              <NumberInput
                required
                label="Mileage"
                placeholder="Enter mileage"
                step={100}
                value={form.values.mileage}
                onChange={(value) => form.setFieldValue("mileage", value)}
                radius="md"
              />
            </Grid.Col>
            <Grid.Col span={{ base: 12, md: 4 }}>
              <NumberInput
                required
                label="Price"
                placeholder="Price $"
                step={100}
                value={currencyFormater(form.values.price)}
                onChange={(value) => form.setFieldValue("price", value)}
                radius="md"
                {...form.getInputProps("price")}
              />
            </Grid.Col>
            <Grid.Col span={{ base: 12, md: 4 }}>
              {/* <TextInput
                label="Transmission"
                placeholder="Enter transmission"
                value={form.values.transmission}
                onChange={(event) =>
                  form.setFieldValue("transmission", event.currentTarget.value)
                }
                radius="md"
              /> */}
              <Select
                required
                label="Transmission"
                placeholder="Select transmission"
                data={transmission}
                value={form.values.transmission}
                onChange={(value) => form.setFieldValue("transmission", value)}
                allowDeselect={false}

              />
            </Grid.Col>
            <Grid.Col span={{ base: 12, md: 4 }}>
              <TextInput
                label="Cylinders"
                placeholder="Enter cylinder"
                value={form.values.cylinders}
                onChange={(event) =>
                  form.setFieldValue("cylinders", event.currentTarget.value)
                }
                radius="md"
              />
            </Grid.Col>
            <Grid.Col span={{ base: 12, md: 4 }}>
              {/* <TextInput
                label="Body Style"
                placeholder="Enter body style"
                value={form.values.bodyStyle}
                onChange={(event) =>
                  form.setFieldValue("bodyStyle", event.currentTarget.value)
                }
                radius="md"
              /> */}
              <Select
                required
                label="Body Style"
                placeholder="Select body style of this car"
                data={carBodyStyle}
                value={form.values.bodyStyle}
                onChange={(value) => form.setFieldValue("bodyStyle", value)}
                allowDeselect={false}

              />
            </Grid.Col>
            <Grid.Col span={{ base: 12, md: 4 }}>
              {/* <TextInput
                label="Fuel Type"
                placeholder="Enter fuel type"
                value={form.values.fuelType}
                onChange={(event) =>
                  form.setFieldValue("fuelType", event.currentTarget.value)
                }
                radius="md"
              /> */}
              <Select
                required
                label="Fuel Type"
                placeholder="Select fuel type"
                data={fuelType}
                value={form.values.fuelType}
                onChange={(value) => form.setFieldValue("fuelType", value)}
                allowDeselect={false}

              />
            </Grid.Col>
            <Grid.Col span={{ base: 12, md: 4 }}>
              {/* <TextInput
                label="Drive Type"
                placeholder="Enter drive type"
                value={form.values.driveType}
                onChange={(event) =>
                  form.setFieldValue("driveType", event.currentTarget.value)
                }
                radius="md"
              /> */}
              <Select
                required
                label="Drive Type"
                placeholder="Select drive type"
                data={driveType}
                value={form.values.driveType}
                onChange={(value) => form.setFieldValue("driveType", value)}
                allowDeselect={false}

              />
            </Grid.Col>
            <Grid.Col span={{ base: 12, md: 4 }}>
              <TextInput
                label="Company Name"
                placeholder="Enter company name"
                value={form.values.companyName}
                onChange={(event) =>
                  form.setFieldValue("companyName", event.currentTarget.value)
                }
                radius="md"
              />
            </Grid.Col>
            <Grid.Col span={{ base: 12, md: 4 }}>
              <Input.Wrapper label="Company Logo">
                <Input
                  type="file"
                  placeholder="Select company logo"
                  accept="image/png,image/jpeg"
                  onChange={(e) => {
                    console.log(e.target.files[0]);
                    form.setFieldValue("companyImage", e.target.files[0]);
                  }}
                  radius="md"
                />
              </Input.Wrapper>
            </Grid.Col>
          </Grid>

          <Grid>
            <Grid.Col span={{ base: 12, md: 4 }}>
              <Input.Wrapper label="Location">
                <Input
                  placeholder="Enter Location"
                  value={form.values.location}
                  onChange={(e) => {
                    form.setFieldValue("location", e.target.value);
                  }}
                  radius="md"
                />
              </Input.Wrapper>
            </Grid.Col>
            <Grid.Col span={{ base: 12, md: 4 }}>
              <Select
                required
                label="Driver Side"
                placeholder="Select Driver Side"
                data={driveSide}
                value={form.values.driveSide}
                onChange={(value) => form.setFieldValue("driveSide", value)}
                allowDeselect={false}
              />
            </Grid.Col>
            <Grid.Col span={{ base: 12, md: 4 }}>
              <Select
                required
                label="Vehicle Type"
                placeholder="Select Vehicle Type"
                data={vehicleType}
                value={form.values.vehicleType}
                onChange={(value) => form.setFieldValue("vehicleType", value)}
                allowDeselect={false}
              />
            </Grid.Col>
            <Grid.Col span={{ base: 12, md: 4 }}>
              <Input.Wrapper label="Phone Number">
                <Input
                  className="PhoneInputInput"
                  placeholder="Enter phone number"
                  value={form.values.phoneNumber}
                  onChange={(value) => {
                    if (typeof value === "string")
                      form.setFieldValue("phoneNumber", value);
                  }}
                  radius="md"
                  {...form.getInputProps("phoneNumber")}
                />
              </Input.Wrapper>
            </Grid.Col>
            <Grid.Col span={{ base: 12, md: 4 }}>
              <Input.Wrapper label="Car Details">
                <br />
                <FileButton
                  onChange={(File) => {
                    handleFileChange(File);
                  }}
                  accept="application/pdf"
                >
                  {(props) => (
                    <Button {...props}>
                      {" "}
                      {!form.values.pdf ? "Upload pdf" : form.values.pdf.name}
                    </Button>
                  )}
                </FileButton>
              </Input.Wrapper>
            </Grid.Col>
          </Grid>
        </Stack>

        <Group justify="end" mt="xl">
          {!initialValues.isPending && isUpdating ? (
            <Button radius="xl" type="submit">
              Update
            </Button>
          ) : !isUpdating ? (
            <Button
              radius="xl"
              type="submit"
            // onClick={() => opened()}
            >
              Create
            </Button>
          ) : (
            <Text>Waiting for last update approval</Text>
          )}
        </Group>
      </form>
    </Box>
  );
}
