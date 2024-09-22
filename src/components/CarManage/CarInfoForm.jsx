import { Group, Grid, ScrollArea, Button, Image, Box, Stack, TextInput, ActionIcon, NumberInput, Select, Divider, Modal, FileButton, Text, Input } from '@mantine/core';
import { useCarDispatch, createCarAsync, updateCarAsync, fetchCarsAsync } from '@/redux/carsSlice';
import { carStatus, currencyFormater, fallBackURL600 } from '@/constants/data';
import { useLoadingContext } from '@/providers/LoadingProvider';
import { IconShare, IconTrash, } from "@tabler/icons-react";
import { CustomRichTextEdit } from './CustomRichTextEdit';
import { initialPriceRange } from '@/constants/data';
import { DropzoneButton } from './DropzoneButton';
import InvoiceTemplate from './InvoiceTemplate';
import { useDisclosure } from '@mantine/hooks';
import ImageGallery from "react-image-gallery";
import { addressToString } from '@/helpers';
import { DateInput, } from '@mantine/dates';
import { useRef, useState } from 'react';
import { userService } from '@/services';
import { useForm } from '@mantine/form';
import CopyModal from './CopyModal';

export default function CarInfoForm(props) {
  const dispatch = useCarDispatch();
  const [fileImages, setFileImages] = useState([]);
  const [opened, { open, close }] = useDisclosure(false);
  const [type, setType] = useState(props.type);
  const [invoiceCarId, setInvoiceCarId] = useState(0);
  const [share, setShare] = useState(false)
  const { onSubmit } = props;
  const gallery = useRef(null);

  const isUpdating = props.hasOwnProperty('id');
  const loadingContext = useLoadingContext();

  const form = useForm({
    initialValues: {
      files: [],
      images: isUpdating ? JSON.parse(props.images) : [],
      year: props?.year,
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
      specs: props?.specs,
      engine: props?.engine,
      referal: props?.referal,
      status: props?.status || carStatus[0],
      bidPrice: props?.bidPrice,
      bidDeadline: props?.bidDeadline ? new Date(props?.bidDeadline) : null,
      pdf: props?.pdf,
      initialBidPrice: props?.initialBidPrice,
      companyName: props?.companyName,
      companyImage: props?.companyImage ? props?.companyImage : "",
      bodyStyle: props?.bodyStyle,
      fuelType: props?.fuelType,
      driveType: props?.driveType,
      bodyStyle: props?.bodyStyle,
      cylinders: props?.cylinders,
      slug: props?.slug,
      purchaseSteps: props?.purchaseSteps,
      autoBid: props?.autoBid ? JSON.stringify(props.autoBid) : "",
      winBox: props?.winBox,
      location: props?.location,
      isPending: props?.isPending ? props?.isPending : userService.userValue?.role === "ADMIN" ? false : true

    },

    validate: {
      year: (value) => {
        if (value < 1930 || value > new Date().getFullYear() || value.toString().includes('.')) {
          return `Please enter a whole number year between 1930 and ${new Date().getFullYear()}`;
        }
        return null;
      },
      price: (value) => {
        if (value < initialPriceRange[0] || value > initialPriceRange[1] || value.toString().includes('.')) {
          return `Please enter a whole number price between ${initialPriceRange[0]} and ${initialPriceRange[1]}`;
        }
        return null;
      },
      doors: (value) => {
        if (value < 2 || value > 8 || value.toString().includes('.')) {
          return `Please enter a whole number doors between 2 and 8`;
        }
        return null;
      },
      seats: (value) => {
        if (value < 2 || value > 8 || value.toString().includes('.')) {
          return `Please enter a whole number seats between 2 and 8`;
        }
        return null;
      },
      make: (value) => (value ? null : 'Please enter a make'),
      model: (value) => (value ? null : 'Please enter a model'),
      lot: (value) => (value ? null : 'Please enter a lot number'),
      color: (value) => (value ? null : 'Please enter a color'),
    },
  });

  const urlImages = form.values.images.map((image) => ({
    original: image,
    thumbnail: image,
  }));
  let carImages = [
    ...urlImages,
    ...fileImages,
  ];
  if (carImages.length === 0)
    carImages = [
      {
        original: "https://placehold.co/640x480?text=NoImage",
        thumbnail: "https://placehold.co/320x240?text=NoImage",
      }
    ];

  const handleFormSubmit = async (values) => {
    const formData = new FormData();
    if (values.files.length > 0) {
      for (let i = 0; i < values.files.length; ++i)
        formData.append('images', values.files[i]);
    }
    for (const key in values) {
      if (key === "referal") {
        if (type !== "Random")
          formData.append(key, values[key]);
      }
      else if (key != 'files' && values[key] != null) {
        if (key === 'images') {
          formData.append(key, JSON.stringify(values[key]));
        } else {
          formData.append(key, values[key]);
        }
      }
    }
    if (isUpdating) {
      formData.append('id', props.id);
      loadingContext.setIsLoading(true);
      await dispatch(updateCarAsync({ formData }));
    } else {
      form.values.bidPrice && formData.append('initialBidPrice', form.values.bidPrice)

      loadingContext.setIsLoading(true);
      await dispatch(createCarAsync({ formData }));
    }
    dispatch(fetchCarsAsync({ referal: "ALL" }))
    loadingContext.setIsLoading(false);

    onSubmit();
  }

  const handleDeleteImage = (e) => {
    const index = gallery.current.getCurrentIndex();

    if (index >= form.values.images.length) {
      // Remove from the new files added
      form.setFieldValue(
        'files',
        form.values.files.filter((_, i) => i !== (index - form.values.images.length))
      );
      setFileImages((prevState) => prevState.filter((_, i) => i !== index));
    } else {
      // Remove from the original images
      form.setFieldValue(
        'images',
        form.values.images.filter((_, i) => i !== index)
      );
    }
  };

  const handleFileChange = (File) => {
    form.setFieldValue('pdf', File)
  }

  const bidder = props?.User;

  return (
    <Box px="lg">
      <Modal
        size="auto"
        opened={opened}
        onClose={close}
        overlayProps={{
          backgroundOpacity: 0.55,
          blur: 3,
        }}
        title="Invoice"
        centered
      >
        <ScrollArea h="calc(100vh - 200px)">
          <InvoiceTemplate carId={invoiceCarId} />
        </ScrollArea>
      </Modal>

      {share && <CopyModal url={props?.slug} setShare={setShare} />}
      <form onSubmit={form.onSubmit(handleFormSubmit)}>

        <Stack>
          {props.hasOwnProperty('id') &&
            <Group justify="end" mt="xl" mb={"10px"}>
              <Button onClick={() => {
                setShare(true)
              }
              }>
                <Text pr={"5px"}> Share </Text>  <IconShare />
              </Button>
            </Group>
          }
          <ActionIcon
            color={'red'}
            onClick={handleDeleteImage}
            title="Delete current Image"
            style={{ top: "80px", marginTop: "-60px", left: "20px", zIndex: 100 }}
          >
            <IconTrash size={18} stroke={2.5} />
          </ActionIcon>
          <ImageGallery items={carImages} ref={gallery} showNav={false} />
          <DropzoneButton onChange={(files) => {
            const fileImgs = files.map((file) => {
              const imageUrl = URL.createObjectURL(file);
              return {
                original: imageUrl,
                thumbnail: imageUrl,
              };
            });
            setFileImages(fileImgs);

            form.setFieldValue('files', files)
          }} />

          <CustomRichTextEdit value={form.values.specs} onChange={(val) => form.setFieldValue('specs', val)} />
          <Grid>
            <Grid.Col span={{ base: 12, md: 4 }}>
              <Select
                required
                label="Car Type"
                data={['Random', 'Target']}
                value={type}
                onChange={setType}
                allowDeselect={false}
              />
            </Grid.Col>
            <Grid.Col span={{ base: 12, md: 4 }}>
              <TextInput
                required
                label="Referral Code"
                value={form.values.referal}
                onChange={(event) => form.setFieldValue('referal', event.currentTarget.value)}
                disabled={type != 'Target'}
              />
            </Grid.Col>
            <Grid.Col span={{ base: 12, md: 4 }}>
              <br />
              <FileButton
                onChange={(File) => {
                  handleFileChange(File)
                }} accept="application/pdf">
                {(props) => <Button {...props}>Upload pdf</Button>}
              </FileButton>
            </Grid.Col>
            <Grid.Col span={{ base: 12, md: 4 }}>
              <NumberInput
                required
                label="Year"
                placeholder="1930 ~ 2024"
                value={form.values.year}
                onChange={(value) => form.setFieldValue('year', value)}
                radius="md"
                {...form.getInputProps('year')}
              />
            </Grid.Col>
            <Grid.Col span={{ base: 12, md: 4 }}>
              <TextInput
                required
                label="Make"
                placeholder="Make of this car"
                value={form.values.make}
                onChange={(event) => form.setFieldValue('make', event.currentTarget.value)}
                radius="md"
              />
            </Grid.Col>
            <Grid.Col span={{ base: 12, md: 4 }}>
              <TextInput
                required
                label="Model"
                placeholder="Model of the make"
                value={form.values.model}
                onChange={(event) => form.setFieldValue('model', event.currentTarget.value)}
                radius="md"
              />
            </Grid.Col>
          </Grid>

          <Grid>
            <Grid.Col span={{ base: 12, md: 4 }}>
              <TextInput
                label="VIN"
                placeholder="VIN Number"
                value={form.values.vin}
                onChange={(event) => form.setFieldValue('vin', event.currentTarget.value)}
                radius="md"
              />
            </Grid.Col>
            <Grid.Col span={{ base: 12, md: 4 }}>
              <TextInput
                required
                label="Lot"
                placeholder="Lot number"
                value={form.values.lot}
                onChange={(event) => form.setFieldValue('lot', event.currentTarget.value)}
                radius="md"
              />
            </Grid.Col>
            <Grid.Col span={{ base: 12, md: 4 }}>
              <TextInput
                required
                label="Color"
                placeholder="Color of this car"
                value={form.values.color}
                onChange={(event) => form.setFieldValue('color', event.currentTarget.value)}
                radius="md"
              />
            </Grid.Col>
          </Grid>

          <Grid>
            <Grid.Col span={{ base: 12, md: 4 }}>
              <TextInput
                label="Engine #"
                placeholder="Engine Number"
                value={form.values.engine}
                onChange={(event) => form.setFieldValue('engine', event.currentTarget.value)}
                radius="md"
              />
            </Grid.Col>
            <Grid.Col span={{ base: 12, md: 4 }}>
              <NumberInput
                required
                label="Doors"
                value={form.values.doors}
                onChange={(value) => form.setFieldValue('doors', value)}
                radius="md"
                placeholder="Enter doors between 2 to 8"
                {...form.getInputProps('doors')}

              />
            </Grid.Col>
            <Grid.Col span={{ base: 12, md: 4 }}>
              <NumberInput
                required
                label="Seats"
                placeholder="Seats between 2 to 8"
                value={form.values.seats}
                onChange={(value) => form.setFieldValue('seats', value)}
                radius="md"
                {...form.getInputProps('seats')}
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
                onChange={(value) => form.setFieldValue('mileage', value)}
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
                onChange={(value) => form.setFieldValue('price', value)}
                radius="md"
                {...form.getInputProps('price')}
              />
            </Grid.Col>
            <Grid.Col span={{ base: 12, md: 4 }}>
              <TextInput
                label="Transmission"
                placeholder="Enter transmission"
                value={form.values.transmission}
                onChange={(event) => form.setFieldValue('transmission', event.currentTarget.value)}
                radius="md"
              />
            </Grid.Col>
            <Grid.Col span={{ base: 12, md: 4 }}>
              <TextInput
                label="Cylinders"
                placeholder="Enter cylinder"
                value={form.values.cylinders}
                onChange={(event) => form.setFieldValue('cylinders', event.currentTarget.value)}
                radius="md"
              />
            </Grid.Col>
            <Grid.Col span={{ base: 12, md: 4 }}>
              <TextInput
                label="Body Style"
                placeholder="Enter body style"
                value={form.values.bodyStyle}
                onChange={(event) => form.setFieldValue('bodyStyle', event.currentTarget.value)}
                radius="md"
              />
            </Grid.Col>
            <Grid.Col span={{ base: 12, md: 4 }}>
              <TextInput
                label="Fuel Type"
                placeholder="Enter fuel type"
                value={form.values.fuelType}
                onChange={(event) => form.setFieldValue('fuelType', event.currentTarget.value)}
                radius="md"
              />
            </Grid.Col>
            <Grid.Col span={{ base: 12, md: 4 }}>
              <TextInput
                label="Drive Type"
                placeholder="Enter drive type"
                value={form.values.driveType}
                onChange={(event) => form.setFieldValue('driveType', event.currentTarget.value)}
                radius="md"
              />
            </Grid.Col>
            <Grid.Col span={{ base: 12, md: 4 }}>
              <TextInput
                label="Company Name"
                placeholder="Enter company name"
                value={form.values.companyName}
                onChange={(event) => form.setFieldValue('companyName', event.currentTarget.value)}
                radius="md"
              />
            </Grid.Col>
            <Grid.Col span={{ base: 12, md: 4 }}>
              <Input.Wrapper label="Company Logo">

                <Input
                  type='file'
                  placeholder="Select company logo"
                  accept="image/png,image/jpeg"
                  onChange={(e) => {
                    console.log(e.target.files[0])
                    form.setFieldValue('companyImage', e.target.files[0])
                  }}
                  radius="md"
                />
              </Input.Wrapper>
            </Grid.Col>
          </Grid>

          <Grid>
            <Grid.Col span={{ base: 12, md: 4 }}>
              <Select
                required
                label="Status"
                data={carStatus}
                value={form.values.status}
                onChange={(value) => form.setFieldValue('status', value)}
                allowDeselect={false}
              />
            </Grid.Col>
            <Grid.Col span={{ base: 12, md: 4 }}>
              <NumberInput
                required
                label="Starting Bid Price"
                placeholder="$ Min Bid Price"
                value={currencyFormater(form.values.bidPrice)}
                step={100}
                min={100}
                onChange={(value) => {
                  const floatValue = parseFloat(value); // Convert the input value to a floating-point number
                  const roundedValue = Number.isInteger(floatValue) ? floatValue : Math.round(floatValue);
                  form.setFieldValue('bidPrice', roundedValue);
                  if (!props?.User) {
                    form.setFieldValue('initialBidPrice', roundedValue);

                  }
                }}

                disabled={form.values.status != 'LIVE' || props?.User}
              />
            </Grid.Col>
            <Grid.Col span={{ base: 12, md: 4 }}>
              <DateInput
                minDate={new Date()}
                required
                label="Bid Ending Time"
                placeholder="Bid Ending Time"
                value={form.values.bidDeadline}
                onChange={(value) => {
                  const selectedDate = new Date(value);
                  selectedDate.setHours(23, 59, 0, 0); // Set the time to 11:59 PM
                  form.setFieldValue('bidDeadline', selectedDate);
                }}

                disabled={form.values.status != 'LIVE'}
              />
            </Grid.Col>
          </Grid>
          <Grid>
            <Grid.Col span={{ base: 12, md: 4 }}>
              <Input.Wrapper label="Location">

                <Input
                  placeholder="Enter Location"
                  value={form.values.location}
                  onChange={(e) => {
                    form.setFieldValue('location', e.target.value)
                  }}
                  radius="md"
                />
              </Input.Wrapper>
            </Grid.Col>
          </Grid>
        </Stack>

        <Group justify="end" mt="xl">
          <Button radius="xl" type="submit">
            {isUpdating ? "Update" : "Create"}
          </Button>
        </Group>
      </form>

      {(bidder) &&
        <Stack>
          <Divider label="Bidder Information" labelPosition="center" my="lg" />
          <Grid>
            <Grid.Col span={4}>
              <Image src={bidder?.image1} alt="card1" radius={10} mx="auto"
                fallbackSrc={fallBackURL600} />
            </Grid.Col>
            <Grid.Col span={4}>
            </Grid.Col>
            <Grid.Col span={4}>
              <Image src={bidder?.image2} alt="card2" radius={10} mx="auto"
                fallbackSrc={fallBackURL600} />
            </Grid.Col>
            <Grid.Col span={{ base: 12, md: 12 }}>
              <TextInput
                label="Bidded Price"
                placeholder="No bid yet"
                value={currencyFormater(props?.bidPrice)}
                radius="md"
                readOnly
                disabled
                required
              />
            </Grid.Col>
            <Grid.Col span={{ base: 12, md: 4 }}>
              <TextInput
                label="First Name"
                value={bidder.firstName}
                radius="md"
                readOnly
                disabled
                required
              />
            </Grid.Col>

            <Grid.Col span={{ base: 12, md: 4 }}>
              <TextInput
                label="Last Name"
                value={bidder.lastName}
                radius="md"
                readOnly
                disabled
                required
              />
            </Grid.Col>
            <Grid.Col span={{ base: 12, md: 4 }}>
              <TextInput
                required
                label="Email"
                value={bidder?.email}
                radius="md"
                readOnly
                disabled
              />
            </Grid.Col>
            <Grid.Col span={{ base: 12, md: 4 }}>
              <TextInput
                required
                label="Phone"
                value={bidder?.phone}
                radius="md"
                readOnly
                disabled
              />
            </Grid.Col>
            <Grid.Col span={{ base: 12, md: 4 }}>
              <TextInput
                required
                label="Address"
                value={addressToString(bidder?.address)}
                radius="md"
                readOnly
                disabled
              />
            </Grid.Col>

          </Grid>
          <Group justify="end" mt="xl">
            <Button radius="xl" disabled={props?.status !== 'ENDED'}
              onClick={() => {
                if (!props?.invoiceSent) {
                  const formData = new FormData();
                  formData.append('id', props.id);
                  formData.append('invoiceSent', new Date());
                  formData.append('referal', props?.referal);
                  dispatch(updateCarAsync({ formData }));
                }
                open(); setInvoiceCarId(props?.id);
              }}>
              {!props?.invoiceSent ? "Send Invoice" : `Invoice Sent on ${new Date(props?.invoiceSent).toDateString()}`}
            </Button>
          </Group>
        </Stack>}
    </Box>
  );
};
