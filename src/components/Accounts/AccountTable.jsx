import {Grid, Table, ScrollArea, Group, Box, Button,} from '@mantine/core';
import NoAccountFound from '../NotFount/DataNotFound';
import classes from '@/styles/UserTable.module.css';
import { useState, useEffect } from 'react';
import Pagination from '../Pagination';
import AccountRow from './AccountRow';
import CreateModal from './CreateForm';
import { Th } from '../TH';
import cx from 'clsx';

const columns = [
    { title: 'Account ID', width: '7%' },
    { title: 'Bank Name', width: '7%' },
    { title: 'Account Title', width: '7%' },
    { title: 'Account Number', width: '7%' },
    { title: 'Routing Number', width: '7%' },
    { title: 'Active', width: '7%' },
    { title: 'Edit', width: '7%' },
    { title: 'Action', width: '7%' }
];

const AccountTable = ({ aList, refreshAccounts, setCurrentPage, totalPages, currentPage }) => {
    const [data, setData] = useState([]);
    const [scrolled, setScrolled] = useState(false);
    const [isCreated, setIsCreated] = useState(false)

    const updateData = (userList) => {
        setData(
            userList.map(({ id, bankName, accountTitle, accountNumber, routingNumber, isActive }) => ({
                id,
                bankName,
                accountTitle,
                accountNumber,
                routingNumber,
                isActive: isActive || false,
            }))
        );
    };

    useEffect(() => {
        updateData(aList);
    }, [aList]);

    return (
        <>
            <ScrollArea>
                <Box style={{ overflow: "hidden" }}>
                    <Grid px={{ sm: 0, xs: '15' }}>
                        <Grid.Col span={{ sm: 10 }} offset={{ sm: 1 }} mb={20}>
                            <Group p="lg" justify='end'>
                                <Button bg="green" onClick={() => {
                                    setIsCreated(true);
                                }}>Create</Button>
                            </Group>
                            <Box mah={600} style={{ overflow: "auto" }} onScrollPositionChange={({ y }) => setScrolled(y !== 0)}>
                                <Table horizontalSpacing="md" verticalSpacing="xs" miw={1200} highlightOnHover>
                                    <Table.Thead className={cx(classes.header, { [classes.scrolled]: scrolled })}>
                                        <Table.Tr>
                                            {
                                                columns.map(
                                                    ({ width, title }, index) =>
                                                    (
                                                        <Th key={index} style={{ width: width }}>
                                                            {title}
                                                        </Th>
                                                    ))
                                            }
                                        </Table.Tr>
                                    </Table.Thead>
                                    <Table.Tbody>
                                        {data.length > 0 ? (
                                            <AccountRow
                                                sortedData={data} aList={aList}
                                                refreshAccounts={refreshAccounts}
                                            />
                                        ) : (
                                            <NoAccountFound description={"No Account Found"} />
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
                {isCreated ? <CreateModal setIsCreate={setIsCreated} refreshAccounts={refreshAccounts} /> : null}
            </ScrollArea>
        </>
    );
}
export default AccountTable