import { Center, Container, Grid, Image } from "@mantine/core"
import MetaDecorator from "@/components/Meta/metaDecor";
import style from "../styles/delivery.module.css"
import '@mantine/core/styles.css';

const Delivery = () => {
    return (
        <>
            <MetaDecorator title='Trade Dept | Delivery' />
            <div className="cover-image-delivery sptb-1 bg-background">
                <div className="header-text1 mb-0">
                    <Container size="xl">
                        <Grid gutter="md" align="center">
                            <Grid.Col span={{ md: 6, }}>
                                <Center style={{ height: 300 }}>
                                    <div className="text-white mtmd-8 mb-5">
                                        <h1 className={style.displayBanner}>Free <span className={style.FontBold}>Home Delivery</span></h1>
                                        <p className={style.txtWhite}>Unwind and let us bring your purchase directly to your door! We offer complimentary in-home delivery to any valid address within the continental United States.
                                            <br />
                                            Wide Coverage: We reach all corners of the country, except remote areas with limited vehicle access.
                                            <br />
                                            Relax and Unwind: Sit back and enjoy the anticipation – we'll handle the logistics from A to Z.
                                        </p>
                                    </div>
                                </Center>
                            </Grid.Col>
                            <Grid.Col span={{ md: 6, }} >
                                <Image src="/assets/banners/banner_deliver.png" />
                            </Grid.Col>
                        </Grid>
                    </Container>
                </div>
            </div>
            <section className={style.outerHidden}>
                <div className="about-1 cover-image row gx-0">
                    <Grid>
                        <Grid.Col span={{ lg: 6 }} style={{ padding: "0px" }}>
                            <div className="content-text">
                                <img src="/assets/carDelivery2.webp" className="cover-image" />
                            </div>
                        </Grid.Col>
                        <Grid.Col span={{ lg: 6 }} className={style.bgDark}>
                            <div className="section-title2">
                                <h4 style={{ fontSize: "2.5rem", color: "#fff" }}>Home Delivery</h4>
                            </div>
                            <Grid>
                                <Grid.Col span={{ md: 12 }} className="text-white">
                                    <ul className={style.listGroup}>
                                        <li className={style.deliveryLi}><i className="fa fa-angle-right me-1" aria-hidden="true"></i> Experience a seamless car delivery process with our comprehensive service:</li>
                                        <li className={style.deliveryLi}><i className="fa fa-angle-right me-1" aria-hidden="true"></i> Doorstep Convenience: Relax and await your vehicle as we deliver it directly to your chosen location.</li>
                                        <li className={style.deliveryLi}><i className="fa fa-angle-right me-1" aria-hidden="true"></i> Pre-Arrival Notification: We'll call you 15 minutes prior to arrival, ensuring you're ready to receive your new car.</li>
                                        <li className={style.deliveryLi}><i className="fa fa-angle-right me-1" aria-hidden="true"></i> Personalized Unloading: Simply guide our delivery professionals to your preferred unloading spot, and we'll handle the rest.</li>
                                        <li className={style.deliveryLi}><i className="fa fa-angle-right me-1" aria-hidden="true"></i> Safe and Secure Transport: Your car will arrive on a specialized transporter, ensuring damage-free delivery.</li>
                                        <li className={style.deliveryLi}><i className="fa fa-angle-right me-1" aria-hidden="true"></i> Road Restriction Alert: During checkout, you can easily flag any potential road restrictions to ensure a smooth delivery process.</li>
                                        <li className={style.deliveryLiRed}><i className="fa fa-angle-right me-1" aria-hidden="true"></i>
                                        </li>
                                    </ul>
                                </Grid.Col>
                            </Grid>
                        </Grid.Col>
                    </Grid>
                </div>
            </section>
            <section className={style.outerHidden}>
                <Grid className="about-1 cover-image bg-light row gx-0">
                    <Grid.Col span={{ lg: 6 }} className={style.bgDark}>
                        <div className="section-title2">
                            <h4 style={{ fontSize: "2.5rem", color: "#fff" }}>Behind the scenes</h4>
                        </div>
                        <Grid>
                            <Grid.Col span={{ md: 12 }} className="text-white">
                                <p className={style.deliveryLi}>
                                    Once you place your order, our dedicated team works diligently to ensure a smooth and efficient car delivery experience. Here's what happens: <br />
                                    Expert Preparation: Our meticulous logistics team carefully inspects, preps, and loads your car onto a specialized transporter bound for your local delivery hub. <br />
                                    Dedicated Handover: A skilled handover specialist takes charge, carefully collecting your car and handling any necessary paperwork. <br />
                                    Immaculate Arrival: We meticulously valet and sanitize your car, ensuring it arrives immaculate and ready for you to enjoy. <br />
                                    Delivery Delight: Finally, our friendly delivery team brings your car directly to you, completing the seamless journey from order to arrival.
                                </p>
                            </Grid.Col>
                        </Grid>
                    </Grid.Col>
                    <Grid.Col span={{ lg: 6 }} style={{ padding: "0px" }}>
                        <div className="content-text">
                            <Image src="/assets/banners/cars2.jpg" className="cover-image" alt="delevery img" />
                        </div>
                    </Grid.Col>
                </Grid>
            </section>
            <section className={style.outerHidden}>
                <Grid className="about-1 cover-image bg-light row gx-0">
                    <Grid.Col span={{ lg: 6 }} style={{ padding: "0px" }}>
                        <div className="content-text">
                            <img src="/assets/banners/cars1.jpg" className="cover-image" />
                        </div>
                    </Grid.Col>
                    <Grid.Col span={{ lg: 6 }} className={style.bgDark}>
                        <div className="section-title2">
                            <h4 style={{ fontSize: "2.5rem", color: "#fff" }}>Personalized Delivery and Handover</h4>
                        </div>
                        <Grid>
                            <Grid.Col span={{ md: 12 }} >
                                <p className={style.deliveryLi}>

                                    On your delivery day, your dedicated handover specialist will reach out to confirm their estimated arrival time within the scheduled two-hour window.
                                    <br />
                                    To ensure a seamless and satisfying experience, your specialist will allocate ample time to:
                                    <br />
                                    Comprehensive walkthrough: Get acquainted with your new car through a detailed demonstration of its features and functionalities.
                                    <br />
                                    Technical explanation: Your specialist will patiently address any technical questions you may have, ensuring you feel confident behind the wheel.
                                    <br />
                                    Thorough inspection: Together, you can verify that everything is in order and your car meets your expectations.
                                    <br />
                                    Once all formalities are complete, your specialist will gladly present you with the keys, marking the official start of your new car journey.
                                </p>
                            </Grid.Col>
                        </Grid>
                    </Grid.Col>

                </Grid>
            </section>
            <section className={style.bgBlue}>
                <Container size="xl">
                    <div className={style.section_title}>
                        <h2 className={style.txtWhite}>Not just a transport service</h2>
                        <p className={style.txtWhite}>We want to make sure that you’re properly introduced to your new car.</p>
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
export default Delivery
