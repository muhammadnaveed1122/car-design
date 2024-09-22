import { CarInfoCard } from '../CarManage/CarInfoCard';
import Section from '@/layouts/Section';
import { Grid } from '@mantine/core';
import React from 'react';

export default function Cars({ userValue, demoList, router }) {
    return (
        <>{
            userValue?.role !== "ADMIN" && demoList?.length > 0 &&
            <Section title="The Latest Vehicles" isGradient={false} style={{ paddingBottom: 0 }} >
                <Grid px="sm">
                    {
                        demoList.map((carData, i) => (
                            <Grid.Col span={{ base: 12, sm: 6, md: 4 }} key={`car${i}`}>
                                <CarInfoCard {...carData}
                                    onClick={() => {
                                        if (!userValue)
                                            router.push("/marketplace")
                                        else
                                            router.push("/marketplace")
                                    }}
                                />
                            </Grid.Col>
                        ))
                    }
                </Grid>
            </Section>
        }</>
    )
}
