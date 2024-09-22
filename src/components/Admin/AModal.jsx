import { Modal, Button, Radio, Flex, Stack } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { accountsService } from '@/services';
import { useEffect, useState } from 'react';

const InvoiceModal = ({ setIsCreated, selectedBank, setSeletedBank, sendInvoice }) => {
    const [opened, { close }] = useDisclosure(true);
    const [accounts, setAccount] = useState([]);

    const refreshAccounts = async () => {
        accountsService.getAllActiveAccounts().then((res) => {
            if (res.accounts.length > 0) {
                setSeletedBank(res.accounts[0]);
            }
            setAccount(res.accounts);
        });
    };

    useEffect(() => {
        refreshAccounts();
    }, []);

    return (
        <Modal opened={opened} onClose={() => { setIsCreated(false), close() }} title="Accounts list">
            <Radio.Group
                name="bankaccount"
                label="Select bank account"
                withAsterisk
                onChange={(e) => setSeletedBank(JSON.parse(e))}
                value={JSON.stringify(selectedBank)}
                my="md"
            >
                <Stack my="xs">
                    {
                        accounts && accounts.length > 0 &&
                        accounts.map(account => (
                            <Radio
                                key={account.id}
                                label={
                                    `${account.bankName} - ${account.accountTitle} - ${account.accountNumber}`
                                }
                                value={JSON.stringify(account)}
                            />
                        ))
                    }
                </Stack>
            </Radio.Group>
            <Flex justify="end">
                <Button onClick={() => {
                    sendInvoice()
                    setIsCreated(false)
                    close()
                }} disabled={Object.keys(selectedBank).length === 0}>
                    Send Invoice
                </Button>
            </Flex>
        </Modal>
    );
};

export default InvoiceModal;