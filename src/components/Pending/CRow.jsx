import {  Button, Group, Switch, Table, Text, rem, useMantineTheme } from '@mantine/core';
import { IconCheck, IconX, IconTrashX } from '@tabler/icons-react';
import { carService } from '@/services';
import { toastShow } from '@/helpers';
import swal from "sweetalert";

const CRow = ({ sortedData, refreshCars, currentloadPage }) => {
    const theme = useMantineTheme();

    const handleToggleTrash = async (car) => {
        swal({
            content: {
                element: "div",
                attributes: {
                    innerHTML: `
                <h3 style="text-align: center;color: #fff;">Are you sure you want to trash this Sub-Admin?</h3>
              `,
                },
            },
            dangerMode: true,
            buttons: true,
            className: "buy-car-model",
        })
            .then(async (willBuy) => {
                if (willBuy) {
                    car.isPending = false
                    const res = await carService.update(car.id, car)
                    if (res) {
                        toastShow(res.message)
                        refreshCars()
                    }
                }
            });
    }
    const deleteUser = async (car) => {
        swal({
            content: {
                element: "div",
                attributes: {
                    innerHTML: `
                <h3 style="text-align: center;color: #fff;">Are you sure you want to delete this car?</h3>
              `,
                },
            },
            dangerMode: true,
            buttons: true,
            className: "buy-car-model",
        })
            .then(async (willBuy) => {
                if (willBuy) {
                    const res = await carService.delete(car.id)
                    if (res) {
                        toastShow("User deleted successfully")
                        refreshCars()
                    }
                }
            });
    }

    return (
        <>
            {sortedData.map((car, ind) => (

                <Table.Tr key={car.id} style={{ cursor: "pointer" }}>
                    <Table.Td >
                        {(currentloadPage - 1) * 10 + ind + 1}
                    </Table.Td>
                    <Table.Td>
                        {car.id}
                    </Table.Td>
                    <Table.Td>
                        <Group gap="sm" style={{ display: "flex", flexWrap: "nowrap" }}>
                            <Text size="sm" fw={500} style={{ textOverflow: "ellipsis", textWrap: "nowrap", overflow: "hidden" }}>
                                {`${car.make} ${car.model} ${car.year}`}
                            </Text>
                        </Group>
                    </Table.Td>
                    <Table.Td style={{ wordWrap: 'break-word' }}>{car.referal}</Table.Td>
                    <Table.Td style={{ wordWrap: 'break-word' }}>{car.price}</Table.Td>
                    <Table.Td style={{ wordWrap: 'break-word' }}>{car.mileage} mi</Table.Td>

                    <Table.Td style={{ wordWrap: 'break-word' }}>{getStatusIcon(car.status)}</Table.Td>

                    <Table.Td style={{ color: 'red' }}>
                        <Switch
                            key={car.id}
                            checked={car.isPending ? false : true}
                            onChange={(event) => handleToggleTrash(car, event.currentTarget.checked)}
                            color="teal"
                            size="md"
                            thumbIcon={
                                !car.isPending ? (
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
                        <IconTrashX onClick={() => deleteUser(car)} />
                    </Table.Td>
                </Table.Tr>
            ))
            }
        </>
    );
};

export default CRow;

const getStatusIcon = (status) => {
    switch (status) {
        case 'LIVE':
            return <Button style={{ backgroundColor: 'green' }} w="80px"  >{status} </Button>;
        case 'NEW':
            return <Button style={{ backgroundColor: 'blue' }} w="80px"  >{status} </Button>
        case 'ENDED':
            return <Button style={{ backgroundColor: 'red' }} w="80px" >{status} </Button>
        case 'PAID':
            return <Button style={{ backgroundColor: 'purple' }} w="80px" >{status} </Button>
        default:
            return null;
    }
};
