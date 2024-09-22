import { Grid, Table, ScrollArea, Text, Box } from '@mantine/core';
import classes from '@/styles/UserTable.module.css';
import Pagination from '../Pagination';
import { useState } from 'react';
import { Th } from '../TH';
import CRow from './CRow';
import cx from 'clsx';

const CarsListing = (props) => {
    const { cList, currentPage, setCurrentPage, refreshCars, totalPages } = props
    const [scrolled, setScrolled] = useState(false);

    return (
        <>
            <ScrollArea>
                <Box style={{ overflow: "hidden" }}>
                    <Grid px={{ sm: 0, xs: '15' }}>
                        <Grid.Col span={{ sm: 10 }} offset={{ sm: 1 }} mb={20} mt={20}>
                            <Box mah={600} style={{ overflow: "auto" }} onScrollPositionChange={({ y }) => setScrolled(y !== 0)}>
                                <Table horizontalSpacing="md" verticalSpacing="xs" miw={1200} highlightOnHover>
                                    <Table.Thead className={cx(classes.header, { [classes.scrolled]: scrolled })}>
                                        <Table.Tr>
                                            <Th
                                                style={{ width: "80px" }}

                                            >
                                                Sr
                                            </Th>
                                            <Th
                                                style={{ width: "80px" }}
                                            >
                                                ID
                                            </Th>
                                            <Th
                                                style={{ width: "80px" }}
                                            >
                                                Car Name
                                            </Th>
                                            <Th
                                                style={{ width: "80px" }}
                                            >
                                                Referral
                                            </Th>
                                            <Th>
                                                Price
                                            </Th>
                                            <Th>
                                                Mileage
                                            </Th>
                                            <Th
                                                style={{ width: "90px" }}
                                            >
                                                Status
                                            </Th>
                                            <Th
                                                style={{ width: "80px" }}
                                            >
                                                Pending
                                            </Th>
                                            <Th
                                                style={{ width: "80px" }}
                                            >
                                                Delete
                                            </Th>
                                        </Table.Tr>
                                    </Table.Thead>
                                    <Table.Tbody>
                                        {cList.length > 0 ? (

                                            <CRow
                                                sortedData={cList}
                                                currentloadPage={currentPage}
                                                setCurrentloadedPage={setCurrentPage}
                                                totalPages={totalPages}
                                                refreshCars={refreshCars}
                                            />
                                        ) : (
                                            <Table.Tr>
                                                <Table.Td colSpan={9}>
                                                    <Text fw={500} ta="center">
                                                        No Cars found
                                                    </Text>
                                                </Table.Td>
                                            </Table.Tr>
                                        )}
                                    </Table.Tbody>
                                </Table>
                            </Box>
                            <Pagination totalPages={totalPages}
                                currentloadPage={currentPage}
                                setCurrentPage={setCurrentPage}
                            />
                        </Grid.Col>
                    </Grid>
                </Box>
            </ScrollArea>
        </>
    );
}
export default CarsListing
