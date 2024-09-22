import { Box, Button, Container, Grid, MantineProvider, Stack, Text, Textarea, TextInput, Title } from '@mantine/core'
import { Form, useForm } from '@mantine/form'
import React, { useState } from 'react'
import { verifyService } from "@/services";
import { TAC } from 'aws-sdk/clients/iotwireless';
import { toastShow } from "@/helpers";

const ContactUs = () => {
    const [loader, setLoader] = useState(false)
    const form = useForm({
        initialValues: {
            name: '',
            email: '',
            subject: '',
            message: '',
        },
        validate: {
            name: (value) => (value.trim().length < 2 ? 'Name must be at least 2 characters' : null),
            email: (value) => (/^\S+@\S+$/.test(value) ? null : 'Invalid email address'),
            subject: (value) => (value.trim().length < 2 ? 'Subject must be at least 2 characters' : null),
        },
    });

    // Handle form submission
    const handleSubmit = async (values) => {

        try {
            console.log('Form submitted with values:', values);
            setLoader(true);
            const response = await verifyService.sendContactUsEmail(values)
            console.log("🚀 ~ handleSubmit ~ response:", response)
            if (response.status) {
                toastShow(response.message);
                setLoader(false);
                form.reset();

            } else {
                toastShow(error, response.message);
                setLoader(false);

            }
        } catch (error) {
            toastShow(error, "error");
            setLoader(false);
        }
        // Submit form data (e.g., send to API)
    };
    return (
        <MantineProvider defaultColorScheme='dark'>
            <Container size='lg' py={{ base: '60px', sm: '80px' }}>
                <Title order={1} mb='50' ta='center'>Contact Us</Title>
                <Grid>
                    <Grid.Col span={{span: 12, md: 6}}>
                        <Stack gap='lg'>
                            <Box>
                                <Title order={4}>Trade Dept</Title>
                                <Text>Registered office address</Text>
                                <Text><Text component='span' fw={700}>Address:</Text> Bucuresti, Romania</Text>
                            </Box>
                            <Box>
                                <Title order={4}>Phone</Title>
                                <Text>0728115707</Text>
                            </Box>
                            <Box>
                                <Title order={4}>Mobile</Title>
                                <Text>+40726755561</Text>
                            </Box>
                            <Box>
                                <Title order={4}>Mail</Title>
                                <Text>contact@cexauto.ro</Text>
                            </Box>
                            <Box>
                                <Title order={4}>Working Hours</Title>
                                <Text>
                                    Tuesday 9 AM–5 PM<br />
                                    Wednesday Closed<br />
                                    Thursday 9 AM–5 PM<br />
                                    Friday 9 AM–5 PM<br />
                                    Saturday 8 AM–12 PM<br />
                                    Sunday Closed<br />
                                    Monday 9 AM–5 PM<br />
                                    Suggest new hours
                                </Text>
                            </Box>
                        </Stack>
                    </Grid.Col>
                    <Grid.Col span={{span: 12, md: 6}}>
                        <form onSubmit={form.onSubmit(handleSubmit)}>
                            <Stack gap={'lg'} p='xl' bd='1px solid #474747' style={{ borderRadius: '8px' }}>
                                <TextInput
                                    label='Your Name'
                                    placeholder='Enter your name'
                                    // name="name"
                                    withAsterisk
                                    {...form.getInputProps('name')}
                                    onBlur={() => form.validateField('name')}
                                />
                                <TextInput
                                    type='email'
                                    label='Your Email'
                                    placeholder='Enter your email'
                                    // name='email'
                                    withAsterisk
                                    {...form.getInputProps('email')}
                                    onBlur={() => form.validateField('email')}
                                />
                                <TextInput
                                    label='Subject'
                                    placeholder='Enter the subject'
                                    withAsterisk
                                    {...form.getInputProps('subject')}
                                    onBlur={() => form.validateField('name')}
                                />
                                <Textarea
                                    label='Your Message (optional)'
                                    placeholder='Type your message'
                                    value={form.values.message}
                                    {...form.getInputProps('message')}
                                    rows={3}
                                />
                                <Button type='submit' c={'#000'} loading={loader}>Submit</Button>
                            </Stack>
                        </form>
                    </Grid.Col>
                </Grid>
            </Container>
        </MantineProvider>
    )
}

export default ContactUs