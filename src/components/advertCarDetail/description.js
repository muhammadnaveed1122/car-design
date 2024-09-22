import { Button, Container, Text, Textarea, Title } from '@mantine/core'
import React, { useState } from 'react'
import { useForm } from '@mantine/form';
import { userCarService } from "@/services";
import { toastShow } from "@/helpers";

const Description = ({ dark,carData }) => {
    console.log("🚀 ~ Description ~ carData:", carData)
    const [loader, setLoader] = useState(false)
    const initialValues = {
        specs: carData?.specs ?? "",
        id: carData?.id ?? "",
    }
    const form = useForm({
        initialValues: initialValues,
        validate: {
            specs: (value) => (value ? null : "Please enter a specs"),
        }
    });
    const updateDescription = async () => {
        setLoader(true);
        const formValues = form.values
        const formData = new FormData();
        for (const key in formValues) {
            formData.append(key, formValues[key]);
        }
        const updateCar = await userCarService.update(formValues.id, formData);
        if (updateCar) {
            toastShow("Please wait for admin approval");
            setLoader(false);
        } else {
            setLoader(true);
        }
    }


    return (
        <Container size='md' c={dark ? '#fff' : '#000'} pb={{ base: 60, md: 100 }} ta='center'>
            <Title order={2} fz={{ base: 32, sm: 40, lg: 45 }} mb={10} c='#3CDFCD'>Description</Title>
            <Text fz={{ base: 20, md: 24 }} mb={{ base: 30, md: 40 }}>You have not added a description yet. Cars with detailed description sell quicker.</Text>
            <form onSubmit={form.onSubmit(updateDescription)}>
            <Textarea
                placeholder='Add Description.....'
                value={form?.values?.specs}
                {...form.getInputProps('specs')}
                onChange={(event) => form.setFieldValue("specs", event.currentTarget.value)}
                onBlur={() => form.validateField('specs')}
                autosize
                minRows={4}
                rightSectionWidth={120}
                rightSection={
                    <>
                        <Button loading={loader} color='#3CDFCD' c='#000' size='lg' radius='xl' type='submit'>
                            Save
                        </Button>
                    </>
                }
            />
            </form>
        </Container>
    )
}

export default Description