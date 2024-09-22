import { Grid, Table, ScrollArea, Text, Box, Group, TextInput, rem, Modal, Button } from '@mantine/core';
import { UserInfoForm } from '../TrashUsers/UserInfoForm';
import { addressToString, toastShow } from '@/helpers';
import classes from '@/styles/UserTable.module.css';
import { IconSearch } from '@tabler/icons-react';
import { useDisclosure } from '@mantine/hooks';
import { useState, useEffect } from 'react';
import { ThICON, sortData } from '../TH';
import { userService } from '@/services';
import Pagination from '../Pagination';
import CreateModal from './ACreate';
import AdminRow from './ARowInfo';
import cx from 'clsx';

const AList = (props) => {

    const [uList, setUList] = useState(props.aList);
    const [data, setData] = useState([]);
    const [scrolled, setScrolled] = useState(false);
    const [sortBy, setSortBy] = useState(null);
    const [reverseSortDirection, setReverseSortDirection] = useState(false);
    const [sortedData, setSortedData] = useState(data);
    const [search, setSearch] = useState('');
    const [adminInfo, setAdminInfo] = useState({});
    const [opened, { open, close }] = useDisclosure(false);
    const [isCreate, setIsCreated] = useState(false)

    const updateData = (userList) => {
        setData(
            userList.map((user, index) => {
                const { id, email, zipCode, packageMode, referal, status, avatar, role, isTrash } = user;
                return {
                    sr: (props.currentPage - 1) * 10 + index + 1,
                    name: `${user.firstName} ${user.lastName}`,
                    address: addressToString(user.address),
                    dateOfBirth: user.dateOfBirth ? new Date(user.dateOfBirth).toDateString() : "",
                    id: id || "",
                    email: email || "",
                    zipCode: zipCode || "",
                    packageMode: packageMode || "",
                    referal: referal || "",
                    status: status || "",
                    avatar: avatar || "",
                    role: role || "",
                    isTrash: isTrash || ""
                };
            })
        );
    };


    const changeParams = (userID, params, ref) => {
        userService.update(userID, params).then(() => {

            ref ? toastShow('Referral Code updated successfully') : toastShow("Updated successfully")
        });
        const data = uList.map((user) => {
            if (user.id === userID)
                return {
                    ...user,
                    ...params,
                };
            return user;
        });
        setUList(data);
        updateData(data);
    }

    const handleSearchChange = (event) => {
        const { value } = event.currentTarget;
        setSearch(value);
        setSortedData(sortData(data, { sortBy, reversed: reverseSortDirection, search: value }));
    };

    const setSorting = (field) => {
        const reversed = field === sortBy ? !reverseSortDirection : true;
        setReverseSortDirection(reversed);
        setSortBy(field);
        setSortedData(sortData(data, { sortBy: field, reversed, search }));
    };

    useEffect(() => {
        setSortedData(sortData(data, { sortBy, reversed: reverseSortDirection, search }));
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [data]);

    useEffect(() => {
        setUList(props.aList);
        updateData(props.aList);
    }, [props.aList]);

    return (
        <>
            <Modal
                size="xl"
                opened={opened}
                onClose={close}
                overlayProps={{
                    backgroundOpacity: 0.55,
                    blur: 3,
                }}
                title="Admin Information"
                centered
            >
                <UserInfoForm {...adminInfo} changeParams={changeParams} />
            </Modal>
            <ScrollArea>
                <Box style={{ overflow: "hidden" }}>
                    <Grid px={{ sm: 0, xs: '15' }}>
                        <Grid.Col span={{ sm: 10 }} offset={{ sm: 1 }} mb={20} mt={20}>
                            <Group justify="space-between" my="md">
                                <TextInput
                                    placeholder="Search by any field"
                                    w="100%"
                                    maw="400px"
                                    leftSection={<IconSearch style={{ width: rem(16), height: rem(16) }} stroke={1.5} />}
                                    value={search}
                                    onChange={handleSearchChange}
                                />
                                <Box style={{ textAlign: 'right' }}>
                                    <Button onClick={() => setIsCreated(true)}>Create</Button>
                                </Box>
                            </Group>
                            <Box mah={600} style={{ overflow: "auto" }} onScrollPositionChange={({ y }) => setScrolled(y !== 0)}>
                                <Table horizontalSpacing="md" verticalSpacing="xs" miw={1200} highlightOnHover>
                                    <Table.Thead className={cx(classes.header, { [classes.scrolled]: scrolled })}>
                                        <Table.Tr>
                                            <ThICON
                                                sorted={sortBy === 'sr'}
                                                reversed={reverseSortDirection}
                                                style={{ width: "80px" }}
                                                onSort={() => setSorting('sr')}
                                            >
                                                Sr
                                            </ThICON>
                                            <ThICON
                                                sorted={sortBy === 'id'}
                                                reversed={reverseSortDirection}
                                                onSort={() => setSorting('id')}
                                                style={{ width: "80px" }}
                                            >
                                                ID
                                            </ThICON>
                                            <ThICON
                                                sorted={sortBy === 'name'}
                                                reversed={reverseSortDirection}
                                                onSort={() => setSorting('name')}
                                                style={{ width: "80px" }}
                                            >
                                                User
                                            </ThICON>
                                            <ThICON
                                                sorted={sortBy === 'email'}
                                                reversed={reverseSortDirection}
                                                onSort={() => setSorting('email')}
                                                style={{ width: "80px" }}
                                            >
                                                Email
                                            </ThICON>
                                            <ThICON
                                                sorted={sortBy === 'status'}
                                                reversed={reverseSortDirection}
                                                onSort={() => setSorting('status')}
                                                style={{ width: "80px" }}
                                            >
                                                Status
                                            </ThICON>
                                            <ThICON
                                                style={{ width: "80px" }}
                                            >
                                                Trash
                                            </ThICON>

                                            <ThICON
                                                style={{ width: "80px" }}
                                            >
                                                Delete
                                            </ThICON>
                                            <ThICON
                                                style={{ width: "80px" }}
                                            >
                                                View
                                            </ThICON>
                                        </Table.Tr>
                                    </Table.Thead>
                                    <Table.Tbody>
                                        {
                                            sortedData.length > 0 ? (
                                                <AdminRow
                                                    sortedData={sortedData} uList={uList}
                                                    setAdminInfo={setAdminInfo} open={open}
                                                    currentloadPage={props.currentPage}
                                                    setCurrentloadedPage={props.setCurrentPage}
                                                    totalPages={props.totalPages}
                                                    refreshAdmins={props.refreshAdmins}
                                                />
                                            ) : (
                                                <Table.Tr>
                                                    <Table.Td colSpan={9}>
                                                        <Text fw={500} ta="center">
                                                            No Admin found
                                                        </Text>
                                                    </Table.Td>
                                                </Table.Tr>
                                            )}
                                    </Table.Tbody>
                                </Table>
                            </Box>
                            <Pagination totalPages={props.totalPages}
                                currentloadPage={props.currentPage}
                                setCurrentPage={props.setCurrentPage}
                            />
                        </Grid.Col>
                    </Grid>
                </Box>
                {isCreate ? <CreateModal setIsCreated={setIsCreated} refreshAdmins={props.refreshAdmins} /> : ''}
            </ScrollArea>
        </>
    );
}
export default AList
