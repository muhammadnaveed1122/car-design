import { IconRestore, IconTrashX } from '@tabler/icons-react';
import { Group, Table, Text } from '@mantine/core';
import { carService } from '@/services';
import { toastShow } from '@/helpers';
import swal from "sweetalert";

const UserRow = ({ sortedData, fetchCustomer }) => {


    const onTrashCall = async (user) => {
        swal({
            content: {
                element: "div",
                attributes: {
                    innerHTML: `
                <h3 style="text-align: center;color: #fff;">Are you sure you want to untrash this customer?</h3>
              `,
                },
            },
            dangerMode: true,
            buttons: true,
            className: "buy-car-model",
        })
            .then(async (willBuy) => {
                if (willBuy) {
                    const res = await carService.updateTrash(user.id)
                    if (res) {
                        toastShow(res.message)
                        fetchCustomer()
                    }
                }
            });
    }
    const DeleteCustomer = async (user) => {
        swal({
            content: {
                element: "div",
                attributes: {
                    innerHTML: `
                <h3 style="text-align: center;color: #fff;">Are you sure you want to delete this customer?</h3>
              `,
                },
            },
            dangerMode: true,
            buttons: true,
            className: "buy-car-model",
        })
            .then(async (willBuy) => {
                if (willBuy) {
                    const res = await carService.delete(user.id)
                    if (res) {
                        toastShow("Customer deleted successfully")
                        fetchCustomer()
                    }
                }
            });
    }
    return (
        <>
            {
                sortedData.map((user) => (
                    <Table.Tr key={user.id} style={{ cursor: "pointer" }}>
                        <Table.Td>
                            {user.sr}
                        </Table.Td>
                        <Table.Td>
                            {user.id}
                        </Table.Td>
                        <Table.Td>
                            <Group gap="sm" style={{ display: "flex", flexWrap: "nowrap" }}>
                                <Text size="sm" fw={500} style={{ textOverflow: "ellipsis", textWrap: "nowrap", overflow: "hidden" }}>
                                    {user.userName}
                                </Text>
                            </Group>
                        </Table.Td>
                        <Table.Td style={{ wordWrap: 'break-word' }}>{user.email}</Table.Td>
                        <Table.Td>{user.referal ? user.referal : '...'}</Table.Td>
                        <Table.Td style={{ wordWrap: 'break-word' }}>{user.carName}</Table.Td>
                        <Table.Td style={{ color: 'red' }}>
                            <IconRestore onClick={() => onTrashCall(user)} />
                        </Table.Td>
                        <Table.Td style={{ color: 'red' }}>
                            <IconTrashX onClick={() => DeleteCustomer(user)} />
                        </Table.Td>
                    </Table.Tr>
                ))
            }
        </>
    );
};

export default UserRow;