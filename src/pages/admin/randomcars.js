
import { Grid, Input, Button, Card, Group, Text, Select, RangeSlider, SegmentedControl, Flex } from '@mantine/core';
import { IconSearch, IconPremiumRights, IconCarSuv, IconFilterSearch } from '@tabler/icons-react';
import { useCarDispatch, useCarSelector, updateFilter} from '@/redux/carsSlice';
import CarCardManage from '@/components/CarManage/CarCardManage';
import { initialPriceRange, carStatus } from '@/constants/data';
import { useLoadingContext } from '@/providers/LoadingProvider';
import PillCombobox from '@/components/CarManage/PillCombobox';
import { carService, userService } from '@/services';
import { useState, useEffect } from 'react';
import isAuth from '@/components/Auth/auth';
import Section from '@/layouts/Section';
import { useRouter } from 'next/router';
import { Helmet } from 'react-helmet';

function RandomCarManage() {
  const dispatch = useCarDispatch();
  let cars = useCarSelector();
  const loadingContext = useLoadingContext();

  const router = useRouter()
  const [search, setSearch] = useState("");
  const [priceRange, setPriceRange] = useState(initialPriceRange);
  const [totalMakes, setTotalMakes] = useState([]);

  useEffect(() => {
    carService.getUniqueValues({
      columns: ['make']
    }).then((res) => {
      const justList = res.map((val) => val.make);
      setTotalMakes(justList);
      dispatch(updateFilter({ referal: 'RAN' }));
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user'))
    if (user) {
      userService.getById(user?.id).then(() => {
        if (userService.userValue?.role === "ADMIN" || userService.userValue?.role === "SUBADMIN") {
          router.push("/admin/randomcars");
        } else {
          router.push("/");
        }
      })
    } else {
      router.push("/");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const filterRandomCars = () => {
    let { data } = cars;
    const res = data && data.filter((data) => !data.referal && data.referal == null);
    cars = [{ data: res }];
  }

  useEffect(() => {
    loadingContext.setIsLoading(cars.loading);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cars.loading]);
  useEffect(() => {
    if (cars.data.length > 0) {
      filterRandomCars()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cars])

  let yearList = [];
  for (let year = 1930; year <= (new Date().getFullYear()); ++year)
    yearList.push(`${year}`);

  return (
    <>
      <Helmet title="Trade Dept | Random Cars" />

      <Section size="xl">
        <Grid>
          <Grid.Col span={{ base: 12, lg: 3, md: 4 }} visibleFrom='xs'>
            <Card
              withBorder
              mx="sm"
              radius="md"
              shadow="xl">
              <Card.Section withBorder inheritPadding p="lg">
                <Group>
                  <IconFilterSearch stroke={2.4} size={24} color="var(--mantine-color-ocean-blue-filled)" />
                  <Text fz={20} fw={600} c="ocean-blue">Filter</Text>
                </Group>
              </Card.Section>
              <Card.Section withBorder inheritPadding p="lg">
                <SegmentedControl
                  fullWidth
                  color='ocean-blue'
                  data={carStatus}
                  value={cars.filter.status}
                  onChange={status => dispatch(updateFilter({ status }))} />
              </Card.Section>
              <Card.Section withBorder inheritPadding p="lg">
                <Group mb="sm">
                  <IconCarSuv color="var(--mantine-color-ocean-blue-filled)" />
                  <Text fz={14}>Make & Model</Text>
                </Group>
                <PillCombobox
                  pillValues={totalMakes}
                  setSelectedValues={(makes) => dispatch(updateFilter({ makes }))}
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
                        let updatedYearTo = cars.filter.yearTo;
                        if (!selectedYearFrom) {
                          updatedYearTo = null;
                        }
                        if (selectedYearFrom > updatedYearTo) {
                          updatedYearTo = null;
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
                      onChange={(val) => {
                        dispatch(updateFilter({
                          yearTo: val,
                        }))
                      }
                      }
                    />
                  </Grid.Col>
                </Grid>
              </Card.Section>
              <Card.Section withBorder inheritPadding py="xl">
                <Grid>
                  <Grid.Col span={12}>
                    <Group>
                      <IconPremiumRights color="var(--mantine-color-ocean-blue-filled)" />
                      <Text fz={14}>Price: €{cars.filter.priceFrom} - €{cars.filter.priceTo}</Text>
                    </Group>
                  </Grid.Col>
                  <Grid.Col span={12}>
                    <RangeSlider
                      value={priceRange}
                      min={initialPriceRange[0]}
                      max={initialPriceRange[1]}
                      onChange={setPriceRange}
                      onChangeEnd={(range) => {
                        dispatch(updateFilter({
                          priceFrom: range[0],
                          priceTo: range[1],
                        }))
                      }}
                      label={(val) => (`€${val}`)}
                    />
                  </Grid.Col>
                </Grid>
              </Card.Section>
            </Card>
          </Grid.Col>
          <Grid.Col span={{ base: 12, lg: 9, md: 8 }}>
            <Grid m="sm" mb="lg">
              <Grid.Col span={12}>
                <form onSubmit={(e) => {
                  e.preventDefault()
                  dispatch(updateFilter({ search }))
                }
                }>
                  <Flex gap='15' direction={{ sm: 'row', base: 'column', }}>
                    <Input
                      leftSection={<IconSearch size={18} />}
                      rightSectionPointerEvents="all"
                      w="100%"
                      placeholder="Search by Year, Make, Model..."
                      radius="md"
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                    />
                    <Flex gap='10'>
                      <Button radius="md" w={{ sm: '180', base: '150' }} c='#000' onClick={(e) => dispatch(updateFilter({ search }))}>
                        Search
                      </Button>
                      <Button radius="md" w={{ sm: '180', base: '150' }} c='#000'
                        onClick={(e) => {
                          const search = ""
                          setSearch(search)
                          dispatch(updateFilter({ search }))
                        }}>
                        Reset
                      </Button>
                    </Flex>
                  </Flex>
                </form>
              </Grid.Col>
            </Grid>
            <CarCardManage
              carCount={cars.filtered.length}
              cList={cars.filtered}
              carType="Random" />
          </Grid.Col>
        </Grid>
      </Section>
    </>
  )
}

export default isAuth(RandomCarManage)