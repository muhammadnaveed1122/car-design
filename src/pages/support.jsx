import { useLoadingContext } from "@/providers/LoadingProvider"
import { Accordion, Container, Grid } from "@mantine/core"
import MetaDecorator from "@/components/Meta/metaDecor"
import groceries from '../components/groceries.json'
import style from '../styles/support.module.css'
import { IconPlus } from "@tabler/icons-react"
import { verifyService } from '@/services';
import React, { useState } from 'react'
import { toastShow } from "@/helpers"

const support = () => {
    const [email, setEmail] = useState("")
    const [name, setName] = useState("")
    const [message, setMessage] = useState("")
    const [errors, setErrors] = useState({});

    const loadingContext = useLoadingContext()

    const validateForm = () => {
        let isValid = true;
        const newErrors = {};

        // Name validation
        if (name.trim() === '') {
            newErrors.name = 'Name is required';
            isValid = false;
        }
        // Email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            newErrors.email = 'Invalid email address';
            isValid = false;
        }
        if (email.trim() === '') {
            newErrors.email = 'Email is required'
            isValid = false;
        }
        // Message validation
        if (message.trim() === '') {
            newErrors.message = 'Message is required';
            isValid = false;
        }

        setErrors(newErrors);
        return isValid;
    };

    const handleSubmit = async (e) => {
        try {
            e.preventDefault();

            if (validateForm()) {
                loadingContext.setIsLoading(true)
                let params = {
                    email,
                    message,
                    subject: name,
                };

                params = JSON.stringify(params);
                const res = await verifyService.sendEmailToSupport(params);
                if (res) {
                    toastShow("Email sent to Support")
                    setEmail('')
                    setName('')
                    setMessage('')

                }
            }
            loadingContext.setIsLoading(false)

        } catch (err) {
            toastShow(err.message, "error")
            loadingContext.setIsLoading(false)

        }
    };

    return (
        <>
            <MetaDecorator
                title='Trade Dept | Support'
            />

            <div className={style.vehicleInspectionContainer}>
                <div className="header-text1 mb-0">
                    <Container size="xl">
                        <Grid align="center">
                            <Grid.Col span={{ xl: 12, lg: 12, md: 12, sm: 12 }}>
                                <div className={style.vehicleInspectionContent}>
                                    <h3>Support Center</h3>
                                    <p>Save the time of a phone call and get your queries answered right here.</p>
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
                            {groceries.map((item, key) => (
                                <>
                                    <Accordion.Item key={key} value={`key_${key}`} className={style.mantine_accordion_item}>
                                        <Accordion.Control className={style.mantine_Accordion_control}>{item.value}</Accordion.Control>
                                        <Accordion.Panel className={style.mantine_Accordion_panel}>
                                            <Accordion defaultValue="customization">
                                                {/* =============================Nested Accordian======================= */}
                                                <Accordion
                                                    classNames={{ chevron: style.chevron }}
                                                    chevron={<IconPlus className={style.icon} />} >
                                                    {item.list.map((first, index) => (
                                                        <Accordion.Item key={index} value={`key_${index}`} className={style.mantine_accordion_item1}>
                                                            <Accordion.Control className={style.mantine_Accordion_control1}>{first.title}</Accordion.Control>
                                                            <Accordion.Panel className={style.mantine_Accordion_panel1}>
                                                                <Accordion defaultValue="customization">
                                                                    <ul className={style.accorList}>
                                                                        <li>{first.content}</li>
                                                                    </ul>
                                                                </Accordion>
                                                            </Accordion.Panel>
                                                        </Accordion.Item>
                                                    ))}
                                                </Accordion>
                                                {/* ===============================Nested Accordian========================== */}
                                            </Accordion>
                                        </Accordion.Panel>
                                    </Accordion.Item>
                                </>
                            ))}
                        </Accordion>
                    </div>
                </Container>
            </div>
            <section className={`${style.contact_details}`}>
                <Container size="xl">
                    <Grid gutter="md">
                        <Grid.Col span={{ md: 5, }}>
                            <div className={style.left_part}>
                                <h3>Trade Dept</h3>
                                <div className={style.content}>
                                    <span>Registered office address</span>
                                    <p>Address: Bucuresti, Romania</p>
                                </div>
                                <div className={style.content}>
                                    <span>Landline</span>
                                    <p>072-811-5707</p>
                                </div>
                                <div className={style.content}>
                                    <span>Mobile</span>
                                    <p>+40-726-755-561</p>
                                </div>
                                <div className={style.content}>
                                    <span>Mail</span>
                                    <p>contact@cexauto.ro</p>
                                </div>
                                <div className={style.content}>
                                    <span>Working Hours</span>
                                    <p>
                                        Tuesday 9 AM–5 PM<br />
                                        Wednesday Closed<br />
                                        Thursday 9 AM–5 PM<br />
                                        Friday 9 AM–5 PM<br />
                                        Saturday 8 AM–12 PM<br />
                                        Sunday Closed<br />
                                        Monday 9 AM–5 PM<br />
                                        Suggest new hours<br />
                                    </p>

                                </div>
                            </div>

                        </Grid.Col>
                        <Grid.Col span={{ md: 7, }} >
                            <form className={style.right_form} onSubmit={handleSubmit}>
                                <Grid gutter="md">
                                    <Grid.Col span={{ md: 6, }}>
                                        <div className={style.form_label}>
                                            <span>Name</span>
                                            <input type="text" value={name} onChange={(e) => setName(e.target.value)} />

                                        </div>
                                        <div className={style.error_message}>{errors.name}</div>

                                    </Grid.Col>
                                    <Grid.Col span={{ md: 6, }}>
                                        <div className={style.form_label}>
                                            <span>Email</span>
                                            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />

                                        </div>
                                        <div className={style.error_message}>{errors.email}</div>

                                    </Grid.Col>
                                    <Grid.Col span={{ md: 12, }}>
                                        <div className={style.form_label}>
                                            <span>Message</span>
                                            <textarea value={message} onChange={(e) => setMessage(e.target.value)} ></textarea>

                                        </div>
                                        <div className={style.error_message}>{errors.message}</div>

                                        <button style={{ cursor: "pointer" }}>Send</button>
                                    </Grid.Col>
                                </Grid>
                            </form>
                        </Grid.Col>
                    </Grid>
                </Container>
            </section>
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
export default support