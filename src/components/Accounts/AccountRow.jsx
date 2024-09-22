import { IconForbid, IconEdit, IconTrash, IconCircleCheck } from '@tabler/icons-react';
import { useLoadingContext } from '@/providers/LoadingProvider';
import { Badge, Group, Table, Text } from '@mantine/core';
import { accountsService } from '@/services';
import CreateModal from './CreateForm';
import { toastShow } from '@/helpers';
import { useState } from 'react';
import swal from "sweetalert";

// Functional component for rendering a row in the accounts table
const AccountRow = ({ sortedData, refreshAccounts }) => {
    // Using custom hook to access loading context
    const loadingContext = useLoadingContext();
    // State to manage the creation modal
    const [isCreated, setIsCreated] = useState(false);
    // State to store the selected account for update
    const [uAccount, setUAccount] = useState({});

    // Function to delete an account
    const deleteAccount = async (id) => {
        // Show confirmation dialog
        const willBuy = await swal({
            content: {
                element: "div",
                attributes: {
                    innerHTML:
                        `<h3 style="text-align: center;color: #fff;">Are you sure you want to delete this bank account?</h3>`,
                },
            },
            dangerMode: true,
            buttons: true,
            className: "buy-car-model",
        });

        // If user confirms deletion
        if (willBuy) {
            try {
                // Set loading state to true
                loadingContext.setIsLoading(true);
                // Send request to delete account
                const response = await accountsService.delete(id);
                // Show toast message with response
                toastShow(response.message);
                // Refresh accounts after deletion
                refreshAccounts();
            } catch (error) {
                console.error('Error:', error);
                toastShow('An error occurred while deleting the account');
            } finally {
                // Set loading state to false
                loadingContext.setIsLoading(false);
            }
        }
    };

    return (
        <>
            {/* Mapping over sorted data to render each account */}
            {sortedData.map((account) => (
                <Table.Tr key={account.id} style={{ cursor: "pointer" }}>
                    <Table.Td>{account.id}</Table.Td>
                    <Table.Td>
                        <Group gap="sm" style={{ display: "flex", flexWrap: "nowrap" }}>
                            <Text size="sm" fw={500} style={{ textOverflow: "ellipsis", textWrap: "nowrap", overflow: "hidden" }}>
                                {account.bankName}
                            </Text>
                        </Group>
                    </Table.Td>
                    <Table.Td style={{ wordWrap: 'break-word' }}>{account.accountTitle}</Table.Td>
                    <Table.Td>{account.accountNumber}</Table.Td>
                    <Table.Td style={{ wordWrap: 'break-word' }}>{account.routingNumber}</Table.Td>
                    <Table.Td>
                        {/* Displaying badge based on account isActive status */}
                        {account.isActive ?
                            <Badge py="sm" leftSection={<IconCircleCheck />} bg="green" >active</Badge> :
                            <Badge py="sm" leftSection={<IconForbid />} bg="red" >inActive </Badge>}
                    </Table.Td>
                    <Table.Td>
                        {/* Edit icon to open update modal */}
                        <IconEdit color="white"
                            onClick={() => {
                                setUAccount(account);
                                setIsCreated(true);
                            }}
                        />
                    </Table.Td>
                    <Table.Td>
                        {/* Trash icon to delete account */}
                        <IconTrash color='red' onClick={() => deleteAccount(account.id)} />
                    </Table.Td>
                </Table.Tr>
            ))}

            {/* Rendering create modal if isCreated is true */}
            {isCreated ? <CreateModal account={uAccount} setIsCreate={setIsCreated} refreshAccounts={refreshAccounts} /> : null}
        </>
    );
};

export default AccountRow;