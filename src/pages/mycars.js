
import { Helmet } from 'react-helmet';
import Section from '@/layouts/Section';
import { useState, useEffect } from 'react';
import isAuth from '@/components/Auth/auth';
import { userCarService } from '@/services';
import PillCombobox from '@/components/CarManage/PillCombobox';
import { useLoadingContext } from '@/providers/LoadingProvider';
import CarCardManage from '@/components/Marketplace/CarCardManage';
import { initialPriceRange, userCarStatus } from '@/constants/data';
import { IconSearch, IconPremiumRights, IconCarSuv, IconFilterSearch } from '@tabler/icons-react';
import { Grid, Input, Button, Card, Group, Text, Select, RangeSlider, SegmentedControl, Flex } from '@mantine/core';
import { fetchUserCarsAsync, updateUserCarFilter, useUserCarDispatch, useUserCarSelector } from '@/redux/userCarsSlice';

function myfilteredCars() {

  let userCars = useUserCarSelector();
  const dispatch = useUserCarDispatch();
  const loadingContext = useLoadingContext();
  const mantineColor = "-var(--mantine-color-ocean-blue-filled)"

  const [search, setSearch] = useState("");
  const [totalMakes, setTotalMakes] = useState([]);
  const [priceRange, setPriceRange] = useState(initialPriceRange);

  const fetchData = async () => {
    try {
      await dispatch(fetchUserCarsAsync());
      const res = await userCarService.getUniqueValues({ columns: ['make'] });
      const justList = res.map((val) => val.make);
      setTotalMakes(justList);
      dispatch(updateUserCarFilter());
    } catch (error) {
    }
  };

  const filterRandomCars = () => {
    let { myfilteredCars } = userCars;
    const res = myfilteredCars && myfilteredCars.filter((data) => !data.referal && data.referal == null);
    userCars = [{ myfilteredCars: res }];
  }

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    loadingContext.setIsLoading(userCars.loading);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userCars.loading]);

  useEffect(() => {
    if (userCars.myfilteredCars.length > 0) {
      filterRandomCars()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userCars])
 
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
                  <IconFilterSearch stroke={2.4} size={24} color={mantineColor} />
                  <Text fz={20} fw={600} c="ocean-blue">Filter</Text>
                </Group>
              </Card.Section>
              <Card.Section withBorder inheritPadding p="lg">
                <SegmentedControl
                  fullWidth
                  color='ocean-blue'
                  data={userCarStatus}
                  value={userCars.userfiltered.status}
                  onChange={status => dispatch(updateUserCarFilter({ status }))}
                />
              </Card.Section>
              <Card.Section withBorder inheritPadding p="lg">
                <Group mb="sm">
                  <IconCarSuv color={mantineColor} />
                  <Text fz={14}>Make & Model</Text>
                </Group>
                <PillCombobox
                  pillValues={totalMakes}
                  setSelectedValues={(makes) => dispatch(updateUserCarFilter({ makes }))}

                />
              </Card.Section>
              <Card.Section withBorder inheritPadding p="lg">
                <Grid>
                  <Grid.Col span={6}>
                    <Select
                      checkIconPosition="left"
                      data={yearList}
                      placeholder="Year from"
                      value={userCars.userfiltered.yearFrom}
                      onChange={(val) => {
                        const selectedYearFrom = val;
                        let updatedYearTo = userCars.userfiltered?.yearTo;
                        if (!selectedYearFrom) {
                          updatedYearTo = null;
                        }
                        if (selectedYearFrom > updatedYearTo) {
                          updatedYearTo = null;
                        }
                        dispatch(
                          updateUserCarFilter({
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
                      data={yearList.filter(year => parseInt(year) >= parseInt(userCars.userfiltered.yearFrom))}
                      placeholder="Year to"
                      value={userCars.userfiltered.yearTo}
                      onChange={(val) => {
                        dispatch(updateUserCarFilter({
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
                      <IconPremiumRights color={mantineColor} />
                      <Text fz={14}>Price: €{userCars.userfiltered.priceFrom} - €{userCars.userfiltered.priceTo}</Text>
                    </Group>
                  </Grid.Col>
                  <Grid.Col span={12}>
                    <RangeSlider
                      value={priceRange}
                      min={initialPriceRange[0]}
                      max={initialPriceRange[1]}
                      onChange={setPriceRange}
                      onChangeEnd={(range) => {
                        dispatch(updateUserCarFilter({
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
                  dispatch(updateUserCarFilter({ search }))
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
                      <Button radius="md" w={{ sm: '180', base: '150' }} c='#000'
                        onClick={(e) => dispatch(updateUserCarFilter({ search }))}
                      >
                        Search
                      </Button>
                      <Button radius="md" w={{ sm: '180', base: '150' }} c='#000'
                        onClick={(e) => {
                          const search = ""
                          setSearch(search)
                          dispatch(updateUserCarFilter({ search }))
                        }}>
                        Reset
                      </Button>
                    </Flex>
                  </Flex>
                </form>
              </Grid.Col>
            </Grid>
            <CarCardManage
              carCount={userCars?.myfilteredCars?.length}
              cList={userCars?.myfilteredCars}
              carType={userCars?.userfiltered?.status}
              loading={userCars?.loading}
              fetchData={fetchData}
            />
          </Grid.Col>
        </Grid>
      </Section>
    </>
  )
}

export default isAuth(myfilteredCars)