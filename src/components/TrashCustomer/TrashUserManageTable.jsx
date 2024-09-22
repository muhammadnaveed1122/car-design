import { Grid, Table, ScrollArea, Text, Box } from '@mantine/core';
import classes from '@/styles/UserTable.module.css';
import { addressToString } from '@/helpers';
import { useState, useEffect } from 'react';
import Pagination from '../Pagination';
import UserRow from './RowInfoTable';
import { Th } from '../TH';
import cx from 'clsx';

const TrashCustomerManageTable = (props) => {
  const [uList, setUList] = useState(props.uList);
  const [data, setData] = useState([]);
  const [scrolled, setScrolled] = useState(false);

  const updateData = (userList) => {
    setData(
      userList.map((car, ind) => {
        const address = JSON.parse(car.User.address);
        return {
          sr: (props.currentPage - 1) * 10 + ind + 1,
          id: car.id,
          CustomerId: car.User.id,
          carName: `${car.make} ${car.model}`,
          make: car.make,
          mileage: car.mileage,
          invoiceSent: car.invoiceSent,
          purchaseSteps: car.purchaseSteps,
          price: car.price,
          updatedAt: car.updatedAt,
          color: car.color,
          bidPrice: car.bidPrice,
          Year: car.year,
          lot: car.lot,
          engine: car.engine,
          vin: car.vin,
          zipCode: car.User.zipCode,
          referal: car.User.referal,
          street: address.streetLine,
          city: address.city,
          state: address.state,
          dateOfBirth: car.User.dateOfBirth ? new Date(car.User.dateOfBirth).toDateString() : "",
          email: car.User.email,
          avatar: car.User.avatar,
          userName: `${car.User.firstName} ${car.User.lastName}`,
          UserAddress: addressToString(car.User.address),
          UserPhone: car.User.phone,
          CarModel: car.model,
          doors: car.doors,
        };
      })
    );
  }

  useEffect(() => {
    setUList(props.uList);
    updateData(props.uList);
  }, [props.uList]);

  return (
    <>
      <ScrollArea>
        <Box style={{ overflow: "hidden" }}>
          <Grid px={{ sm: 0, xs: '15' }}>
            <Grid.Col span={{ sm: 10 }} offset={{ sm: 1 }} mb={20}>
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
                        style={{ width: "7%" }}
                      >
                        Car ID
                      </Th>
                      <Th
                        style={{ width: "15%" }}
                      >
                        User
                      </Th>
                      <Th
                        style={{ width: "15%" }}
                      >
                        Email
                      </Th>
                      <Th
                        style={{ width: "7%" }}
                      >
                        Referral Code
                      </Th>
                      <Th
                        style={{ width: "14%" }}
                      >
                        Car Name
                      </Th>
                      <Th
                        style={{ width: 150 }}
                      >
                        UnTrash
                      </Th>
                      <Th style={{ width: 150 }}>
                        Action
                      </Th>
                    </Table.Tr>
                  </Table.Thead>
                  <Table.Tbody>
                    {data.length > 0 ? (
                      <UserRow
                        sortedData={data} uList={uList}
                        currentloadPage={props.currentPage}
                        setCurrentloadedPage={props.setCurrentPage}
                        totalPages={props.totalPages}
                        fetchCustomer={props.refreshCustomer}
                      />
                    ) : (
                      <Table.Tr>
                        <Table.Td colSpan={9}>
                          <Text fw={500} ta="center">
                            No Customer found
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
export default TrashCustomerManageTable
