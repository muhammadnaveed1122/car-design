import React, { useEffect, useState } from "react";
import { useMarketplaceCarSelector } from "@/redux/marketplaceSlice";
import { useRouter } from "next/router";
import {
    useCarSelector,
    useCarDispatch,
    fetchCarsAsync,
} from "@/redux/carsSlice";
import {
    Box,
    Button,
    Center,
    Checkbox,
    Flex,
    Grid,
    Group,
    Input,
    Radio,
    RangeSlider,
    Select,
    Text,
    Title,
} from "@mantine/core";
import { YearPickerInput } from "@mantine/dates";
import classes from "../../styles/AdvanceSearch.module.css";
import { initialPriceRange, initialMileRange } from "@/constants/data";
import { useMediaQuery } from "@mantine/hooks";
const AdvanceSearch = ({ carMakes, carModel, demoList, close,searchValue }) => {
    const isSmallScreen = useMediaQuery('(min-width: 56.25em)')
    const marketCars = useMarketplaceCarSelector();
    const auctionCars = useCarSelector();
    const router = useRouter();
    const [vehicleType, setVehicleType] = useState([]);
    const [listingType, setListingType] = useState("auction");
    const [driverType, setDriverType] = useState([]);
    const [driverSide, setDriverSide] = useState([]);
    const [sellerType, setSellerType] = useState([]);
    const [fuelType, setFuelType] = useState([]);
    const [transmission, setTransmission] = useState([]);
    const [totalFilterCars, setTotalFilterCars] = useState([]);
    const [radioValue, setRadioValue] = useState("");
    const [selectedCarMakes, setSelectedCarMakes] = useState("");
    const [selectedCarModel, setSelectedCarModel] = useState("");
    const [priceRange, setPriceRange] = useState(initialPriceRange);
    const [milageRange, setMilageRange] = useState(initialMileRange);
    const [searchCarName, setSearchCarName] = useState("");
    const [date, setDate] = useState([null, null]);
    const [totalCars, setTotalCars] = useState([]);
    useEffect(()=>{
        setSearchCarName(searchValue)
    },[searchValue])
    useEffect(() => {
        setTotalFilterCars(demoList);
        setTotalCars(demoList);
    }, [demoList]);
      useEffect(() => {
        if (listingType == "auction") {
          setTotalFilterCars(auctionCars?.filtered);
          setTotalCars(auctionCars?.filtered);
        } else if (listingType == "marketplace") {
          setTotalFilterCars(auctionCars?.filtered);
          setTotalCars(auctionCars?.filtered);
        }
      }, [listingType]);
    
      useEffect(() => {
        if (listingType == "auction") {
          const carMakeFilter = filterCars(auctionCars.filtered);
          setTotalFilterCars(carMakeFilter);
        } else if (listingType == "marketplace") {
          const carMakeFilter = filterCars(marketCars.filtered);
          setTotalFilterCars(carMakeFilter);
        } else {
          const carMakeFilter = filterCars(demoList);
          setTotalFilterCars(carMakeFilter);
        }
      }, [
        selectedCarMakes,
        selectedCarModel,
        fuelType,
        transmission,
        driverType,
        priceRange,
        milageRange,
        date,
        searchCarName,
        listingType,
        vehicleType,
        driverSide,
        radioValue
      ]);
      const filterCars = (filterData) => {
        let newArrayDate = [];
        if (date[0] != null && date[1] != null) {
          newArrayDate = date.map((d) => new Date(d).getFullYear().toString());
        }

        const carMakeFilter = filterData?.filter((car) => {
          const isMakeMatch = selectedCarMakes
            ? car.make === selectedCarMakes
            : true;
          const isModelMatch = selectedCarModel
            ? car.model === selectedCarModel
            : true;
          const isColorMatched=radioValue!="" ? car.color ==radioValue : true
          const isFuelMatch =
            fuelType.length > 0
              ? fuelType?.includes(car.fuelType?.toLowerCase())
              : true;
          const isTransmissionMatch =
            transmission.length > 0
              ? transmission?.includes(car?.transmission?.toLowerCase())
              : true;
          const isDriveTypeMatch =
            driverType.length > 0
              ? driverType?.includes(car?.driveType?.toLowerCase())
              : true;
            const isVehicleTypeMatched=vehicleType.length > 0 ? vehicleType.includes(car?.vehicleType?.toLowerCase())
            : true;
            const isDriveSideMatched=driverSide.length > 0 ? driverSide?.includes(car?.driveSide?.toLowerCase())
            : true;
          const isPriceMatched = priceRange
            ? car.price >= priceRange[0] && car.price <= priceRange[1]
            : true;
          const isMilageMatched = milageRange
            ? car.mileage >= milageRange[0] && car.mileage <= milageRange[1]
            : true;
          const isDateMatched =
            date[0] != null && date[1] != null
              ? car.year?.toString() >= newArrayDate[0] &&
                car.year?.toString() <= newArrayDate[1]
              : true;
          const isNameMatched =
            searchCarName !== ""
              ? car.price
                  ?.toString()
                  ?.toLowerCase()
                  ?.includes(searchCarName?.toLowerCase()) ||
                car?.driveType?.toLowerCase()?.includes(searchCarName?.toLowerCase()) ||
                car?.transmission
                  ?.toLowerCase()
                  ?.includes(searchCarName?.toLowerCase()) ||
                car?.fuelType?.toLowerCase()?.includes(searchCarName?.toLowerCase()) ||
                car?.make?.toLowerCase()?.includes(searchCarName?.toLowerCase()) ||
                car?.year?.toString()?.toLowerCase().includes(searchCarName?.toLowerCase()) ||
                car?.model?.toLowerCase()?.includes(searchCarName?.toLowerCase())
              : true; 
          return (
            isMakeMatch &&
            isModelMatch &&
            isFuelMatch &&
            isTransmissionMatch &&
            isDriveTypeMatch &&
            isPriceMatched &&
            isMilageMatched &&
            isDateMatched &&
            isNameMatched && 
            isVehicleTypeMatched &&
            isDriveSideMatched &&
            isColorMatched
          );
        });
        return carMakeFilter;
      };
    const applyChanges = () => {
        const params = {
            fuelType,
            transmission,
            driverType,
            priceRange,
            milageRange,
            vehicleType,
            driverSide,
        };
        const queryParams = new URLSearchParams();
        Object.entries(params).forEach(([key, values]) => {
            if (values) {
                values.forEach(value => queryParams.append(key, value));
            }
        });

        if (selectedCarModel) {
            queryParams.set('carModel', selectedCarModel);
        }
        if (selectedCarMakes) {
            queryParams.set('carMakes', selectedCarMakes);
        }
        if (searchCarName) {
            queryParams.set('searchCarName', searchCarName);
        }
        const queryString = queryParams.toString();
        if (listingType == "auction") {
            router.push(`/auction?${queryString}`);
        } else {
            router.push(`/marketplace?${queryString}`);
        }
        close();
    }
    const clearFilter = () => {
        setDate([null, null]);
        setSearchCarName("");
        setMilageRange(initialMileRange);
        setPriceRange(initialPriceRange);
        setSelectedCarModel("");
        setSelectedCarMakes("");
        setVehicleType([]);
        setListingType([]);
        setDriverType([]);
        setDriverSide([]);
        setSellerType([]);
        setFuelType([]);
        setTransmission([]);
        // setTotalFilterCars([]);
    };
    return (
        <>
            <Box px={{ base: 'sm', sm: 'lg', md: 'xl' }} pb="lg" className={classes.root}>
                <Center>
                    <Title order={4} mb="md">
                        Explore Trade Dept
                    </Title>
                </Center>
                <Box w={{ base: '100%', sm: '70%' }} mx='auto' mb={{ base: 'sm', md: 'xl' }}>
                    <Box mb="sm">
                        <Text mb="xs">Use the smart search tool</Text>
                        <Input
                            placeholder="Type Manual Porsche or something else..."
                            size="md"
                            value={searchCarName}
                            onChange={(e) => setSearchCarName(e.target.value)}
                        />
                    </Box>
                    <Text c="#3CDFCD" ta="center">
                        Or select from the filer below
                    </Text>
                </Box>
                <Box mb={{ base: 'md', sm: 'lg' }}>
                    <Title order={4} mb="xs" fw="400">
                        Vehicles Type
                    </Title>
                    <Checkbox.Group mb={{ base: 'md', sm: 'lg' }} value={vehicleType} onChange={setVehicleType}>
                        <Group grow preventGrowOverflow={false} gap="sm">
                            <Checkbox.Card
                                className={classes.custom_checkbox}
                                value="cars"
                                radius="sm"
                            >
                                <Text className={classes.label} ta="center">
                                    Cars
                                </Text>
                            </Checkbox.Card>
                            <Checkbox.Card
                                className={classes.custom_checkbox}
                                value="vans"
                                radius="sm"
                            >
                                <Text className={classes.label} ta="center">
                                    Vans
                                </Text>
                            </Checkbox.Card>
                            <Checkbox.Card
                                className={classes.custom_checkbox}
                                value="caravans"
                                radius="sm"
                            >
                                <Text className={classes.label} ta="center">
                                    Caravans
                                </Text>
                            </Checkbox.Card>
                            <Checkbox.Card
                                className={classes.custom_checkbox}
                                value="trailers"
                                radius="sm"
                            >
                                <Text className={classes.label} ta="center">
                                    Trailers
                                </Text>
                            </Checkbox.Card>
                            <Checkbox.Card
                                className={classes.custom_checkbox}
                                value="agro"
                                radius="sm"
                            >
                                <Text className={classes.label} ta="center">
                                    Agro
                                </Text>
                            </Checkbox.Card>
                            <Checkbox.Card
                                className={classes.custom_checkbox}
                                value="construction"
                                radius="sm"
                            >
                                <Text className={classes.label} ta="center">
                                    Construction
                                </Text>
                            </Checkbox.Card>
                        </Group>
                    </Checkbox.Group>
                    <Title order={4} mb="xs" fw="400">
                        Listing Type
                    </Title>
                    <Radio.Group value={listingType} onChange={setListingType}>
                        <Group grow={isSmallScreen ? '' : 'false'} gap="sm">
                            {/* <Checkbox.Card className={classes.custom_checkbox} value='Browse All' radius="sm">
                                <Text className={classes.label} ta='center'>Browse All</Text>
                            </Checkbox.Card> */}
                            <Radio.Card
                                className={classes.custom_checkbox}
                                value="auction"
                                radius="sm"
                            >
                                <Text className={classes.label} ta="center">
                                    Auctions
                                </Text>
                            </Radio.Card>
                            <Radio.Card
                                className={classes.custom_checkbox}
                                value="marketplace"
                                radius="sm"
                            >
                                <Text className={classes.label} ta="center">
                                    Marketplace
                                </Text>
                            </Radio.Card>
                        </Group>
                    </Radio.Group>
                </Box>
                <Box mb={{ base: 'sm', md: 'xl' }}>
                    <Grid wrap="nowrap" mb="md">
                        <Grid.Col span={6}>
                            <Title order={4} mb="xs" fw="400">
                                Make
                            </Title>
                            <Select
                                onChange={(value) => setSelectedCarMakes(value)}
                                placeholder="Select..."
                                data={carMakes}
                                w="100%"
                            />
                        </Grid.Col>
                        <Grid.Col span={6}>
                            <Title order={4} mb="xs" fw="400">
                                Model
                            </Title>
                            <Select
                                onChange={(value) => setSelectedCarModel(value)}
                                placeholder="Choose make first..."
                                data={carModel}
                                w="100%"
                            />
                        </Grid.Col>
                    </Grid>
                    <Title order={4} mb="xs" fw="400">
                        Search by Model Variant
                    </Title>
                    <Select
                        placeholder="Select a Variant"
                        data={["React", "Angular", "Vue", "Svelte"]}
                        w="100%"
                    />
                </Box>
                <Grid wrap="nowrap" mb={{ base: 'md', sm: 'lg' }}>
                    <Grid.Col span={{ base: 12, xs: 6 }}>
                        <Title order={4} mb="xs" fw="400">
                            Price €{priceRange[0]} - €{priceRange[1]}
                        </Title>
                        <RangeSlider
                            value={priceRange}
                            min={initialPriceRange[0]}
                            max={initialPriceRange[1]}
                            onChange={setPriceRange}
                            onChangeEnd={(range) => {
                                setPriceRange([range[0], range[1]]);
                            }}
                            label={(val) => `€${val}`}
                        />
                    </Grid.Col>
                    <Grid.Col span={{ base: 12, xs: 6 }}>
                        <Title order={4} mb="xs" fw="400">
                            Kilometer {milageRange[0]} - {milageRange[1]}
                        </Title>
                        <RangeSlider
                            value={milageRange}
                            min={initialMileRange[0]}
                            max={initialMileRange[1]}
                            onChange={setMilageRange}
                            onChangeEnd={(range) => {
                                setMilageRange([range[0], range[1]]);
                            }}
                            label={(val) => `KM${val}`}
                        />
                    </Grid.Col>
                </Grid>
                <Grid mb={{ base: 'sm', md: 'xl' }}>
                    <Grid.Col span={{ base: 12, sm: 6 }}>
                        <Title order={4} mb="xs" fw="400">
                            Year Range
                        </Title>
                        <YearPickerInput
                            type="range"
                            // label="Pick years range"
                            placeholder="Pick dates range"
                            value={date}
                            onChange={setDate}
                            size="md"
                        />
                    </Grid.Col>
                    <Grid.Col span={{ base: 12, sm: 6 }}>
                        <Title order={4} mb="xs" fw="400">
                            Seller Type
                        </Title>
                        <Checkbox.Group value={sellerType} onChange={setSellerType}>
                            <Group grow preventGrowOverflow={false} gap='sm' mb={{ base: '0', sm: 'lg' }}>
                                <Checkbox.Card
                                    className={classes.custom_checkbox}
                                    value="all"
                                    radius="sm"
                                >
                                    <Text className={classes.label} ta="center">
                                        All
                                    </Text>
                                </Checkbox.Card>
                                <Checkbox.Card
                                    className={classes.custom_checkbox}
                                    value="trade"
                                    radius="sm"
                                >
                                    <Text className={classes.label} ta="center">
                                        Trade
                                    </Text>
                                </Checkbox.Card>
                                <Checkbox.Card
                                    className={classes.custom_checkbox}
                                    value="private"
                                    radius="sm"
                                >
                                    <Text className={classes.label} ta="center">
                                        Private
                                    </Text>
                                </Checkbox.Card>
                            </Group>
                        </Checkbox.Group>
                    </Grid.Col>
                </Grid>
                <Grid mb={{ base: 'md', sm: 'lg' }}>
                    <Grid.Col span={{ base: 12, sm: 6 }}>
                        <Title order={4} mb="xs" fw="400">
                            Drive Type
                        </Title>
                        <Checkbox.Group value={driverType} onChange={setDriverType} mb={{ base: '0', sm: 'lg' }}>
                            <Group grow preventGrowOverflow={false} gap="sm">
                                <Checkbox.Card
                                    className={classes.custom_checkbox}
                                    value="rwd"
                                    radius="sm"
                                >
                                    <Text className={classes.label} ta="center">
                                        RWD
                                    </Text>
                                </Checkbox.Card>
                                <Checkbox.Card
                                    className={classes.custom_checkbox}
                                    value="awd"
                                    radius="sm"
                                >
                                    <Text className={classes.label} ta="center">
                                        AWD
                                    </Text>
                                </Checkbox.Card>
                                <Checkbox.Card
                                    className={classes.custom_checkbox}
                                    value="fwd"
                                    radius="sm"
                                >
                                    <Text className={classes.label} ta="center">
                                        FWD
                                    </Text>
                                </Checkbox.Card>
                            </Group>
                        </Checkbox.Group>
                    </Grid.Col>
                    <Grid.Col span={{ base: 12, sm: 6 }}>
                        <Title order={4} mb="xs" fw="400">
                            Driver Side
                        </Title>
                        <Checkbox.Group value={driverSide} onChange={setDriverSide} mb={{ base: '0', sm: 'lg' }}>
                            <Group grow preventGrowOverflow={false} gap="sm">
                                <Checkbox.Card
                                    className={classes.custom_checkbox}
                                    value="rhd"
                                    radius="sm"
                                >
                                    <Text className={classes.label} ta="center">
                                        RHD
                                    </Text>
                                </Checkbox.Card>
                                <Checkbox.Card
                                    className={classes.custom_checkbox}
                                    value="lhd"
                                    radius="sm"
                                >
                                    <Text className={classes.label} ta="center">
                                        LHD
                                    </Text>
                                </Checkbox.Card>
                                <Checkbox.Card
                                    className={classes.custom_checkbox}
                                    value="center"
                                    radius="sm"
                                >
                                    <Text className={classes.label} ta="center">
                                        Center
                                    </Text>
                                </Checkbox.Card>
                                <Checkbox.Card
                                    className={classes.custom_checkbox}
                                    value="other"
                                    radius="sm"
                                >
                                    <Text className={classes.label} ta="center">
                                        Other
                                    </Text>
                                </Checkbox.Card>
                            </Group>
                        </Checkbox.Group>
                    </Grid.Col>
                    <Grid.Col span={{ base: 12, sm: 6 }}>
                        <Title order={4} mb="xs" fw="400">
                            Fuel Type
                        </Title>
                        <Checkbox.Group value={fuelType} onChange={setFuelType} mb={{ base: '0', sm: 'lg' }}>
                            <Group grow preventGrowOverflow={false} gap="sm">
                                <Checkbox.Card
                                    className={classes.custom_checkbox}
                                    value="petrol"
                                    radius="sm"
                                >
                                    <Text className={classes.label} ta="center">
                                        Petrol
                                    </Text>
                                </Checkbox.Card>
                                <Checkbox.Card
                                    className={classes.custom_checkbox}
                                    value="diesel"
                                    radius="sm"
                                >
                                    <Text className={classes.label} ta="center">
                                        Diesel
                                    </Text>
                                </Checkbox.Card>
                                <Checkbox.Card
                                    className={classes.custom_checkbox}
                                    value="electric"
                                    radius="sm"
                                >
                                    <Text className={classes.label} ta="center">
                                        Electric
                                    </Text>
                                </Checkbox.Card>
                                <Checkbox.Card
                                    className={classes.custom_checkbox}
                                    value="hybrid"
                                    radius="sm"
                                >
                                    <Text className={classes.label} ta="center">
                                        Hybrid
                                    </Text>
                                </Checkbox.Card>
                            </Group>
                        </Checkbox.Group>
                    </Grid.Col>
                    <Grid.Col span={{ base: 12, sm: 6 }}>
                        <Title order={4} mb="xs" fw="400">
                            Transmission
                        </Title>
                        <Checkbox.Group
                            value={transmission}
                            onChange={setTransmission}
                            mb={{ base: '0', sm: 'lg' }}
                        >
                            <Group grow preventGrowOverflow={false} gap="5">
                                <Checkbox.Card
                                    className={classes.custom_checkbox}
                                    value="4x4 (automat)"
                                    radius="sm"
                                >
                                    <Text className={classes.label} ta="center">
                                    4x4 (automat)
                                    </Text>
                                </Checkbox.Card>
                                <Checkbox.Card
                                    className={classes.custom_checkbox}
                                    value="4x4 (manual)"
                                    radius="sm"
                                >
                                    <Text className={classes.label} ta="center">
                                    4x4 (manual)
                                    </Text>
                                </Checkbox.Card>
                                <Checkbox.Card
                                    className={classes.custom_checkbox}
                                    value="Fata"
                                    radius="sm"
                                >
                                    <Text className={classes.label} ta="center">
                                    Fata
                                    </Text>
                                </Checkbox.Card>
                                <Checkbox.Card
                                    className={classes.custom_checkbox}
                                    value="Spate"
                                    radius="sm"
                                >
                                    <Text className={classes.label} ta="center">
                                    Spate
                                    </Text>
                                </Checkbox.Card>
                            </Group>
                        </Checkbox.Group>
                    </Grid.Col>
                </Grid>
                <Title order={4} mb={{ base: 'md', sm: 'lg' }} fw="400">
                    Exterior Colour
                </Title>
                <Group wrap="nowrap">
                    <Box
                        w={{ base: '80', sm: '100' }} h={{ base: '80', sm: '100' }}
                        bg={`${radioValue}`}
                        style={{
                            borderRadius: "50%",
                            overflow: "hidden",
                            border: "1px solid var(--mantine-color-gray-3)",
                        }}
                    ></Box>
                    <Radio.Group
                        value={radioValue}
                        onChange={setRadioValue}
                        w={{ base: 'calc(100% - 100px)', sm: 'calc(100% - 170px)' }}
                        ms="auto"
                    >
                        <Group gap={isSmallScreen ? '50px 35px' : '40px 15px'} mb={{ base: 'md', sm: 'lg' }}>
                            <Radio.Card
                                className={classes.custom_radio}
                                value="#FFFFFF"
                                bg="#FFFFFF"
                                radius="sm"
                            >
                                <Text className={classes.radio_label} fz={{ base: '12', sm: '14' }} ta="center">
                                    White
                                </Text>
                            </Radio.Card>
                            <Radio.Card
                                className={classes.custom_radio}
                                value="#EF4444"
                                bg="#EF4444"
                                radius="sm"
                            >
                                <Text className={classes.radio_label} fz={{ base: '12', sm: '14' }} ta="center">
                                    Red
                                </Text>
                            </Radio.Card>
                            <Radio.Card
                                className={classes.custom_radio}
                                value="#1E9BE4"
                                bg="#1E9BE4"
                                radius="sm"
                            >
                                <Text className={classes.radio_label} fz={{ base: '12', sm: '14' }} ta="center">
                                    Blue
                                </Text>
                            </Radio.Card>
                            <Radio.Card
                                className={classes.custom_radio}
                                value="#2E2E2E"
                                bg="#2E2E2E"
                                radius="sm"
                            >
                                <Text className={classes.radio_label} fz={{ base: '12', sm: '14' }} ta="center">
                                    Black
                                </Text>
                            </Radio.Card>
                            <Radio.Card
                                className={classes.custom_radio}
                                value="#34D399"
                                bg="#34D399"
                                radius="sm"
                            >
                                <Text className={classes.radio_label} fz={{ base: '12', sm: '14' }} ta="center">
                                    Green
                                </Text>
                            </Radio.Card>
                            <Radio.Card
                                className={classes.custom_radio}
                                value="#6B7280"
                                bg="#6B7280"
                                radius="sm"
                            >
                                <Text className={classes.radio_label} fz={{ base: '12', sm: '14' }} ta="center">
                                    Grey
                                </Text>
                            </Radio.Card>

                            <Radio.Card
                                className={classes.custom_radio}
                                value="#C0C0C0"
                                bg="#C0C0C0"
                                radius="sm"
                            >
                                <Text className={classes.radio_label} fz={{ base: '12', sm: '14' }} ta="center">
                                    Silver
                                </Text>
                            </Radio.Card>
                            <Radio.Card
                                className={classes.custom_radio}
                                value="#964B00"
                                bg="#964B00"
                                radius="sm"
                            >
                                <Text className={classes.radio_label} fz={{ base: '12', sm: '14' }} ta="center">
                                    Brown
                                </Text>
                            </Radio.Card>
                            <Radio.Card
                                className={classes.custom_radio}
                                value="#F5F5DC"
                                bg="#F5F5DC"
                                radius="sm"
                            >
                                <Text className={classes.radio_label} fz={{ base: '12', sm: '14' }} ta="center">
                                    Beige
                                </Text>
                            </Radio.Card>

                            <Radio.Card
                                className={classes.custom_radio}
                                value="#FB923C"
                                bg="#FB923C"
                                radius="sm"
                            >
                                <Text className={classes.radio_label} fz={{ base: '12', sm: '14' }} ta="center">
                                    Orange
                                </Text>
                            </Radio.Card>
                            <Radio.Card
                                className={classes.custom_radio}
                                value="#FBBF24"
                                bg="#FBBF24"
                                radius="sm"
                            >
                                <Text className={classes.radio_label} fz={{ base: '12', sm: '14' }} ta="center">
                                    Yellow
                                </Text>
                            </Radio.Card>
                            <Radio.Card
                                className={classes.custom_radio}
                                value="#5B21B6"
                                bg="#5B21B6"
                                radius="sm"
                            >
                                <Text className={classes.radio_label} fz={{ base: '12', sm: '14' }} ta="center">
                                    Purple
                                </Text>
                            </Radio.Card>
                            <Radio.Card
                                className={classes.custom_radio}
                                value="#878681"
                                bg="#878681"
                                radius="sm"
                            >
                                <Text
                                    className={classes.radio_label}
                                    fz={{ base: '12', sm: '14' }}
                                    lh="1"
                                    ta="center"
                                >
                                    Bare Metal
                                </Text>
                            </Radio.Card>
                            <Radio.Card
                                className={classes.custom_radio}
                                value="#FFF"
                                bg="#FFFFFF"
                                radius="sm"
                            >
                                <Text className={classes.radio_label} fz="14" ta="center">
                                    Other
                                </Text>
                            </Radio.Card>
                        </Group>
                    </Radio.Group>
                </Group>
            </Box>
            <Group className={classes.modal_footer} wrap="nowrap" gap="xs">
                <Button
                    onClick={clearFilter}
                    variant="outline"
                    color="#3CDFCD"
                    size={isSmallScreen ? 'lg' : 'sm'}
                    radius="xl"
                    px="sm"
                    fullWidth
                >
                    Clear Filters
                </Button>
                <Button
                    onClick={applyChanges}
                    variant="filled"
                    color="#3CDFCD"
                    size={isSmallScreen ? 'lg' : 'sm'}
                    radius="xl"
                    px="sm"
                    c="#141414"
                    fullWidth
                >
                    Apply Changes
                    ({totalFilterCars?.length})
                </Button>
            </Group>
        </>
    );
};

export default AdvanceSearch;
