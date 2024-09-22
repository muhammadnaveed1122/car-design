import MetaDecorator from "@/components/Meta/metaDecor"
import { Container, Grid } from "@mantine/core"
import style from "../styles/Return.module.css"

const Return = () => {
    return (
        <>
         <MetaDecorator
        title='Trade Dept | Return'
      />

            <div className="cover-image-delivery sptb-1 bg-background">
                <div className="header-text1 mb-0">
                    <Container size="xl">
                        <Grid>
                            <Grid.Col span={{ md: 12 }}>
                                <div className={style.returnBannerTop}>
                                    <h3 className="">Not happy with your purchase?</h3>
                                    <p className="">We’re pretty sure you’ll love your new car, but if you
                                        have a change of heart, no worries. Simply do so within 7 days and you’ll get your money
                                        back – <b>guaranteed</b>.</p>
                                </div>
                            </Grid.Col>
                        </Grid>
                    </Container>
                </div>
            </div>
            <section className={`${style.bgDark} sptb`}>
                <Container size="xl">
                    <div className={style.section_title}>
                        <h2>7 day money back</h2>
                        <p style={{ textAlign: "left", color: "#fff" }}>7-Day No-Hassle Return Guarantee:</p>
                        <br />
                        <p style={{ textAlign: "left", color: "#fff" }}>You may return your vehicle within 7 days of receipt without the need to provide a reason. Please note that once the return request is initiated, the vehicle must not be used and should be maintained in the same undamaged condition as upon delivery commitment to Quality:</p>
                    </div>
                    <br />
                    <br />
                    <div className={style.section_title}>
                        <h2>Conditions for service</h2>
                        <p style={{ textAlign: "left", color: "#fff" }}>Vehicle Condition Upon Return:</p><br />
                        <ul className="list-group mb-4">
                            <li className="mt-1 mb-2" style={{ textAlign: "left" }}><i className="fa fa-angle-right me-1"
                                aria-hidden="true"></i> Mileage: No more than 250 miles accumulated since delivery.</li>
                            <li className="mt-1 mb-2" style={{ textAlign: "left" }}><i className="fa fa-angle-right me-1"
                                aria-hidden="true"></i> Condition: Free of any damages or modifications beyond normal wear and tear.</li>
                            <li className="mt-1 mb-2" style={{ textAlign: "left" }}><i className="fa fa-angle-right me-1"
                                aria-hidden="true"></i> Third-Party Claims: No outstanding financial or legal claims against the vehicle.</li>
                        </ul>
                    </div>
                    <br />
                    <br />
                    <div className={style.section_title}>
                        <h2>Initiating a Return</h2>
                        <ul className={style.list_group}>
                            <li className="mt-1 mb-2" style={{ textAlign: "left " }}><i className="fa fa-angle-right me-1"
                                aria-hidden="true"></i> Simply contact our dedicated Customer Experience Department. We will promptly arrange for a convenient vehicle pick-up within 72 hours of your request, and a two-hour window will be provided for your scheduling preference. </li>
                            <li className="mt-1 mb-2" style={{ textAlign: "left " }}><i className="fa fa-angle-right me-1"
                                aria-hidden="true"></i> Relax and Let Us Handle the Rest:</li>
                            <li className="mt-1 mb-2" style={{ textAlign: "left " }}><i className="fa fa-angle-right me-1"
                                aria-hidden="true"></i> Our team will seamlessly manage the entire return process, ensuring a smooth and hassle-free experience.</li>
                        </ul>
                    </div>
                    <br />
                    <br />
                    <div className={style.section_title}>
                        <h2>Where to start?</h2>
                        <ul className={style.list_group}>
                            <li className="mt-1 mb-2" style={{ textAlign: "left " }}><i className="fa fa-angle-right me-1"
                                aria-hidden="true"></i> Contact our Customer Experience team </li>
                            <li className="mt-1 mb-2" style={{ textAlign: "left " }}><i className="fa fa-angle-right me-1"
                                aria-hidden="true"></i> We’ll arrange to pick up your car at a 2-hour slot of your choosing
                                (after 72 hours of your request)</li>
                            <li className="mt-1 mb-2" style={{ textAlign: "left " }}><i className="fa fa-angle-right me-1"
                                aria-hidden="true"></i> We will take care of the rest</li>
                        </ul>
                    </div>
                </Container>
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
export default Return