import { fetchMarketplaceCarsAsync, resetUserCars, updateMarketPlaceCarFilter, useMarketPlaceCarDispatch, useMarketplaceCarSelector } from '@/redux/marketplaceSlice';
import { IconSearch, IconFilterSearch, IconCarSuv, IconPremiumRights, } from '@tabler/icons-react';
import { Grid, Input, Button, Card, Group, Text, Select, RangeSlider, Flex } from '@mantine/core';
import { useLoadingContext } from '@/providers/LoadingProvider';
import PillCombobox from '@/components/CarManage/PillCombobox';
import { useState, useEffect, useCallback } from 'react';
import MetaDecorator from "@/components/Meta/metaDecor";
import { initialPriceRange } from '@/constants/data';
import { useSearchParams } from 'next/navigation';
import { userCarService, userService } from '@/services';
import Section from '@/layouts/Section';
import { useRouter } from 'next/router';
import CarCardGridDesktop from '@/components/Marketplace/CardCardGrid';

function UserMarketplace() {

    let yearList = [];
    for (let year = 1930; year <= (new Date().getFullYear()); ++year)
        yearList.push(`${year}`);

    const router = useRouter()
    const cars = useMarketplaceCarSelector();
    const dispatch = useMarketPlaceCarDispatch();
    const searchParams = useSearchParams();
    const loadingContext = useLoadingContext();

    const searchParam = searchParams.get('search');

    const [totalMakes, setTotalMakes] = useState([]);
    const [search, setSearch] = useState(searchParam || '');
    const [priceRange, setPriceRange] = useState(initialPriceRange);

    const fetchData = useCallback(async () => {
        if (userService.userValue?.role === "USER") {
            const res = await userCarService.getMarketUniqueValues({
                columns: ['make']
            });
            const justList = res.map((val) => val.make);
            setTotalMakes(justList);
            dispatch(updateMarketPlaceCarFilter({ search }));
        }
    }, [userService.userValue, userCarService, dispatch]);

    useEffect(() => {
        loadingContext.setIsLoading(cars.loading);
    }, [cars.loading]);

    useEffect(() => {
        const user = JSON.parse(localStorage.getItem('user'));
        if (user) {
            userService.getById(user?.id).then((user) => {
                dispatch(fetchMarketplaceCarsAsync())
                if (userService.userValue?.role === "ADMIN") {
                    router.push("/admin/users");
                } else if (userService.userValue?.inPurchase) {
                    router.push("/progress");
                }
            });
        }
        fetchData()
        dispatch(fetchMarketplaceCarsAsync())
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
    useEffect(() => {
        console.log(searchParam)
        if (searchParam) {
            dispatch(updateMarketPlaceCarFilter({ search: searchParam }))
            setSearch(searchParam)
        }
    }, [searchParam])

    return (
        <>
            <MetaDecorator title='Trade Dept | Marketplace' />
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
                                <PillCombobox
                                    pillValues={totalMakes}
                                    setSelectedValues={(makes) => dispatch(updateMarketPlaceCarFilter({ makes }))}
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
                                                    updateMarketPlaceCarFilter({
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
                                            onChange={(val) => dispatch(updateMarketPlaceCarFilter({
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
                                                dispatch(updateMarketPlaceCarFilter({
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
                    <Grid.Col span={{ base: 12, md: 9 }}>
                        <Grid m="sm" mb="lg">
                            <Grid.Col span={12}>
                                <form onSubmit={(e) => {
                                    e.preventDefault()
                                    dispatch(updateMarketPlaceCarFilter({ search }))
                                }}>
                                    <Flex gap='15' direction={{ sm: 'row', base: 'column', }}>
                                        <Input
                                            leftSection={<IconSearch size={18} />}
                                            rightSectionPointerEvents="all"
                                            w="100%"
                                            placeholder="Search by Year, Make, Model ..."
                                            radius="md"
                                            value={search}
                                            onChange={(e) => setSearch(e.target.value)}
                                        />
                                        <Flex gap='10'>
                                            <Button radius="md" w={{ sm: '180', base: '150' }} c='#000' onClick={(e) => dispatch(updateMarketPlaceCarFilter({ search }))}>
                                                Search
                                            </Button>
                                            <Button radius="md" w={{ sm: '180', base: '150' }} c='#000'
                                                onClick={(e) => {
                                                    const search = ""
                                                    setSearch(search)
                                                    dispatch(resetUserCars({ search }))
                                                }}>
                                                Reset
                                            </Button>
                                        </Flex>
                                    </Flex>
                                </form>
                            </Grid.Col>
                        </Grid>
                        <CarCardGridDesktop
                            carCount={cars?.filtered?.length}
                            cList={cars.filtered} />
                    </Grid.Col>

                </Grid>
            </Section>
        </>
    )
}
export default (UserMarketplace)