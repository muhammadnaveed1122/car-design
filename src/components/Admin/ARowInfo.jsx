import { IconCircleCheck, IconForbid, IconEye, IconCheck, IconX, IconTrashX } from '@tabler/icons-react';
import { Avatar, Badge, Group, Switch, Table, Text, rem, useMantineTheme } from '@mantine/core';
import { userService } from '@/services';
import { toastShow } from '@/helpers';
import swal from "sweetalert"

const AdminRow = ({ sortedData, uList, setAdminInfo, open, refreshAdmins }) => {
    const theme = useMantineTheme();

    const handleToggleTrash = async (user) => {
        swal({
            content: {
                element: "div",
                attributes: {
                    innerHTML: `<h3 style="text-align: center;color: #fff;">Are you sure you want to trash this Sub-Admin?</h3>`,
                },
            },
            dangerMode: true,
            buttons: true,
            className: "buy-car-model",
        }).then(async (willBuy) => {
            if (willBuy) {
                const res = await userService.updateTrash(user.id)
                if (res) {
                    toastShow(res.message)
                    refreshAdmins()
                }
            }
        });
    }

    const deleteUser = async (user) => {
        swal({
            content: {
                element: "div",
                attributes: {
                    innerHTML: `<h3 style="text-align: center;color: #fff;">Are you sure you want to delete this Sub-Admin?</h3>`,
                },
            },
            dangerMode: true,
            buttons: true,
            className: "buy-car-model",
        }).then(async (willBuy) => {
            if (willBuy) {
                const res = await userService.delete(user.id)
                if (res) {
                    toastShow(`${user.role} deleted successfully`)
                    refreshAdmins()
                }
            }
        });
    }

    const handleClick = (user) => {
        const item = uList.filter((item) => item.id === user.id)[0];
        setAdminInfo(item);
        open();
    };

    return (
        <>
            {
                sortedData.map((user) => (
                    <Table.Tr key={user.id} style={{ cursor: "pointer" }}>
                        <Table.Td >
                            {user.sr}
                        </Table.Td>
                        <Table.Td>
                            {user.id}
                        </Table.Td>
                        <Table.Td>
                            <Group gap="sm" style={{ display: "flex", flexWrap: "nowrap" }}>
                                <Text size="sm" fw={500} style={{ textOverflow: "ellipsis", textWrap: "nowrap", overflow: "hidden" }}>
                                    {user.name}
                                </Text>
                            </Group>
                        </Table.Td>
                        <Table.Td style={{ wordWrap: 'break-word' }}>{user.email}</Table.Td>
                        <Table.Td>
                            {
                                user.status == 'APPROVED' ?
                                    <Badge py="sm" leftSection={<IconCircleCheck />} >{user.status}</Badge> :
                                    <Badge py="sm" leftSection={<IconForbid />} bg={user.status == 'PENDING' ? "yellow" : "red"}>{user.status}</Badge>
                            }
                        </Table.Td>
                        <Table.Td style={{ color: 'red' }}>
                            <Switch
                                key={user.id}
                                checked={user.isTrash ? false : true}
                                onChange={(event) => handleToggleTrash(user, event.currentTarget.checked)}
                                color="teal"
                                size="md"
                                thumbIcon={
                                    !user.isTrash ? (
                                        <IconCheck
                                            style={{ width: rem(12), height: rem(12) }}
                                            color={theme.colors.teal[6]}
                                            stroke={3}
                                        />
                                    ) : (
                                        <IconX
                                            style={{ width: rem(12), height: rem(12) }}
                                            color={theme.colors.red[6]}
                                            stroke={3}
                                        />
                                    )
                                }
                            />
                        </Table.Td>
                        <Table.Td style={{ color: 'red' }}>
                            <IconTrashX onClick={() => deleteUser(user)} />
                        </Table.Td>
                        <Table.Td>
                            <IconEye onClick={() => handleClick(user)} />
                        </Table.Td>
                    </Table.Tr>
                ))
            }
        </>
    );
};

export default AdminRow;