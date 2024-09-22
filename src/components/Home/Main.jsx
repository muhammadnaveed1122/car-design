import { BackgroundImage, Container, Box, Grid, Card, Group, Title, Text, Image, Select, Button, Flex, Modal } from '@mantine/core';
import { IconCarSuv, IconSearch, IconUserPlus, IconXboxX, } from "@tabler/icons-react"
import classes from "@/styles/CarInfoCard.module.css";
import { LoginForm } from '../AuthenticationForm';
import { useDisclosure } from '@mantine/hooks';
import AdvanceSearch from './advanceSearch';
import { useEffect, useState } from 'react';
import { useRouter } from "next/router";
export default function MainContent({ showForm, demoList }) {
  const router = useRouter();
  const [opened, { open, close }] = useDisclosure(false);
  const [carModel, setCarModel] = useState([]);
  const [carYears, setCarYears] = useState([]);
  const [carMakes, setCarMakes] = useState([]);
  const [carFuelTypes, setCarFuelTypes] = useState([]);
  const [carDriveTypes, setCarDriveTypes] = useState([]);
  const [carTransmissions, setCarTransmissions] = useState([]);
  const [selectedCarMakes, setSelectedCarMakes] = useState("");
  const [selectedCarModel, setSelectedCarModel] = useState("");
  const [selectedYear, setSelectedYear] = useState("");
  useEffect(() => {
    if (demoList) {
      const { models, years, makes, fuelTypes, driveTypes, transmissions } = demoList.reduce((acc, car) => {
        acc.models.push(car.model);
        acc.years.push(String(car.year));
        acc.makes.push(car.make);
        acc.fuelTypes.push(car.fuelType);
        acc.driveTypes.push(car.driveType);
        acc.transmissions.push(car.transmission);


        return acc;
      }, { models: [], years: [], makes: [], fuelTypes: [], driveTypes: [], transmissions: [] });

      setCarModel([...new Set(models)]);
      setCarYears([...new Set(years)]);
      setCarMakes([...new Set(makes)]);
      setCarFuelTypes([...new Set(fuelTypes)])
      setCarDriveTypes([... new Set(driveTypes)])
      setCarTransmissions([...new Set(transmissions)])
    }
  }, [demoList])
  console.log(demoList, 'demoList demoList');
  const searchCars = () => {
    const queryParams = new URLSearchParams();
    if (selectedCarModel) {
      queryParams.set('carModel', selectedCarModel);
    }
    if (selectedCarMakes) {
      queryParams.set('carMakes', selectedCarMakes);
    }
    if (selectedYear) {
      queryParams.set('carYear', selectedYear);
    }
    const queryString = queryParams.toString();
    router.push(`/auction?${queryString}`);
  }
  return (
    <>
      <Modal opened={opened} onClose={close} size='975' centered className='search_modal' radius={'xl'}>
        <AdvanceSearch carMakes={carMakes} carModel={carModel} demoList={demoList} />
      </Modal>
      <BackgroundImage
        src="/siteHome.webp"
        radius="sm"
      >
        <Container size="lg" py={80} style={{ zIndex: 100 }}>
          <Grid style={{ background: "#0e0e0ea0", borderRadius: 30 }} py={{ base: 30, sm: 50 }} px={{ base: 10, sm: 50 }}>
            <Grid.Col span={{ base: 12, md: 6 }} order={{ base: 2, xs: 2, sm: 2, md: 1, lg: 1 }}
            >
              <Box mx="left" maw={1000}>
                <Group direction="row" px="md" pb="md">
                  <Title order={1} fz={{ base: 24, sm: 32 }} c="white">Discover Clean and Salvage Cars at Trade Dept.</Title>
                  <Text fz={{ base: 20, sm: 24 }} lh="sm" style={{ color: "#ffffffcc" }}>
                    Our full-service automotive marketplace is fueled by innovative technology to provide a superior experience.
                  </Text>
                  <ul className="auction-steps">
                    <li>
                      <IconUserPlus size={38} stroke={2.5} style={{ position: "absolute", left: 7 }} />
                      <strong>Step 1: Register</strong> Sign up for a Basic, Advanced or Premium Membership
                    </li>
                    <li>
                      <IconSearch size={38} stroke={2.5} style={{ position: "absolute", left: 7 }} />
                      <strong>Step 2: Find A Vehicle</strong> Search our inventory to find your next vehicle
                    </li>
                    <li>
                      <IconCarSuv size={38} stroke={2} style={{ position: "absolute", left: 7 }} />
                      <strong>Step 3: BID, WIN, RIDE</strong> Bid on daily auto auctions Monday-Friday
                    </li>
                  </ul>
                </Group>
              </Box>
            </Grid.Col>
            <Grid.Col span={{ base: 12, md: 6 }} order={{ base: 1, xs: 1, sm: 1, md: 2, lg: 2, }}
              px={{ base: 'sm', sm: "xl" }} style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
              {/*  {!showForm ?
                <Card radius="lg" shadow="xl" p={{ base: 0, sm: "lg" }} mx={{ base: 0, sm: "lg" }} w="100%" className={classes.card} key="loginForm">
                  <LoginForm />
                </Card> :
                <Box><Image src="/HomeCar.webp" alt="Tesla Model S" key="car" /></Box>} */}
                <Box><Image src="/HomeCar.webp" alt="Tesla Model S" key="car" /></Box>
            </Grid.Col>
            {/* <Grid.Col span={{ base: 12 }} order={{ base: 3 }}>
              <Title order={4} c="white" mb="md">Find Your Perfect Car</Title>
              <Flex wrap={{ base: 'wrap', md: 'nowrap' }} justify='center' gap='xs'>
                <Select
                  placeholder="Model"
                  data={carModel}
                  onChange={(value) => setSelectedCarModel(value)}
                  w={{ base: 'calc(50% - 5px)', sm: 'calc(33% - 5px)', md: 'auto' }}
                />
                <Select
                  placeholder="Make"
                  data={carMakes}
                  onChange={(value) => setSelectedCarMakes(value)}
                  w={{ base: 'calc(50% - 5px)', sm: 'calc(33% - 5px)', md: 'auto' }}
                />
                <Select
                  placeholder="Year"
                  data={carYears}
                  onChange={(value) => setSelectedYear(value)}
                  w={{ base: 'calc(50% - 5px)', sm: 'calc(33% - 5px)', md: 'auto' }}
                />
                <Group wrap='nowrap' gap='xs'>
                  <Button variant="filled" color="#3CDFCD" c={'#000'} radius="xl" px='sm' onClick={searchCars}>Search Cars</Button>
                  <Button variant="outline" color="#3CDFCD" c={'#fff'} radius="xl" px='sm'
                    onClick={() => open()}
                  >
                    Advance Search
                  </Button>
                </Group>
              </Flex>
            </Grid.Col> */}
          </Grid>
        </Container>
      </BackgroundImage>
    </>
  )
}
