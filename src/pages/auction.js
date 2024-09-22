
import { Grid, Input, Button, Card, Group, Text, Select, RangeSlider, Flex } from '@mantine/core';
import { IconSearch, IconFilterSearch, IconCarSuv, IconPremiumRights, } from '@tabler/icons-react';
import { useCarDispatch, useCarSelector, updateFilter, fetchCarsAsync } from '@/redux/carsSlice';
import CarCardGridDesktop from '@/components/CarManage/CarCardGridDesktop';
import { useLoadingContext } from '@/providers/LoadingProvider';
import PillCombobox from '@/components/CarManage/PillCombobox';
import CarCardGrid from '@/components/CarManage/CarCardGrid';
import { useState, useEffect, useCallback, useMemo } from 'react';
import MetaDecorator from "@/components/Meta/metaDecor";
import { initialPriceRange } from '@/constants/data';
import { useSearchParams } from 'next/navigation';
import { useMediaQuery } from 'react-responsive';
import { userService } from '@/services';
import Section from '@/layouts/Section';
import { carService } from '@/services';
import { useRouter } from 'next/router';

function UserMarketplace() {

  let yearList = [];
  for (let year = 1930; year <= (new Date().getFullYear()); ++year)
    yearList.push(`${year}`);
  const [filteredCars, setFilteredCars] = useState([])
  const router = useRouter()
  const cars = useCarSelector();
  console.log("🚀 ~ UserMarketplace ~ cars:", cars)
  const dispatch = useCarDispatch();
  const searchParams = useSearchParams();
  const loadingContext = useLoadingContext();
  const isMobile = useMediaQuery({ query: '(max-width: 587px)' })

  const searchParam = searchParams.get('search');
  const carModel = searchParams.get('carModel');
  const carMakes = searchParams.get('carMakes');
  const carYear = searchParams.get('carYear');
  const searchCarName = searchParams.get('searchCarName');
  const fuelType = useMemo(() => searchParams.getAll('fuelType'), [searchParams]);
  const transmission = useMemo(() => searchParams.getAll('transmission'), [searchParams]);
  const driverType = useMemo(() => searchParams.getAll('driverType'), [searchParams]);
  const priceRangeFilter = useMemo(() => searchParams.getAll('priceRange'), [searchParams]);
  const milageRange = useMemo(() => searchParams.getAll('milageRange'), [searchParams]);
  const vehicleType = useMemo(() => searchParams.getAll('vehicleType'), [searchParams]);
  const driverSide = useMemo(() => searchParams.getAll('driverSide'), [searchParams]);

  const [totalMakes, setTotalMakes] = useState([]);
  const [search, setSearch] = useState(searchParam || '');
  const [priceRange, setPriceRange] = useState(initialPriceRange);
  const [mainSearch, setMainSearch] = useState("");
  const [makeAndModel, setMakeAndModel] = useState("")
  const fetchData = useCallback(async () => {
    if (userService.userValue?.role === "USER") {
      const res = await carService.getUniqueValues({
        columns: ['make']
      });
      const justList = res.map((val) => val.make);
      setTotalMakes(justList);
      dispatch(updateFilter("init"));
      dispatch(updateFilter({ search }));
    }
    if (!userService?.userValue) {
      dispatch(fetchCarsAsync({ referal: "ALL" }))
    }
  }, [userService.userValue, carService, dispatch]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);
  useEffect(() => {
    if (priceRangeFilter.length > 0) {
      const priceRangeFilterArray = priceRangeFilter.map(Number);
      setPriceRange(priceRangeFilterArray)
      const filterData = filterCars();
      setFilteredCars(prevState => [...filterData]);
    }
  }, [priceRangeFilter])
  useEffect(() => {
    loadingContext.setIsLoading(cars.loading);
  }, [cars.loading]);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (user) {
      userService.getById(user?.id).then((user) => {
        dispatch(fetchCarsAsync({ id: user.id, referal: user.referal }))
        if (userService.userValue?.role === "ADMIN") {
          router.push("/admin/users");
        } else if (userService.userValue?.inPurchase) {
          router.push("/progress");
        }
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  useEffect(() => {
    console.log(searchParam)
    if (searchParam) {
      dispatch(updateFilter({ search: searchParam }))
      setSearch(searchParam)
    }
  }, [searchParam])
  useEffect(() => {
    setFilteredCars(cars.filtered)
  }, [cars.filtered])
  useEffect(() => {
    if (fuelType.length > 0 || transmission.length > 0 || driverType.length > 0 || vehicleType.length > 0 || driverSide.length > 0 || milageRange.length > 0 || makeAndModel.length > 0 || carModel != "" || carMakes != "" || searchCarName != "" || carYear != "") {

      const filterData = filterCars();
      setFilteredCars(prevState => [...filterData]);
    }
  }, [fuelType, transmission, driverType, milageRange, carModel, carMakes, searchCarName, driverSide, vehicleType, carYear, makeAndModel])
  useEffect(() => {
  }, [filteredCars])
  const filterCars = () => {
    console.log(makeAndModel, 'makeAndModel makeAndModel')
    let priceRangeFilterArray = []
    if (priceRangeFilter.length > 0) {
      priceRangeFilterArray = priceRangeFilter.map(Number);
    } else {
      priceRangeFilterArray = priceRange
    }
    const carFilter = cars.filtered.filter((car) => {
      const isFuelMatch =
        fuelType?.length > 0
          ? fuelType?.includes(car.fuelType?.toLowerCase())
          : true;
      const isMakeMatch = carMakes
        ? car?.make === carMakes
        : true;
      const isModelMatch = carModel
        ? car?.model == carModel
        : true;
      const IsMakeAndModelMatched = makeAndModel?.length > 0 ? (car?.make?.toLowerCase()?.includes(makeAndModel?.toLowerCase()) || car?.model?.toLowerCase()?.includes(makeAndModel?.toLowerCase())) : true;
      const isCarYearMatched = carYear ? car?.year == carYear : true;
      const isTransmissionMatch =
        transmission?.length > 0
          ? transmission?.includes(car?.transmission?.toLowerCase())
          : true;
      const isDriveTypeMatch =
        driverType?.length > 0
          ? driverType?.includes(car?.driveType?.toLowerCase())
          : true;
      const isVehicleTypeMatched = vehicleType?.length > 0 ? vehicleType?.includes(car?.vehicleType?.toLowerCase())
        : true;
      const isDriveSideMatched = driverSide?.length > 0 ? driverSide?.includes(car?.driveSide?.toLowerCase())
        : true;
      const isPriceMatched = priceRangeFilterArray
        ? car?.price >= priceRangeFilterArray[0] && car.price <= priceRangeFilterArray[1]
        : true;
      const isMilageMatched = milageRange?.length > 0
        ? car?.mileage >= milageRange[0] && car?.mileage <= milageRange[1]
        : true;
      const isNameMatched =
        (searchCarName !== "" && searchCarName !== null)
          ? car?.price
            ?.toString()
            ?.toLowerCase()
            ?.includes(searchCarName?.toLowerCase()) ||
          car?.driveType?.toLowerCase()?.includes(searchCarName?.toLowerCase()) ||
          car?.transmission
            ?.toLowerCase()
            ?.includes(searchCarName?.toLowerCase()) ||
          car?.fuelType?.toLowerCase()?.includes(searchCarName?.toLowerCase()) ||
          car?.make?.toLowerCase()?.includes(searchCarName?.toLowerCase()) ||
          car?.year?.toString()?.toLowerCase()?.includes(searchCarName?.toLowerCase()) ||
          car?.model?.toLowerCase()?.includes(searchCarName?.toLowerCase())
          : true;
      const isMainSearchMatched = (mainSearch !== "" && mainSearch !== null)
        ? car.price
          ?.toString()
          ?.toLowerCase()
          ?.includes(mainSearch.toLowerCase()) ||
        car?.driveType?.toLowerCase()?.includes(mainSearch?.toLowerCase()) ||
        car?.transmission
          ?.toLowerCase()
          ?.includes(mainSearch?.toLowerCase()) ||
        car?.fuelType?.toLowerCase()?.includes(mainSearch?.toLowerCase()) ||
        car?.make?.toLowerCase()?.includes(mainSearch?.toLowerCase()) ||
        car?.year?.toString()?.toLowerCase()?.includes(mainSearch?.toLowerCase()) ||
        car?.model?.toLowerCase()?.includes(mainSearch?.toLowerCase())
        : true;
      return (
        isFuelMatch && isTransmissionMatch && isDriveTypeMatch && isPriceMatched && isMilageMatched && isModelMatch && isMakeMatch && isNameMatched && isVehicleTypeMatched &&
        isDriveSideMatched && isMainSearchMatched && isCarYearMatched && IsMakeAndModelMatched
      );
    });
    return carFilter
  }
  const PriceRangeFilterEnd = (range) => {
    // dispatch(updateFilter({
    //   priceFrom: range[0],
    //   priceTo: range[1],
    // }))
    setPriceRange([range[0], range[1]]);
    const filterData = filterCars();
    setFilteredCars(prevState => [...filterData]);
    //     setTimeout(() => {
    //   const filterData = filterCars();
    //   setFilteredCars(prevState => [...filterData]);
    // }, 1000);
  }
  useEffect(() => {
    console.log(makeAndModel, 'totalMakes totalMakes')
  }, [makeAndModel])
  useEffect(() => {
    const filterData = filterCars();
    setFilteredCars(prevState => [...filterData]);
  }, [priceRange])
  const searchMainFunction = () => {
    console.log("iss mian functjon")
    const filterData = filterCars();
    setFilteredCars(prevState => [...filterData]);
  }
  // useEffect(()=>{
  //   const filterData = filterCars();
  //   setFilteredCars(prevState => [...filterData]);
  // },[mainSearch])
  const resetSearch = () => {

    setMainSearch("")
    setMakeAndModel("")
    setTotalMakes("")
  }
  return (
    <>
      <MetaDecorator title='Trade Dept | Auction' />
      <Section size="xl" style={{ marginTop: 30 }}
        theme={{
          colors: {
            'ocean-blue': ['#7AD1DD', '#5FCCDB', '#44CADC', '#2AC9DE', '#1AC2D9', '#11B7CD', '#09ADC3', '#0E99AC', '#128797', '#147885'],
          },
        }}>
        <Grid>
          <Grid.Col span={{ base: 12, md: 3 }} visibleFrom='xs'>
            <Card
              withBorder
              mx="md"
              radius="md"
              shadow="lg"
              className='box-shadow'
            >
              <Card.Section withBorder inheritPadding p="lg">
                <Group>
                  <IconFilterSearch stroke={2.4} size={24} color="var(--mantine-color-ocean-blue-filled)" />
                  <Text fz={20} fw={600} c="ocean-blue">Filter</Text>
                </Group>
              </Card.Section>
              <Card.Section withBorder inheritPadding p="lg">
                <Group mb="sm">
                  <IconCarSuv color="var(--mantine-color-ocean-blue-filled)" />
                  <Text fz={14}>Make & Model</Text>
                </Group>
                <Input
                  value={makeAndModel}
                  onChange={(e) => setMakeAndModel(e.target.value)}


                />
              </Card.Section>
              <Card.Section withBorder inheritPadding p="lg">
                <Grid>
                  <Grid.Col span={6}>
                    <Select
                      checkIconPosition="left"
                      data={yearList}
                      placeholder="Year from"
                      value={cars.filter.yearFrom}
                      onChange={(val) => {
                        const selectedYearFrom = val;
                        let updatedYearTo = cars.filter.yearTo; // Get current yearTo from state
                        if (!selectedYearFrom) {
                          updatedYearTo = null; // Update yearTo to selectedYearFrom
                        }
                        // Check if selected yearFrom is greater than current yearTo or yearTo is empty, then update yearTo
                        if (parseInt(selectedYearFrom) > updatedYearTo && updatedYearTo) {
                          updatedYearTo = null; // Update yearTo to selectedYearFrom
                        }
                        dispatch(
                          updateFilter({
                            yearFrom: selectedYearFrom,
                            yearTo: updatedYearTo,
                          })
                        );
                      }}
                    />
                  </Grid.Col>
                  <Grid.Col span={6}>
                    <Select
                      checkIconPosition="left"
                      data={yearList.filter(year => parseInt(year) >= parseInt(cars.filter.yearFrom))}
                      placeholder="Year to"
                      value={cars.filter.yearTo}
                      onChange={(val) => dispatch(updateFilter({
                        yearTo: val,
                      }))}
                    />
                  </Grid.Col>
                </Grid>
              </Card.Section>
              <Card.Section withBorder inheritPadding py="xl">
                <Grid>
                  <Grid.Col span={12}>
                    <Group>
                      <IconPremiumRights color="var(--mantine-color-ocean-blue-filled)" />
                      <Text fz={14}>Price: €{priceRange[0]} - €{priceRange[1]}</Text>
                    </Group>
                  </Grid.Col>
                  <Grid.Col span={12}>
                    <RangeSlider
                      value={priceRange}
                      min={initialPriceRange[0]}
                      max={initialPriceRange[1]}
                      // onChange={setPriceRange}
                      onChangeEnd={(range) => PriceRangeFilterEnd(range)}
                      label={(val) => (`€${val}`)}
                    />
                  </Grid.Col>
                </Grid>
              </Card.Section>
            </Card>
          </Grid.Col>
          <Grid.Col span={{ base: 12, md: 9 }}>
            <Grid m="sm" mb="lg">
              <Grid.Col span={12}>
                <form onSubmit={(e) => {
                  e.preventDefault()
                  dispatch(updateFilter({ search }))
                }}>
                  <Flex gap='15' direction={{ sm: 'row', base: 'column', }}>
                    <Input
                      leftSection={<IconSearch size={18} />}
                      rightSectionPointerEvents="all"
                      w="100%"
                      placeholder="Search by Year, Make, Model ..."
                      radius="md"
                      value={mainSearch}
                      onChange={(e) => setMainSearch(e.target.value)}
                    />
                    <Flex gap='10'>
                      <Button radius="md" w={{ sm: '180', base: '150' }} c='#000' onClick={(e) => searchMainFunction()}>
                        Search
                      </Button>
                      <Button radius="md" w={{ sm: '180', base: '150' }} c='#000'
                        onClick={(e) => resetSearch()}>
                        Reset
                      </Button>
                    </Flex>
                  </Flex>
                </form>
              </Grid.Col>
            </Grid>
            <CarCardGridDesktop
              carCount={filteredCars}
              cList={filteredCars} />
          </Grid.Col>

        </Grid>
      </Section>
    </>
  )
}
export default (UserMarketplace)