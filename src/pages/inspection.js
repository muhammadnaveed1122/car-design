import { Accordion, Container, Grid } from "@mantine/core";
import { IconCheck, IconPlus } from "@tabler/icons-react";
import MetaDecorator from "@/components/Meta/metaDecor";
import groceries from "../components/accordion.json"
import style from '../styles/inspection.module.css'
import React from 'react'

const Inspection = () => {
    return (
        <>
            <MetaDecorator title='Trade Dept | Inspection' />
            <div className={style.vehicleInspectionContainer}>
                <div className="header-text1 mb-0">
                    <Container size="xl">
                        <Grid align="center">
                            <Grid.Col span={{ xl: 5, lg: 6, md: 12, sm: 12 }}>
                                <div className={style.vehicleInspectionImg}>
                                    <img src="assets/4.webp" />
                                </div>
                            </Grid.Col>
                            <Grid.Col span={{ xl: 7, lg: 6, md: 12, sm: 12 }}>
                                <div className={style.vehicleInspectionContent}>
                                    <h3>Vehicle Inspection</h3>
                                    <p>Our highly trained technicians go the extra mile to make sure the
                                        car you buy is in great condition</p>
                                    <h3>Peace of mind</h3>
                                    <p>Before we market any car, it goes through a full 299-point check.
                                        This means inspecting everything you’d expect and more - from bonnet to boot. Just think
                                        of it as 299 reasons to be reassured you’re buying a quality car that’s safe to drive.
                                    </p>
                                    <h3>What we inspect</h3>
                                    <p>We check all things big and small to ensure our cars are in great
                                        working order for their age, condition and mileage. Please see below a complete list.
                                    </p>
                                </div>
                            </Grid.Col>
                        </Grid>
                    </Container>
                </div>
            </div>
            <div className={`sptb ${style.accordionContainer}`}>
                <Container size="xl">
                    <div className={style.accordionContent}>
                        <Accordion
                            classNames={{ chevron: style.chevron }}
                            chevron={<IconPlus className={style.icon} />} >
                            {groceries.map((item, index) => (
                                <Accordion.Item key={index} value={`key_${index}`} className={style.mantine_accordion_item}>
                                    <Accordion.Control className={style.mantine_Accordion_control}>{item.value}</Accordion.Control>
                                    <Accordion.Panel className={style.mantine_Accordion_panel}>
                                        <ul className={style.accorList}>
                                            {item.list.map((para, i) => <li key={i}> <IconCheck color="green" /> {para}</li>)}
                                        </ul>
                                    </Accordion.Panel>
                                </Accordion.Item>
                            ))}
                        </Accordion>
                    </div>
                </Container>
            </div>
            <section className={style.bgBlue}>
                <Container size="xl">
                    <div className={style.sectionHeading}>
                        <h3>Not just a transport service</h3>
                        <p>We want to make sure that you’re properly introduced to your new car.</p>
                    </div>
                    <div className={style.itemAll}>
                        <Grid>
                            <Grid.Col span={{ lg: 4, md: 12 }}>
                                <div className={style.cardBgDark}>
                                    <div className="p-7">
                                        <div className="status-info1">
                                            <div className="bgSvg">
                                                <svg xmlns="http://www.w3.org/2000/svg" width="50" height="50" viewBox="0 0 24 24" fill="none" stroke="#3CDFCD" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="tabler-icon tabler-icon-list-check" style={{ width: "calc(3.125rem * var(--mantine-scale))", height: "calc(3.125rem * var(--mantine-scale))" }}><path d="M3.5 5.5l1.5 1.5l2.5 -2.5"></path><path d="M3.5 11.5l1.5 1.5l2.5 -2.5"></path><path d="M3.5 17.5l1.5 1.5l2.5 -2.5"></path><path d="M11 6l9 0"></path><path d="M11 12l9 0"></path><path d="M11 18l9 0"></path></svg>
                                            </div>
                                            <h5 className={style.cardHeading}>Flexible delivery slots</h5>
                                            <p className="mb-0 pt-3 ms-3 text-white">Delivery at a time that suits you,<br />7 days a week.
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </Grid.Col>
                            <Grid.Col span={{ lg: 4, md: 12 }}>
                                <div className={style.cardBgDark}>
                                    <div className="p-7">
                                        <div className="">
                                            <div className="">
                                                <svg xmlns="http://www.w3.org/2000/svg" width="50" height="50" viewBox="0 0 24 24" fill="none" stroke="#3CDFCD" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="tabler-icon tabler-icon-user" style={{ width: "calc(3.125rem * var(--mantine-scale))", height: "calc(3.125rem * var(--mantine-scale))" }}><path d="M8 7a4 4 0 1 0 8 0a4 4 0 0 0 -8 0"></path><path d="M6 21v-2a4 4 0 0 1 4 -4h4a4 4 0 0 1 4 4v2"></path></svg>
                                            </div>
                                            <h5 className={style.cardHeading}>Expert advice</h5>
                                            <p className="mb-0 pt-3 ms-3 text-white">A Handover Specialist to explain the car’s
                                                features and answer your questions.</p>
                                        </div>
                                    </div>
                                </div>
                            </Grid.Col>
                            <Grid.Col span={{ lg: 4, md: 12 }}>
                                <div className={style.cardBgDark}>
                                    <div className="p-7">
                                        <div className="status-info1">
                                            <div className="">
                                                <svg xmlns="http://www.w3.org/2000/svg" width="50" height="50" viewBox="0 0 24 24" fill="none" stroke="#3CDFCD" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="tabler-icon tabler-icon-shopping-cart" style={{ width: "calc(3.125rem * var(--mantine-scale))", height: "calc(3.125rem * var(--mantine-scale))" }}><path d="M6 19m-2 0a2 2 0 1 0 4 0a2 2 0 1 0 -4 0"></path><path d="M17 19m-2 0a2 2 0 1 0 4 0a2 2 0 1 0 -4 0"></path><path d="M17 17h-11v-14h-2"></path><path d="M6 5l14 1l-1 7h-13"></path></svg>
                                            </div>
                                            <h5 className={style.cardHeading}>What's next</h5>
                                            <p className="mb-0 pt-3 ms-3 text-white">24/7 Support to assist with anything<br /> you might have
                                                missed.</p>
                                        </div>
                                    </div>
                                </div>
                            </Grid.Col>
                        </Grid>
                    </div>
                </Container>
            </section>
        </>
    )
}
export default Inspection