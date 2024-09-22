import {
	carColors, initialPriceRange, initialMileRange, driveType,
	fuelType,
	transmission,
	vehicleType,
	driveSide,
} from '@/constants/data';
import { Box, Button, Container, Divider, Grid, Group, Image, Input, Modal, NumberInput, Select, Stack, Text, TextInput, Title } from '@mantine/core'
import { useDisclosure } from '@mantine/hooks';
import { IconEdit } from '@tabler/icons-react'
import React, { useEffect, useState } from 'react'
import { userService, userCarService } from "@/services";
import { useForm } from "@mantine/form";
import { toastShow } from "@/helpers";
import { carStatus } from '@/constants/data';
import { currencyFormater } from "@/constants/data";
import Papa from "papaparse";
const Overview = ({ dark, carData }) => {
	const [opened, { open, close }] = useDisclosure(false);
	const [loader, setLoader] = useState(false)
	const [carMaker, setCarMaker] = useState([]);
	const [carModel, setCarModel] = useState([]);
	const [years, setYears] = useState([]);
	const [csvData, setCsvData] = useState([]);
	const [carBodyStyle, setCarBodyStyle] = useState([]);

	const renderSelectOption = ({ option }) => (
		<Group gap="sm">
			<Box w={30} h={30} bg={option.value} style={{ borderRadius: '50%' }} />
			<Text size="sm">{option.label}</Text>
		</Group>
	);
	const form = useForm({
		initialValues: {
			id: carData?.id,
			year: carData?.year ? carData.year.toString() : "",
			make: carData?.make,
			model: carData?.model,
			vin: carData?.vin,
			lot: carData?.lot,
			color: carData?.color,
			price: carData?.price,
			mileage: carData?.mileage,
			doors: carData?.doors,
			seats: carData?.seats,
			transmission: carData?.transmission,
			driveSide: carData?.driveSide,
			vehicleType: carData?.vehicleType,
			specs: carData?.specs,
			engine: carData?.engine,
			referal: carData?.referal,
			status: carData?.status || carStatus[0],
			bidPrice: carData?.bidPrice,
			bidDeadline: carData?.bidDeadline ? new Date(carData?.bidDeadline) : null,
			pdf: carData?.pdf,
			initialBidPrice: carData?.initialBidPrice,
			companyName: carData?.companyName,
			companyImage: carData?.companyImage ? carData?.companyImage : "",
			bodyStyle: carData?.bodyStyle,
			fuelType: carData?.fuelType,
			driveType: carData?.driveType,
			bodyStyle: carData?.bodyStyle,
			cylinders: carData?.cylinders,
			slug: carData?.slug,
			purchaseSteps: carData?.purchaseSteps,
			autoBid: carData?.autoBid ? JSON.stringify(carData.autoBid) : "",
			winBox: carData?.winBox,
			location: carData?.location,
			isPending: carData?.isPending,
		},

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
			mileage: (value) => {
				if (
					value < initialMileRange[0] ||
					value > initialMileRange[1] ||
					value.toString().includes(".")
				) {
					return `Please enter a whole number mileage between ${initialMileRange[0]} and ${initialMileRange[1]}`;
				}
				return null;
			},
			doors: (value) => {
				const numberValue = Number(value);

				if (!value || isNaN(numberValue) || numberValue < 2 || numberValue > 8 || value.toString().includes(".")) {
					return `Please enter a whole number doors between 2 and 8`;
				}
				return null;
			},
			seats: (value) => {
				if (value=="" || value < 2 || value > 8 || value.toString().includes(".")) {
					return `Please enter a whole number seats between 2 and 8`;
				}
				return null;
			},
			make: (value) => (value ? null : "Please enter a make"),
			model: (value) => (value ? null : "Please enter a model"),
			color: (value) => (value ? null : "Please enter a color"),
			fuelType: (value) => (value ? null : "Please enter a fuel type"),
			bodyStyle: (value) => (value ? null : "Please enter a body type"),
			engine: (value) => (value ? null : "Please enter a engine"),
			transmission: (value) => (value ? null : "Please enter a gearbox"),
			driveType: (value) => (value ? null : "Please enter a drive type"),
			vehicleType: (value) => (value ? null : "Please enter a vehicle type"),
			lot: (value) => (value ? null : "Please enter a lot"),


		},
	});
	const readCsvFile = () => {
		fetch("/all-csv-files.csv")
			.then((response) => response.text())
			.then((csvText) => {
				Papa.parse(csvText, {
					header: true, // Parses the header row
					complete: (result) => {
						console.log("🚀 ~ readCsvFile ~ result:", result);
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
	const handleSubmit = async (values) => {
		setLoader(true);
		const formData = new FormData();
		for (const key in values) {
			formData.append(key, values[key]);
		}
		const updateCar = await userCarService.update(values.id, formData);
		if (updateCar) {
			setLoader(false);
			form.setValues(updateCar);
			toastShow("Please wait for admin approval");
			close();
		}

	}
	const onChangeYear = (value, setFieldValue) => {
		setFieldValue("year", value);
		const filteredMakes = [
			...new Set(
				csvData.filter((row) => row.year === value).map((row) => row.make)
			),
		];
		setCarMaker(filteredMakes);
	};
	const onChangeMake = (value, setFieldValue) => {
		setFieldValue("make", value);
		setFieldValue("model", "");
		setCarModel([])
		const filteredModel = [
			...new Set(
				csvData.filter((row) => row.make === value).map((row) => row.model)
			),
		];
		setCarModel(filteredModel);
	};
	const onChangeModel = (value, setFieldValue) => {
		setFieldValue("model", value);
		setFieldValue("bodyStyle", "")
		setCarBodyStyle([]);
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
		setCarBodyStyle(uniqueBodyStyles);
	};
	useEffect(() => {
		readCsvFile()
	}, [])
	useEffect(() => {
		console.log(csvData, "csvData csvData");
		if (form.values.year) {
		  const filteredMakes = [
			...new Set(
			  csvData
				.filter((row) => row.year === form.values.year.toString())
				.map((row) => row.make)
			),
		  ];
		  setCarMaker(filteredMakes);
		}
		if (form.values.make) {
		  const filteredModel = [
			...new Set(
			  csvData
				.filter((row) => row.make === form.values.make)
				.map((row) => row.model)
			),
		  ];
		  setCarModel(filteredModel);
		}
		if (form.values.model) {
		  const filteredModel = csvData
			.filter((row) => row.model === form.values.model)
			.map((row) => {
			  try {
				return JSON.parse(row.body_styles);
			  } catch (e) {
				return [];
			  }
			});
		  const uniqueBodyStyles = [...new Set(filteredModel.flat())];
		  setCarBodyStyle(uniqueBodyStyles);
		}
	  }, [csvData]);
	  console.log("form values",form.values);
	  console.log("form errors",form.errors);

	return (
		<>
			<Modal opened={opened} onClose={close} centered size='lg' radius={25}>
				<form onSubmit={form.onSubmit(handleSubmit)}>
					<Grid>
						<Grid.Col span={{ base: 12, md: 4 }}>
							<Select
								required
								label="Year"
								placeholder="Select Year"
								data={years}
								value={form.values.year}
								onChange={(value) => onChangeYear(value, form.setFieldValue)}
								allowDeselect={false}
								{...form.getInputProps('year')} onBlur={() => form.validateField('year')}
							/>

						</Grid.Col>
						<Grid.Col span={{ base: 12, md: 4 }}>
							<Select
								required
								label="Make"
								placeholder="Select Make of this car"
								data={carMaker}
								value={form.values.make}
								onChange={(value) => onChangeMake(value, form.setFieldValue)}
								allowDeselect={false}
								{...form.getInputProps('make')} onBlur={() => form.validateField('make')}

							/>
						</Grid.Col>
						<Grid.Col span={{ base: 12, md: 4 }}>
							<Select
								required
								label="Model"
								placeholder="Model of the make"
								data={carModel}
								value={form.values.model}
								onChange={(value) => onChangeModel(value, form.setFieldValue)}
								allowDeselect={false}
								{...form.getInputProps('model')} onBlur={() => form.validateField('model')}

							/>
						</Grid.Col>
					</Grid>
					<Grid>
						<Grid.Col span={{ base: 12, md: 4 }}>
							<TextInput
								label="VIN"
								placeholder="VIN Number"
								value={form.values.vin}
								disabled
								onChange={(event) =>
									form.setFieldValue("vin", event.currentTarget.value)
								}
								radius="md"
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
								{...form.getInputProps('lot')} onBlur={() => form.validateField('lot')}

							/>
						</Grid.Col>
						<Grid.Col span={{ base: 12, sm: 4 }}>
							<Select
								required
								label="Color"
								placeholder="Color of this car"
								data={carColors}
								value={form.values.color}
								onChange={(value) => form.setFieldValue('color', value)}
								allowDeselect={false}
								renderOption={renderSelectOption}
								{...form.getInputProps('color')}
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
								{...form.getInputProps('engine')} onBlur={() => form.validateField('engine')}

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
								{...form.getInputProps('doors')} onBlur={() => form.validateField('doors')}

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
								{...form.getInputProps('seats')} onBlur={() => form.validateField('seats')}

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
								{...form.getInputProps('mileage')} onBlur={() => form.validateField('mileage')}

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
								{...form.getInputProps('price')} onBlur={() => form.validateField('price')}

							/>
						</Grid.Col>
						<Grid.Col span={{ base: 12, md: 4 }}>
							<Select
								required
								label="Transmission"
								placeholder="Select transmission"
								data={transmission}
								value={form.values.transmission}
								onChange={(value) => form.setFieldValue("transmission", value)}
								allowDeselect={false}
								{...form.getInputProps('transmission')} onBlur={() => form.validateField('transmission')}

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
								{...form.getInputProps('cylinders')} onBlur={() => form.validateField('cylinders')}

							/>
						</Grid.Col>
						<Grid.Col span={{ base: 12, md: 4 }}>
							{carBodyStyle.length > 0 ? (
								<Select
									required
									label="Body Style"
									placeholder="Select body style of this car"
									data={carBodyStyle}
									value={form.values.bodyStyle}
									onChange={(value) => form.setFieldValue("bodyStyle", value)}
									allowDeselect={false}
									{...form.getInputProps('bodyStyle')} onBlur={() => form.validateField('bodyStyle')}

								/>
							) : (
								<TextInput
									label="Body Style"
									placeholder="Enter body style"
									value={form.values.bodyStyle}
									onChange={(event) =>
										form.setFieldValue("bodyStyle", event.currentTarget.value)
									}
									radius="md"
									{...form.getInputProps('bodyStyle')} onBlur={() => form.validateField('bodyStyle')}

								/>
							)}
						</Grid.Col>
						<Grid.Col span={{ base: 12, md: 4 }}>
							<Select
								required
								label="Fuel Type"
								placeholder="Select fuel type"
								data={fuelType}
								value={form.values.fuelType}
								onChange={(value) => form.setFieldValue("fuelType", value)}
								allowDeselect={false}
								{...form.getInputProps('fuelType')} onBlur={() => form.validateField('fuelType')}

							/>
						</Grid.Col>
						<Grid.Col span={{ base: 12, md: 4 }}>
							<Select
								required
								label="TRACTIUNE"
								placeholder="Select TRACTIUNE"
								data={driveType}
								value={form.values.driveType}
								onChange={(value) => form.setFieldValue("driveType", value)}
								allowDeselect={false}
								{...form.getInputProps('driveType')} onBlur={() => form.validateField('driveType')}

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
								{...form.getInputProps('driveSide')} onBlur={() => form.validateField('driveSide')}

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
								{...form.getInputProps('vehicleType')} onBlur={() => form.validateField('vehicleType')}

							/>
						</Grid.Col>
					</Grid>
					{/* <Grid p={{ base: '20 15 30', sm: '20 40 40' }}>
						
						<Grid.Col span={{ base: 12, sm: 6 }}>
							<Input.Wrapper label="Price" {...form.getInputProps('price')} withAsterisk>
								<Input name='price' {...form.getInputProps('price')} onBlur={() => form.validateField('price')} />
							</Input.Wrapper>
						</Grid.Col>
						<Grid.Col span={{ base: 12, sm: 6 }}>
							<Input.Wrapper label="Mileage" {...form.getInputProps('mileage')} withAsterisk>
								<Input name='mileage' {...form.getInputProps('mileage')} onBlur={() => form.validateField('mileage')} />
							</Input.Wrapper>
						</Grid.Col>
						<Grid.Col span={{ base: 12, sm: 6 }}>
							<Input.Wrapper label="Fuel Type" {...form.getInputProps('fuelType')} withAsterisk>
								<Input name='fuelType' {...form.getInputProps('fuelType')} onBlur={() => form.validateField('fuelType')} />
							</Input.Wrapper>
						</Grid.Col>
						<Grid.Col span={{ base: 12, sm: 6 }}>
							<Input.Wrapper label="Body Type" {...form.getInputProps('bodyStyle')} withAsterisk>
								<Input name='bodyStyle' {...form.getInputProps('bodyStyle')} onBlur={() => form.validateField('bodyStyle')} />
							</Input.Wrapper>
						</Grid.Col>
						<Grid.Col span={{ base: 12, sm: 6 }}>
							<Input.Wrapper label="Engine" {...form.getInputProps('engine')} withAsterisk>
								<Input name='engine' {...form.getInputProps('engine')} onBlur={() => form.validateField('engine')} />
							</Input.Wrapper>
						</Grid.Col>
						<Grid.Col span={{ base: 12, sm: 6 }}>
							<Input.Wrapper label="Transmission" {...form.getInputProps('transmission')} withAsterisk>
								<Input name='transmission' {...form.getInputProps('transmission')} onBlur={() => form.validateField('transmission')} />
							</Input.Wrapper>
						</Grid.Col>
						<Grid.Col span={{ base: 12, sm: 6 }}>
							<Input.Wrapper label="Doors" {...form.getInputProps('doors')} withAsterisk>
								<Input name='doors' {...form.getInputProps('doors')} onBlur={() => form.validateField('doors')} />
							</Input.Wrapper>
						</Grid.Col>
						<Grid.Col span={{ base: 12, sm: 6 }}>
							<Input.Wrapper label="Seats" {...form.getInputProps('seats')} withAsterisk>
								<Input name='seats' {...form.getInputProps('seats')} onBlur={() => form.validateField('seats')} />
							</Input.Wrapper>
						</Grid.Col>
						{/* <Grid.Col span={{ base: 12, sm: 6 }}>
						<Input.Wrapper label="Owners" withAsterisk>
							<Input name='fuelType' {...form.getInputProps('fuelType')} onBlur={() => form.validateField('fuelType')} />
						</Input.Wrapper>
					</Grid.Col> 
						<Grid.Col span={{ base: 12, sm: 6 }}>
							<Select
								required
								label="Color"
								placeholder="Color of this car"
								data={carColors}
								value={form.values.color}
								onChange={(value) => form.setFieldValue('color', value)}
								allowDeselect={false}
								renderOption={renderSelectOption}
								{...form.getInputProps('color')}
							/>
						</Grid.Col>
						<Grid.Col span={{ base: 12, sm: 6 }}>
							{/* <Select
							required
							label="Drive Type"
							placeholder="Select drive type"
							data={driveType}
							value={form.values.driveType}
							onChange={(value) => form.setFieldValue("driveType", value)}
							allowDeselect={false}
							{...form.getInputProps('driveType')}
							
						/> 
							<Input.Wrapper label="Drive Type" {...form.getInputProps('driveType')} withAsterisk>
								<Input name='driveType' {...form.getInputProps('driveType')} onBlur={() => form.validateField('driveType')} />
							</Input.Wrapper>
						</Grid.Col>
						<Grid.Col span={12} mt={{ base: 'sm', sm: 'lg' }} ta='center'>
							<Button w={120} color='#3CDFCD' c='#070000' size='md' radius='xl' type='submit' loading={loader}>
								Save
							</Button>
						</Grid.Col>
					</Grid> */}
					<Grid>
					<Grid.Col span={12} mt={{ base: 'sm', sm: 'lg' }} ta='center'>
						<Button w={120} color='#3CDFCD' c='#070000' size='md' radius='xl' type='submit' loading={loader}>
							Save
						</Button>
					</Grid.Col>
					</Grid>
				</form>
			</Modal>

			<Container size='xl' py={{ base: '50 60', md: '50 100' }} c={dark ? '#fff' : '#000'}>
				<Box w={'45%'} ml='auto' pos={'absolute'} right={20} top={{ base: '0', sm: '-50px' }}>
					<Image src='/assets/multi-cars.png' />
				</Box>
				<Title order={2} fz={{ base: 35, sm: 40, lg: 45 }} mb={{ base: '10', md: '30' }} c={'#3CDFCD'}>
					Overview
				</Title>
				<Group align='center' mb={{ base: '30', md: '40' }}>
					<Text component='span' fz={{ base: '35', sm: '45', md: '60' }} fw='600'>
						{currencyFormater(form.values?.mileage)} Km
					</Text>
					{/* <Button variant='outline' color='#3CDFCD' c={dark ? '#fff`' : '#000'} size='md' ml={{ base: '0', sm: '20'}} radius='xl'
						leftSection={
							<IconEdit width={20} />
						}
					>
						Edit Mileage
					</Button> */}
				</Group>
				<Group grow={true} preventGrowOverflow={false}>
					<Stack gap={{ base: 'sm', md: 'lg' }} align='center'>
						<Title order={5} fz={{ base: '20', md: '24' }} fw={500}>Fuel Type</Title>
						<Text component='span' fz={{ base: '16', md: '20' }}>{form.values?.fuelType}</Text>
					</Stack>
					<Divider orientation="vertical" maw={1} color='#3CDFCD' />
					<Stack gap={{ base: 'sm', md: 'lg' }} align='center'>
						<Title order={5} fz={{ base: '20', md: '24' }} fw={500}>Body Type</Title>
						<Text component='span' fz={{ base: '16', md: '20' }}>{form.values?.bodyStyle}</Text>
					</Stack>
					<Divider orientation="vertical" maw={1} color='#3CDFCD' />
					<Stack gap={{ base: 'sm', md: 'lg' }} align='center'>
						<Title order={5} fz={{ base: '20', md: '24' }} fw={500}>Engine</Title>
						<Text component='span' fz={{ base: '16', md: '20' }}>{form.values?.engine}</Text>
					</Stack>
					<Divider orientation="vertical" maw={1} color='#3CDFCD' />
					<Stack gap={{ base: 'sm', md: 'lg' }} align='center'>
						<Title order={5} fz={{ base: '20', md: '24' }} fw={500}>Transmission</Title>
						<Text component='span' fz={{ base: '16', md: '20' }}>{form.values?.transmission}</Text>
					</Stack>

					<Divider orientation="vertical" maw={1} color='#3CDFCD' />
					<Stack gap={{ base: 'sm', md: 'lg' }} align='center'>
						<Title order={5} fz={{ base: '20', md: '24' }} fw={500}>Doors</Title>
						<Text component='span' fz={{ base: '16', md: '20' }}>{form.values?.doors}</Text>
					</Stack>
					<Divider orientation="vertical" maw={1} color='#3CDFCD' />
					<Stack gap={{ base: 'sm', md: 'lg' }} align='center'>
						<Title order={5} fz={{ base: '20', md: '24' }} fw={500}>Seats</Title>
						<Text component='span' fz={{ base: '16', md: '20' }}>{form.values?.seats}</Text>
					</Stack>
					<Divider orientation="vertical" maw={1} color='#3CDFCD' />
					<Stack gap={{ base: 'sm', md: 'lg' }} align='center'>
						<Title order={5} fz={{ base: '20', md: '24' }} fw={500}>Owners</Title>
						<Text component='span' fz={{ base: '16', md: '20' }}>{userService?.userValue?.firstName} {userService?.userValue?.lastName}</Text>
					</Stack>
					<Button variant='outline' color='#3CDFCD' c={dark ? '#fff' : '#000'} size='lg' radius='xl'
						leftSection={
							<IconEdit width={20} />
						}
						onClick={() => open()}
					>
						Edit
					</Button>
				</Group>
			</Container>
		</>
	)
}

export default Overview