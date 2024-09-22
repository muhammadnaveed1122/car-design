import { Button, Divider, Group, Modal, Stack, Table, Text } from '@mantine/core';
import { useLoadingContext } from '@/providers/LoadingProvider';
import { carService, userService } from '@/services';
import { verifyService } from '@/services';
import { useDisclosure } from '@mantine/hooks';
import { IconTrash } from '@tabler/icons-react';
import InvoiceModal from './invoiceModal';
import { toastShow } from '@/helpers';
import { useState } from 'react';
import swal from "sweetalert";

const UserRow = ({ sortedData, fetchCustomer }) => {
    const loadingContext = useLoadingContext();
    const [opened, { open, close }] = useDisclosure(false);
    const [customer, setCustomer] = useState({})
    const [isCreated, setIsCreate] = useState(false)
    const [selectedBank, setSeletedBank] = useState({})
    const [selectedCustomer, setSeletedCustomer] = useState({})
    const sendInvoice = async () => {
        delete selectedBank?.id
        delete selectedBank?.updatedAt
        delete selectedBank?.createdAt
        let merged = { ...selectedCustomer, ...selectedBank };
        verifyService.sendInvoiceToEmail(JSON.stringify(merged))
            .then((res) => {
                loadingContext.setIsLoading(false);
                toastShow(`${res.message}`)
            }).catch((err) => {
                loadingContext.setIsLoading(false);
                toastShow(err, "error")
            })
    }
    const sendBillOfSale = async (item) => {
        loadingContext.setIsLoading(true);

        verifyService.sendBillOfSalesToEmail(JSON.stringify(item))
            .then((res) => {
                loadingContext.setIsLoading(false);
                toastShow(`${res.message}`)
            }).catch((err) => {
                loadingContext.setIsLoading(false);
                toastShow(err, "error")
            })
    }

    const onTrashCall = async (user) => {
        swal({
            content: {
                element: "div",
                attributes: {
                    innerHTML: `
                <h3 style="text-align: center;color: #fff;">Are you sure you want to trash this customer?</h3>
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

    return (
        <>
            <Modal opened={opened} onClose={close} size="sm" centered>
                <Stack>
                    <Button disabled={customer.purchaseSteps === 0 ? false : true}
                        onClick={() => {
                            carService.updateSteps(customer.id, { purchaseSteps: 1 }).then(async (res) => {
                                await verifyService.sendMailStatus(JSON.stringify({ purchaseSteps: 1, email: customer.email, phoneNum: customer.phoneNum, carName: customer.carName, price: customer.bidPrice, name: customer.userName }))
                                toastShow(res.message)
                                fetchCustomer()
                            })
                            close()
                        }}
                    >Invoice & Bill of Sale</Button>
                    <Divider />
                    <Button disabled={customer.purchaseSteps === 1 ? false : true}
                        onClick={() => {

                            carService.updateSteps(customer.id, { purchaseSteps: 2 }).then(async (res) => {
                                await verifyService.sendMailStatus(JSON.stringify({ purchaseSteps: 2, email: customer.email, phoneNum: customer.phoneNum, carName: customer.carName, price: customer.bidPrice, name: customer.userName }))

                                toastShow(res.message)
                                fetchCustomer()
                            })
                            close()
                        }}
                    >Payment Confirmation</Button>
                    <Divider />
                    <Button disabled={customer.purchaseSteps === 2 ? false : true}
                        onClick={() => {
                            carService.updateSteps(customer.id, { purchaseSteps: 3 }).then(async (res) => {
                                await verifyService.sendMailStatus(JSON.stringify({ purchaseSteps: 3, email: customer.email, phoneNum: customer.phoneNum, carName: customer.carName, price: customer.bidPrice, name: customer.userName }))
                                toastShow(res.message)
                                fetchCustomer()
                            })
                            close()
                        }}
                    >Shipping Initiated</Button>
                    <Divider />
                    <Button disabled={customer.purchaseSteps === 3 ? false : true}
                        onClick={() => {
                            carService.updateSteps(customer.id, { purchaseSteps: 4 }).then(async (res) => {
                                await verifyService.sendMailStatus(JSON.stringify({ purchaseSteps: 4, email: customer.email, phoneNum: customer.phoneNum, carName: customer.carName, price: customer.bidPrice, name: customer.userName }))

                                toastShow(res.message)
                                fetchCustomer()
                            })
                            close()
                        }}
                    >Vehicle Dispatched</Button>
                    <Divider />
                    <Button disabled={customer.purchaseSteps != 4 ? true : false}
                        onClick={() => {
                            carService.updateSteps(customer.id, { purchaseSteps: 5 }).then(async (res) => {
                                await verifyService.sendMailStatus(JSON.stringify({ purchaseSteps: 5, email: customer.email, phoneNum: customer.phoneNum, carName: customer.carName, price: customer.bidPrice, name: customer.userName }))

                                userService.updateUserPurchase(customer.CustomerId, { inPurchase: 0 }).then((res2) => {
                                    fetchCustomer()
                                    close()
                                    toastShow(res.message)
                                })
                            })
                        }}
                    >Delivered</Button>
                </Stack>
            </Modal >
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
                        <Table.Td style={{ wordWrap: 'break-word' }}>
                            <Button
                                onClick={() => {
                                    setIsCreate(true);
                                    setSeletedCustomer(user)
                                }}
                            >
                                Send invoice
                            </Button>
                        </Table.Td>
                        <Table.Td style={{ wordWrap: 'break-word' }}><Button onClick={() => sendBillOfSale(user)}>Send bill of sale</Button> </Table.Td>
                        <Table.Td style={{ wordWrap: 'break-word' }}><Button onClick={() => {
                            setCustomer(user)
                            open()
                        }}>Purchase</Button> </Table.Td>
                        <Table.Td style={{ color: 'red' }}>
                            <IconTrash onClick={() => onTrashCall(user)} />
                        </Table.Td>
                    </Table.Tr>
                ))
            }
            {isCreated ? <InvoiceModal setIsCreated={setIsCreate} selectedBank={selectedBank} setSeletedBank={setSeletedBank} sendInvoice={sendInvoice} /> : null}
        </>
    );
};

export default UserRow;