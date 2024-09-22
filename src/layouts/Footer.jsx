import { Text, Container, Box, Image, useMantineColorScheme, Group, Grid, BackgroundImage, Button } from '@mantine/core';
import classes from '@/styles/Footer.module.css';
import Payments from "@/components/Payments";
import Link from "next/link";
import { useEffect, useState } from 'react';
const data = [
   {
      title: 'Main',
      links: [
         { label: 'Home', link: '/home' },
         { label: 'How it works?', link: '/#howItWorks' },
         { label: 'Why Trade Dept?', link: '/#whyChoose' },
         { label: 'Sign in', link: '/signin' },
      ],
   },
   {
      title: 'Services',
      links: [
         { label: 'Home Delivery', link: '/delivery' },
         { label: 'Money Back Guarantee', link: '/return' },
         { label: 'Warranty', link: '/warranty' },
         { label: '299 Point Inspection', link: '/inspection' },
      ],
   },
   {
      title: 'Support',
      links: [
         // { label: 'Career', link: 'https://highway18autosales.com/blog/careers/' },
         // { label: 'Contact', link: 'https://highway18autosales.com/blog/contact/' },
         // { label: 'Faqs', link: 'https://highway18autosales.com/blog/faqs/' },
         { label: 'Contact', link: '/contact-us' },
         { label: 'Faqs', link: '/faqs' },
         { label: 'Support Center', link: '/support' },
         { label: 'Terms & conditions', link: '/terms-and-condition' },
      ],
   },
];

export default function Footer() {

   const { colorScheme } = useMantineColorScheme();
   const [dark, setDark] = useState(true);

   useEffect(() => {
      setDark(colorScheme === 'dark');
   }, [colorScheme]);

   const groups = data.map((group, i) => {
      const links = group.links.map((link, index) => (
         <Box key={index}>
            <Link
               key={index}
               className={classes.link}
               component="a"
               href={link.link}
            >
               {link.label}
            </Link>
         </Box>
      ));

      return (
         <div className={classes.wrapper} key={`${group.title}${i}`}>
            <Text className={classes.title}>{group.title}</Text>
            {links}
         </div>
      );
   });

   return (
      <BackgroundImage src='assets/footer-bg.png'>
         <footer className={classes.footer}>
            <Container size='xl'>
               <Grid className={classes.inner}>
                  <Grid.Col span={{ base: 12, sm: 4 }} mb={{ base: 'lg', sm: 0 }}>
                     <div className={classes.footer_logo}>
                        <Link href="/" style={{ display: 'inline-block' }}>
                           <Image src={dark ? "/cex-simple-logo.png" : "/cex-simple-logo.png"} alt="logo" style={{ width: "45px", height: "60px", objectFit: 'contain', }} />
                        </Link>
                     </div>
                     <Text me={{ base: 0, lg: '100px' }} mb={'20'} fz={14} c='var(--mantine-color-dark-1)'>
                        With Trade Dept, you’re twice as likely to sell your car within a week. We also have more options than anywhere else to sell your car.
                     </Text>
                     {/* <Group gap={'xs'}>
                        <Link href='https://anpc.ro/ce-este-sal/' target='_blank'>
                           <Image src='/assets/footer-bottom-1.png' alt='logo' maw='160px' />
                        </Link>
                        <Link href='https://ec.europa.eu/consumers/odr/main/index.cfm?event=main.home2.show&lng=RO' target='_blank'>
                           <Image src='/assets/footer-bottom-2.png' alt='logo' maw='160px' />
                        </Link>
                     </Group>  */}
                  </Grid.Col>
                  <Grid.Col span={{ base: 12, sm: 8 }} className={classes.groups}>
                     {groups}
                  </Grid.Col>
                  {/* <Grid.Col span={{ base: 12, sm: 2 }} ta={'end'}>
                     <Link href='https://wa.me/+923234645049' style={{ width: '110px', display: 'inline-block' }} target='_blank' >
                        <Lottie animationData={animationData} loop={true} />
                     </Link>
                  </Grid.Col> */}
               </Grid>
               <Group justify='space-between' align='center' p={{ base: '20px 0', ms: '35px 0' }}>
                  <Box display={{ base: 'none', sm: 'block' }}></Box>
                  <Group>
                     <Button component="a" href="#" variant="outline" color={'#3CDFCD'} c={'#fff'} radius={'xl'} size="md" ps={0}
                        leftSection={
                           <Image src='/assets/ic_instagram.svg' alt='icon' me={{ base: 0, sm: '5px' }} />
                        }
                     >
                        <Text>Instagram</Text>
                     </Button>
                     <Button component="a" href="#" variant="outline" color={'#3CDFCD'} c={'#fff'} radius={'xl'} size="md" ps={0}
                        leftSection={
                           <Image src='/assets/ic_tiktok.svg' alt='icon' me={'4px'} />
                        }
                     >
                        <Text mx={{ base: 0, sm: '14px' }}>Tiktok</Text>
                     </Button>
                  </Group>
                  <Payments />
               </Group>
            </Container>
            <Container className={classes.afterFooter} size='xl'>
               <Text c='var(--mantine-color-dark-1)' size="sm">
                  ©2024 Copyright Trade Dept. All rights reserved.
               </Text>
            </Container>
         </footer>
      </BackgroundImage>
   );
}