import { Modal, Button, Stack, TextInput, PasswordInput, Grid, InputLabel, Box, Text } from '@mantine/core';
import PhoneInput, { isValidPhoneNumber } from "react-phone-number-input";
import { userRole, userStatus } from '@/constants/data';
import { useDisclosure } from '@mantine/hooks';
import { userService } from '@/services';
import { useForm } from '@mantine/form';
import { toastShow } from '@/helpers';

const emailValidation = (val) =>
    val.length === 0
        ? "Input Email Address"
        : /^\S+@\S+\.\S+$/.test(val)
            ? null
            : "Invalid email";

const CreateModal = ({ setIsCreated, refreshAdmins }) => {
    const [opened, { close }] = useDisclosure(true);
    const form = useForm({
        initialValues: {
            referal: "",
            email: "",
            phone: "",
            password: "",
            confirmPassword: "",
            firstName: "",
            lastName: "",
            dateOfBirth: null,
            address: null,
            packageMode: null,
            avatar: null,
            image1: null,
            image2: null,
            terms: false,
            role: userRole[2],
            status: userStatus[2]
        },

        validate: {
            email: (val) => emailValidation(val),
            phone: (val) =>
                !isValidPhoneNumber(val)
                    ? "Input valid phone number"
                    : null,
            password: (val) => val.length < 6 ? "Password should include at least 6 characters" : null,
            confirmPassword: (value, values) => value !== values.password ? "Passwords did not match" : null,
            firstName: (val) => {
                if (val.trim().length === 0) {
                    return `Please input your first name ${val.startsWith(" ") ? "without space" : ""}`;
                } else if (val.trim().length < 2 || val.trim().length > 50) {
                    return "First name should be between 2 and 50 characters";
                }
                return null;
            },
            lastName: (val) => {
                if (val.trim().length === 0) {
                    return `Please input your last name ${val.startsWith(" ") ? "without space" : ""}`;
                } else if (val.trim().length < 2 || val.trim().length > 50) {
                    return "Last name should be between 2 and 50 characters";
                }
                return null;
            },
        },
    });

    const handleFormSubmit = (signUpData) => {
        const formData = new FormData();
        for (const key in signUpData) {
            if (key != "confirmPassword" && signUpData[key] != null)
                formData.append(key, signUpData[key]);
        }
        return userService.register(formData)
            .then(() => {
                toastShow("Registered successfuly!");
                close()
                setIsCreated(false)
                refreshAdmins()
            })
            .catch((error) => {
                toastShow(error, "error");
            });
    };
    return (
        <Modal opened={opened} onClose={() => { setIsCreated(false) }} title="Create Sub-Admin">
            <form onSubmit={form.onSubmit(handleFormSubmit)}>
                <Grid>
                    <Grid.Col span={6}>
                        <TextInput
                            required
                            label="First Name"
                            placeholder="Your first name"
                            value={form.values.firstName}
                            onChange={(event) => form.setFieldValue("firstName", event.currentTarget.value)}
                            error={form.errors.firstName}
                            {...form.getInputProps('firstName')}
                            radius="md"
                        />
                    </Grid.Col>
                    <Grid.Col span={6}>
                        <TextInput
                            required
                            label="Last Name"
                            placeholder="Your last name"
                            value={form.values.lastName}
                            onChange={(event) => form.setFieldValue("lastName", event.currentTarget.value)}
                            {...form.getInputProps('lastName')}
                            error={form.errors.lastName}
                            radius="md"
                        />
                    </Grid.Col>
                </Grid>
                <Stack>
                    <TextInput
                        required
                        label="Email"
                        placeholder="car@buyer.com"
                        value={form.values.email}
                        onChange={(event) => form.setFieldValue("email", event.currentTarget.value)}
                        error={form.errors.email}
                        radius="md"
                    />
                    <PasswordInput
                        required
                        label="Password"
                        placeholder="Your password"
                        value={form.values.password}
                        onChange={(event) => form.setFieldValue("password", event.currentTarget.value)}
                        error={form.errors.password}
                        radius="md"
                    />
                    <PasswordInput
                        label="Confirm password"
                        placeholder="Confirm password"
                        value={form.values.confirmPassword}
                        onChange={(event) => form.setFieldValue("confirmPassword", event.currentTarget.value)}
                        error={form.errors.confirmPassword}
                        radius="md"
                        required
                    />
                    <InputLabel>Phone Number <span style={{ color: "red" }}>*</span></InputLabel>
                    <PhoneInput
                        country="UK"
                        placeholder="Enter phone number"
                        value={form.values.phone}
                        onChange={(value) => {
                            if (typeof value === "string")
                                form.setFieldValue("phone", value);
                        }}
                        required
                    />
                    <Text c="red" fz={12} style={{ marginTop: 0 }}>
                        {form.errors.phone}
                    </Text>
                </Stack>
                <Box style={{ textAlign: 'right', paddingTop: "10px" }}>
                    <Button
                        type="submit"
                    > Create</Button>
                </Box>
            </form>
        </Modal>
    );
};

export default CreateModal;