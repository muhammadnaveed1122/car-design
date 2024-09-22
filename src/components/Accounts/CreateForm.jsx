import { Button, Flex, Grid, TextInput, Modal, Title, Checkbox } from '@mantine/core';
import { useLoadingContext } from '@/providers/LoadingProvider';
import { useDisclosure } from '@mantine/hooks';
import { accountsService } from '@/services';
import { useForm } from '@mantine/form';
import { toastShow } from '@/helpers';
import { useEffect } from 'react'

function CreateModal({ account = {}, setIsCreate, refreshAccounts }) {
    const { bankName, accountTitle, accountNumber, routingNumber, isActive, id } = account
    const [opened, { open, close }] = useDisclosure(false);
    const loadingContext = useLoadingContext()

    const form = useForm({
        initialValues: {
            bankName: bankName || '',
            accountTitle: accountTitle || '',
            accountNumber: accountNumber || '',
            routingNumber: routingNumber || '',
            isActive: isActive ?? false,
        },
        validate: {
            bankName: (value) => (value ? null : 'Please enter a bank name'),
            accountTitle: (value) => (value ? null : 'Please enter an account title'),
            accountNumber: (value) => (value ? null : 'Please enter an account number'),
            routingNumber: (value) => (value ? null : 'Please enter a routing number'),
        },
    });


    const handleSubmit = async (values) => {
        loadingContext.setIsLoading(true);

        try {
            let response;
            if (id) {
                response = await accountsService.update(id, values);
            } else {
                response = await accountsService.create(values);
            }

            toastShow(response.message);
            refreshAccounts();
            close();
            setIsCreate(false);
        } catch (error) {
            console.error('Error:', error);
            toastShow('An error occurred');
        } finally {
            loadingContext.setIsLoading(false);
        }
    };

    useEffect(() => {
        open()
    }, [])
    return (
        <Modal
            opened={opened}
            onClose={() => {
                setIsCreate(false)
                close()
            }}
            p="lg" centered
        >
            <form onSubmit={form.onSubmit(handleSubmit)}>

                <Title mb={20}> {id ? "Update Account" : "Create Account"}</Title>

                <Grid>
                    <Grid.Col>
                        <TextInput
                            withAsterisk
                            label="Bank Name"
                            rightSectionPointerEvents="all"
                            w="100%"
                            placeholder="Enter the Bank Name"
                            radius="md"
                            mb={"md"}
                            value={form.values.bankName}
                            onChange={(e) => form.setValues("bankName", e.target.value)}
                            {...form.getInputProps('bankName')}
                        />
                    </Grid.Col>
                </Grid>
                <Grid>
                    <Grid.Col>
                        <TextInput
                            label="Account Title"
                            withAsterisk
                            rightSectionPointerEvents="all"
                            w="100%"
                            placeholder="Enter the Account Title"
                            radius="md"
                            value={form.values.accountTitles}
                            mb={"md"}
                            onChange={(e) => form.setValues("accountTitle", e.target.value)}
                            {...form.getInputProps('accountTitle')}
                        />
                    </Grid.Col>
                </Grid>
                <Grid>
                    <Grid.Col>
                        <TextInput
                            withAsterisk
                            label="Account Number"
                            rightSectionPointerEvents="all"
                            w="100%"
                            placeholder="Enter the Account Number"
                            radius="md"
                            mb={"md"}
                            value={form.values.accountNumber}
                            onChange={(e) => form.setValues("accountNumber", e.target.value)}
                            {...form.getInputProps('accountNumber')}
                        />
                    </Grid.Col>
                </Grid>
                <Grid>
                    <Grid.Col>
                        <TextInput
                            label="Routing Number"
                            withAsterisk
                            rightSectionPointerEvents="all"
                            w="100%"
                            placeholder="Enter the Routing Number"
                            radius="md"
                            mb={"md"}
                            value={form.values.routingNumber}
                            onChange={(e) => form.setValues("routingNumber", e.target.value)}
                            {...form.getInputProps('routingNumber')}
                        />
                    </Grid.Col>
                </Grid>
                <Grid>
                    <Grid.Col>
                        <Checkbox
                            label="Active"
                            checked={form.values.isActive}
                            onChange={(event) =>
                                form.setFieldValue("isActive", event.currentTarget.checked)
                            }
                        />
                    </Grid.Col>
                </Grid>
                <Flex justify="end">
                    <Button w="120px" type="submit">{id ? "Update" : "Create"}</Button>
                </Flex>
            </form>
        </Modal>
    )
}

export default CreateModal