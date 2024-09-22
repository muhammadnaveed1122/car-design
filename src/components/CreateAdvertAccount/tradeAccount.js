import { Button, Checkbox, Container, Grid, Input, PasswordInput, Select, Text } from '@mantine/core'
import Link from 'next/link'
import React, { useEffect, useState } from 'react'
import { toastShow } from "@/helpers";
import { userService } from "@/services";
import { useForm } from '@mantine/form';
import { useRouter } from 'next/router';
const TradeAccount = ({ dark }) => {
    const form = useForm({
        initialValues: {
            firstName: '',
            companyName: '',
            companyNumber: '',
            vatNumber: '',
            companyWebsite: '',
            lastName: '',
            email: '',
            phone: '',
            displayName: '',
            password: '',
            confirmPassword: '',
            hearAboutUs: '',
            agreement: false,
        },

        validate: {
            firstName: (value) => (value ? null : 'First Name is required'),
            lastName: (value) => (value ? null : 'Last Name is required'),
            email: (value) => (/^\S+@\S+$/.test(value) ? null : 'Invalid email'),
            phone: (value) => (/^\d{10}$/.test(value) ? null : 'Invalid phone number'),
            displayName: (value) => (value ? null : 'Display Name is required'),
            password: (value) =>
                value.length >= 6 ? null : 'Password must be at least 6 characters long',
            confirmPassword: (value, values) =>
                value === values.password ? null : 'Passwords do not match',
            hearAboutUs: (value) => (value ? null : 'Please select an option'),
            agreement: (value) => (value ? null : 'You must agree to the terms'),
            companyName: (value) => (value ? null : 'Company Name is required'),
            companyNumber: (value) => (value ? null : 'Company Number is required'),
            vatNumber: (value) => (/^\d{9}$/.test(value) ? null : 'Invalid VAT Number'),
            companyWebsite: (value) =>
                /^(https?:\/\/)?([\w\d-]+\.)+[\w-]{2,4}\/?$/.test(value)
                    ? null
                    : 'Invalid company website URL',
        },
    });
    const [loading, setLoading] = useState(false);
    const router = useRouter()
    const handleSubmit = (data) => {
        data.role = "TRADER";
        const formData = new FormData();
        for (const key in data) {
            formData.append(key, data[key]);
        }
        setLoading(true)
        return userService
            .registerAccount(formData)
            .then(() => {
                toastShow("Registered successfuly!");
                setLoading(false);
                router.push('/')
            })
            .catch((error) => {
                toastShow(error, "error");
                setLoading(false);
            });
    }
    useEffect(() => {
        console.log("userService", userService.userValue)
        if (userService.userValue) {
            router.push('/create-advert')
        }
    }, [])
    return (
        <Container size='md' pb={60}>
            <form onSubmit={form.onSubmit(handleSubmit)}>
                <Grid p={{ base: '30 20', xs: "60 40" }} bd={dark ? '1px solid #707070' : '1px solid #C9C9C9'} radius='sm' bg={dark ? '#141414' : '#FFFFFF'} style={{ borderRadius: '6px', boxShadow: '0px 3px 6px #00000029' }}>
                    <Grid.Col span={{ base: 12, xs: 6 }}>
                        <Input.Wrapper label="Company Name" {...form.getInputProps("companyName")} withAsterisk>
                            <Input name="companyName" {...form.getInputProps('companyName')} onBlur={() => form.validateField('companyName')} />
                        </Input.Wrapper>
                    </Grid.Col>
                    <Grid.Col span={{ base: 12, xs: 6 }}>
                        <Input.Wrapper label="Company Number" {...form.getInputProps("companyNumber")} withAsterisk>
                            <Input name="companyNumber" {...form.getInputProps('companyNumber')} onBlur={() => form.validateField('companyNumber')} />
                        </Input.Wrapper>
                    </Grid.Col>
                    <Grid.Col span={{ base: 12, xs: 6 }}>
                        <Input.Wrapper label="VAT Number" {...form.getInputProps("vatNumber")} withAsterisk>
                            <Input name="vatNumber" {...form.getInputProps('vatNumber')} onBlur={() => form.validateField('vatNumber')} />
                        </Input.Wrapper>
                    </Grid.Col>

                    <Grid.Col span={{ base: 12, xs: 6 }}>
                        <Input.Wrapper label="Company Website" {...form.getInputProps("companyWebsite")} withAsterisk>
                            <Input name="companyWebsite" {...form.getInputProps('companyWebsite')} onBlur={() => form.validateField('companyWebsite')} />
                        </Input.Wrapper>
                    </Grid.Col>
                    <Grid.Col span={12} mb='sm'>
                        <Text fz={14}>Primary account holder name. This will be the individual that provides their identity documentation, usually this will be company director.</Text>
                    </Grid.Col>

                    <Grid.Col span={{ base: 12, xs: 6 }}>
                        <Input.Wrapper label="First Name" {...form.getInputProps("firstName")} withAsterisk>
                            <Input name="firstName" {...form.getInputProps('firstName')} onBlur={() => form.validateField('firstName')} />
                        </Input.Wrapper>
                    </Grid.Col>
                    <Grid.Col span={{ base: 12, xs: 6 }}>
                        <Input.Wrapper label="Last Name" {...form.getInputProps('lastName')} withAsterisk>
                            <Input name="lastName" {...form.getInputProps('lastName')} onBlur={() => form.validateField('lastName')} />
                        </Input.Wrapper>
                    </Grid.Col>
                    <Grid.Col span={{ base: 12, xs: 6 }}>
                        <Input.Wrapper label="Mobile Phone Number" {...form.getInputProps('phone')} withAsterisk>
                            <Input name="phone" type="text" {...form.getInputProps('phone')} onBlur={() => form.validateField('phone')} />
                        </Input.Wrapper>
                    </Grid.Col>

                    <Grid.Col span={{ base: 12, xs: 6 }}>
                        <Input.Wrapper label="Company Email Address"  {...form.getInputProps('email')} withAsterisk>
                            <Input name="email" type="email" {...form.getInputProps('email')} onBlur={() => form.validateField('email')} />
                        </Input.Wrapper>
                    </Grid.Col>
                    <Grid.Col span={{ base: 12, xs: 6 }}>
                        <Input.Wrapper label="Display Name" {...form.getInputProps('displayName')} withAsterisk>
                            <Input name="displayName" {...form.getInputProps('displayName')} onBlur={() => form.validateField('displayName')} />
                        </Input.Wrapper>
                    </Grid.Col>
                    <Grid.Col span={{ base: 12, xs: 6 }}>
                        <Input.Wrapper label="Password" withAsterisk>
                            <PasswordInput name="password"  {...form.getInputProps('password')} onBlur={() => form.validateField('password')} type="password" />
                        </Input.Wrapper>
                    </Grid.Col>

                    <Grid.Col span={{ base: 12, xs: 6 }}>
                        <Input.Wrapper label="Confirm Password" withAsterisk>
                            <PasswordInput name="confirmPassword" {...form.getInputProps('confirmPassword')} type="password" onBlur={() => form.validateField('confirmPassword')} />
                        </Input.Wrapper>
                    </Grid.Col>
                    <Grid.Col span={{ base: 12, xs: 6 }}>
                        <Input.Wrapper label="How Did You Hear About Us?" withAsterisk>
                            <Select
                                // label="Your favorite library"
                                {...form.getInputProps('hearAboutUs')}
                                placeholder="Pick value"
                                data={['React', 'Angular', 'Vue', 'Svelte']}
                                onBlur={() => form.validateField('hearAboutUs')}
                            />
                        </Input.Wrapper>
                    </Grid.Col>
                    <Grid.Col span={{ base: 12, xs: 6 }}>
                        <Checkbox
                            color="#3CDFCD"
                            variant="outline"
                            onBlur={() => form.validateField('agreement')}
                            {...form.getInputProps('agreement')}
                            label={
                                <Text fz={14}>
                                    I accept the
                                    <Link href="#" style={{ color: '#3CDFCD', margin: '0 4px' }}>
                                        Trade Dept
                                    </Link>
                                    and that personal data will be collected and process in accordance with
                                    <Link href="#" style={{ color: '#3CDFCD', margin: '0 4px' }}>
                                        Trade Dept Privacy & Cookies Policy
                                    </Link>
                                </Text>
                            }
                        />
                    </Grid.Col>
                    {/* <Grid.Col span={{ base: 12, xs: 6}}>
                        <Checkbox
                            color="#3CDFCD"
                            variant="outline"
                            size="md"
                            label={
                                <Text fz={14}>Join our newsletter to hear about classifieds,auctions and future events</Text>
                            }
                        />
                    </Grid.Col> */}

                    <Grid.Col span={12} mt={{ base: 'xs', xs: 'lg' }}>
                        <Button c='#040509' bd='none' radius='xl' size="md" type="submit" loading={loading} fullWidth>
                            Register
                        </Button>
                    </Grid.Col>
                </Grid>
            </form>
        </Container>
    )
}

export default TradeAccount