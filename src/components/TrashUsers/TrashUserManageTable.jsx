import { Grid, Modal, Table, ScrollArea, Text, TextInput, rem, Box } from '@mantine/core';
import classes from '@/styles/UserTable.module.css';
import { IconSearch } from '@tabler/icons-react';
import { useDisclosure } from '@mantine/hooks';
import { UserInfoForm } from './UserInfoForm';
import { addressToString } from '@/helpers';
import { useState, useEffect } from 'react';
import { userService } from '@/services';
import { ThICON, sortData } from '../TH';
import Pagination from '../Pagination';
import { toastShow } from '@/helpers';
import UserRow from './RowInfoTable';
import cx from 'clsx';

const TrashUserManageTable = (props) => {

  const [uList, setUList] = useState(props.uList);
  const [opened, { open, close }] = useDisclosure(false);
  const [userInfo, setUserInfo] = useState({});
  const [data, setData] = useState([]);
  const [scrolled, setScrolled] = useState(false);
  const [search, setSearch] = useState('');
  const [sortedData, setSortedData] = useState(data);
  const [sortBy, setSortBy] = useState(null);
  const [reverseSortDirection, setReverseSortDirection] = useState(false);

  const updateData = (userList) => {
    setData(
      userList
        .map((user, ind) => {
          let item = {};
          item.sr = (props.currentPage - 1) * 10 + ind + 1
          item.name = `${user.firstName} ${user.lastName}`;
          item.address = addressToString(user.address);
          item.dateOfBirth = user.dateOfBirth ? new Date(user.dateOfBirth).toDateString() : "";
          ["id", "email", "zipCode", "packageMode", "referal", "status", "avatar"].forEach((key) => {
            item[key] = user[key] ? user[key] : "";
          });
          return item;
        })
    );
  }

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

  const setSorting = (field) => {
    const reversed = field === sortBy ? !reverseSortDirection : true;
    setReverseSortDirection(reversed);
    setSortBy(field);
    setSortedData(sortData(data, { sortBy: field, reversed, search }));
  };

  const handleSearchChange = (event) => {
    const { value } = event.currentTarget;
    setSearch(value);
    setSortedData(sortData(data, { sortBy, reversed: reverseSortDirection, search: value }));
  };

  useEffect(() => {
    setSortedData(sortData(data, { sortBy, reversed: reverseSortDirection, search }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data]);

  useEffect(() => {
    setUList(props.uList);
    updateData(props.uList);
  }, [props.uList]);

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
        title="User Information"
        centered
      >
        <UserInfoForm {...userInfo} changeParams={changeParams} />
      </Modal>
      <ScrollArea>
        <Box style={{ overflow: "hidden" }}>
          <Grid px={{ sm: 0, xs: '15' }}>
            <Grid.Col span={{ sm: 4 }} offset={{ sm: 1 }} mt="xl">
              <TextInput
                placeholder="Search by any field"
                mb="md"
                leftSection={<IconSearch style={{ width: rem(16), height: rem(16) }} stroke={1.5} />}
                value={search}
                onChange={handleSearchChange}
              />
            </Grid.Col>
            <Grid.Col span={{ sm: 10 }} offset={{ sm: 1 }} mb={20}>
              <Box mah={600} style={{ overflow: "auto" }} onScrollPositionChange={({ y }) => setScrolled(y !== 0)}>
                <Table horizontalSpacing="md" verticalSpacing="xs" miw={1200} highlightOnHover>
                  <Table.Thead className={cx(classes.header, { [classes.scrolled]: scrolled })}>
                    <Table.Tr>
                      <ThICON
                        style={{ width: "10%" }}
                      >
                        Sr
                      </ThICON>
                      <ThICON
                        sorted={sortBy === 'id'}
                        reversed={reverseSortDirection}
                        onSort={() => setSorting('id')}
                        style={{ width: "7%" }}
                      >
                        ID
                      </ThICON>
                      <ThICON
                        sorted={sortBy === 'name'}
                        reversed={reverseSortDirection}
                        onSort={() => setSorting('name')}
                        style={{ width: "14%" }}
                      >
                        User
                      </ThICON>
                      <ThICON
                        sorted={sortBy === 'email'}
                        reversed={reverseSortDirection}
                        onSort={() => setSorting('email')}
                      >
                        Email
                      </ThICON>
                      <ThICON
                        sorted={sortBy === 'packageMode'}
                        reversed={reverseSortDirection}
                        onSort={() => setSorting('packageMode')}
                      >
                        Package
                      </ThICON>
                      <ThICON
                        sorted={sortBy === 'referal'}
                        reversed={reverseSortDirection}
                        onSort={() => setSorting('referal')}
                      >
                        Referral
                      </ThICON>
                      <ThICON
                        sorted={sortBy === 'status'}
                        reversed={reverseSortDirection}
                        onSort={() => setSorting('status')}
                        style={{ width: 150 }}
                      >
                        Status
                      </ThICON>
                      <ThICON
                        style={{ width: 150 }}
                      >
                        UnTrash
                      </ThICON>
                      <ThICON style={{ width: 150 }}>
                        Action
                      </ThICON>
                      <ThICON
                        style={{ width: 150 }}
                      >
                        View
                      </ThICON>

                    </Table.Tr>
                  </Table.Thead>
                  <Table.Tbody>
                    {sortedData.length > 0 ? (
                      <UserRow
                        sortedData={sortedData} uList={uList}
                        setUserInfo={setUserInfo} open={open}
                        currentloadPage={props.currentPage}
                        setCurrentloadedPage={props.setCurrentPage}
                        totalPages={props.totalPages}
                        refreshUsers={props.refreshUsers}
                      />
                    ) : (
                      <Table.Tr>
                        <Table.Td colSpan={9}>
                          <Text fw={500} ta="center">
                            No User found
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
      </ScrollArea>
    </>
  );
}
export default TrashUserManageTable
