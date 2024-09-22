import MetaDecorator from "@/components/Meta/metaDecor"
import { Container, Grid, Center } from "@mantine/core"
import { IconChevronRight } from "@tabler/icons-react"
import style from "../styles/Warranty.module.css"

const Warranty = () => {
    return (
        <>
            <MetaDecorator
                title='Trade Dept | Warranty'
            />
            <div className={`${style.warranty_banner} cover-image-delivery sptb-1 bg-background`}>
                <div className="header-text1 mb-0">
                    <Container size="xl">
                        <Grid gutter="md">
                            <Grid.Col span={{ lg: 8, xs: 12 }}>
                                <Center style={{ height: 300 }}>
                                    <div className="text-white mt-lg-8 mb-5">
                                        <h3 className="mb-3 display-5">Protecting what you love</h3>
                                        <p className="fs-18 mb-6">Our cars come with a free 90-day warranty to protect you from
                                            unexpected costs.</p>
                                    </div>
                                </Center>
                            </Grid.Col>
                            <Grid.Col span={{ lg: 4, xs: 12 }} >
                                <img src="/assets/car.png" />
                            </Grid.Col>
                        </Grid>
                    </Container>
                </div>
            </div>
            <section className={` sptb ${style.bgDark} ${style.warranty_part}`}>
                <Container size="xl">
                    <Grid>
                        <Grid.Col span={{ lg: 12 }}>
                            <div className={style.section_title}>
                                <h2 className="text-center" style={{ color: "#fff" }}>Manufacturer Warranty Exclusions:</h2>
                            </div>
                            <Grid>
                                <Grid.Col span={{ md: 12 }}>
                                    <p>While manufacturer warranty provides valuable protection against manufacturing defects, it has limitations. It primarily covers repairs and replacements caused by confirmed factory errors or faulty materials.
                                        Therefore, several key areas fall outside the scope of typical car warranty:</p>
                                    <ul className="list-group mb-4">
                                        <li className="mt-1 mb-2"> <IconChevronRight width="18" height="18" /> Routine Maintenance: Regular upkeep like oil changes, brake pad replacements, tire rotations, and related services are considered wear and tear and are not covered by warranty.</li>
                                        <li className="mt-1 mb-2"> <IconChevronRight width="18" height="18" /> Accidental or Environmental Damage: Damage caused by accidents, collisions, hail, storms, or other external factors is not covered by your manufacturer warranty. Your car insurance should be utilized for such events.</li>
                                        <li className="mt-1 mb-2"> <IconChevronRight width="18" height="18" /> Cosmetic Issues: Dents, scratches, paint chips, and other cosmetic imperfections are also typically excluded from warranty coverage.</li>
                                        <li className="mt-1 mb-2"> <IconChevronRight width="18" height="18" /> Improper Car Care: Warranty protection is void if you neglect recommended maintenance schedules or engage in practices that harm your vehicle.</li>
                                    </ul>
                                    <p>Extended Warranty Options:
                                        <br />

                                        While manufacturer warranty offer invaluable protection for initial years, vehicles require long-term care. Consider an extended warranty that provides additional coverage for mechanical breakdowns beyond the standard warranty period. This can provide valuable peace of mind and financial security down the road.
                                        <br />
                                        Our Commitment to Quality:
                                        <br />
                                        We, at Trade Dept, understand the importance of reliable vehicles. As such, we offer a comprehensive 90-day warranty on all our purchases, demonstrating our commitment to quality and customer satisfaction.</p>
                                </Grid.Col>
                            </Grid>
                        </Grid.Col>
                    </Grid>
                </Container>
            </section>
            <section className={`sptb bgGradiant ${style.warranty_list_part}`}>
                <Container size="xl">
                    <div className={style.section_title}>
                        <h2 style={{ color: "#fff" }}>Extensive cover of electrical and mechanical parts</h2>
                    </div>
                    <Grid>
                        <Grid.Col span={{ lg: 3, md: 12 }} className="text-white">
                            <div className={style.box}>
                                <div className="p-5">
                                    <div className={style.section_title}>
                                        <h3>Drivetrain</h3>
                                        <br />
                                        <ul className="list-group mb-4" style={{ textAlign: "left" }}>
                                            <li className="mt-1 mb-2"> <IconChevronRight width="18" height="18" />
                                                Braking system</li>
                                            <li className="mt-1 mb-2"> <IconChevronRight width="18" height="18" />
                                                Suspension</li>
                                            <li className="mt-1 mb-2"> <IconChevronRight width="18" height="18" />
                                                Steering</li>
                                            <li className="mt-1 mb-2"> <IconChevronRight width="18" height="18" />
                                                Drive system</li>
                                            <li className="mt-1 mb-2"> <IconChevronRight width="18" height="18" />
                                                Propshaft</li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        </Grid.Col>
                        <Grid.Col span={{ lg: 3, md: 12 }} className="text-white">
                            <div className={style.box}>
                                <div className="p-5">
                                    <div className={style.section_title}>
                                        <h3 className="mt-2 mb-2">Engine</h3>
                                        <br />
                                        <ul className="list-group mb-4" style={{ textAlign: "left" }}>
                                            <li className="mt-1 mb-2"> <IconChevronRight width="18" height="18" />
                                                Cooling system</li>
                                            <li className="mt-1 mb-2"> <IconChevronRight width="18" height="18" />
                                                ECUs</li>
                                            <li className="mt-1 mb-2"> <IconChevronRight width="18" height="18" />
                                                Engine</li>
                                            <li className="mt-1 mb-2"> <IconChevronRight width="18" height="18" />
                                                Timing belt(s)</li>
                                            <li className="mt-1 mb-2"> <IconChevronRight width="18" height="18" />
                                                Supercharger</li>
                                            <li className="mt-1 mb-2"> <IconChevronRight width="18" height="18" />
                                                Turbo</li>

                                        </ul>
                                    </div>
                                </div>
                            </div>
                        </Grid.Col>
                        <Grid.Col span={{ lg: 3, md: 12 }} className="text-white">
                            <div className={style.box}>
                                <div className="p-5">
                                    <div className={style.section_title}>
                                        <h3 className="mt-2 mb-2">Transmission</h3>
                                        <br />
                                        <ul className="list-group mb-4" style={{ textAlign: "left" }}>
                                            <li className="mt-1 mb-2"> <IconChevronRight width="18" height="18" />
                                                Manual and automatic gearbox</li>
                                            <li className="mt-1 mb-2"> <IconChevronRight width="18" height="18" />
                                                Clutch</li>
                                            <li className="mt-1 mb-2"> <IconChevronRight width="18" height="18" />
                                                Continuously variable transmission</li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        </Grid.Col>
                        <Grid.Col span={{ lg: 3, md: 12 }} className="text-white">
                            <div className={style.box}>
                                <div className="p-5">
                                    <div className={style.section_title}>
                                        <h3 className="mt-2 mb-2">Electrical</h3>
                                        <br />
                                        <ul className="list-group mb-4" style={{ textAlign: "left" }}>
                                            <li className="mt-1 mb-2"> <IconChevronRight width="18" height="18" />
                                                Air conditioning</li>
                                            <li className="mt-1 mb-2"> <IconChevronRight width="18" height="18" />
                                                Electrical system</li>
                                            <li className="mt-1 mb-2"> <IconChevronRight width="18" height="18" />
                                                ICE/Multi-media/Touchscreen display</li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        </Grid.Col>
                    </Grid>
                </Container>
            </section>
        </>
    )
}
export default Warranty