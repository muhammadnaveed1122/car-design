import { IconSun, IconPhone, IconDeviceMobile, IconDeviceLandlinePhone, IconMapPin, IconAt, IconBrandWhatsapp, IconBrandTelegram } from '@tabler/icons-react';
import { Text, ThemeIcon, Stack, rem } from '@mantine/core';
import classes from '@/styles/ContactIcons.module.css';
import Link from 'next/link';


const MOCKDATA = [
  { title: 'Email', description: 'contact@TradeDept.ro', icon: IconAt, color: '#1E81CE', link: true, linkValue:"mailto:contact@TradeDept.ro" },
  // { title: 'Landline', description: '072-811-5707', icon: IconDeviceLandlinePhone },
  // { title: 'Mobile', description: '+40-726-755-561', icon: IconDeviceMobile },
  { title: 'Whatsapp', description: 'Contact', icon: IconBrandWhatsapp, link: true,linkValue:"https://wa.me/40728115707", color: '#57CE62' },
  { title: 'Telegram', description: 'TradeDept', icon: IconBrandTelegram, link: true,linkValue:"https://t.me/TradeDept", color: '#009EEB' },
  { title: 'Address', description: 'Bucuresti, Romania', icon: IconMapPin, color: '#EB1C24' },
  // { title: 'Working hours', description: '9 a.m. – 5 p.m.', days: 'Monday, Tuesday, Thursday, Friday', saturday: 'Saturday', saturdayTime: '8 a.m. – 12 p.m.', closed: 'Wednesday & Sunday (Closed)', icon: IconSun },
];

function ContactIcon({ icon: Icon, title, description, days, saturday, saturdayTime, closed, ...others }) {
  return (
    <div className={classes.wrapper} {...others}>
      <ThemeIcon size={40} radius="md" className={classes.icon} c={others?.color}>
        <Icon style={{ width: rem(24), height: rem(24) }} />
      </ThemeIcon>

      <div>
        <Text size="xs" className={classes.title}>
          {title}
        </Text>
        <Text className={classes.description}>{days}</Text>
        {others?.link ? <Link 
          // href={others?.linkValue}
          href={'#'}
          className={classes.description}>{description}</Link> : <Text className={classes.description}>{description}</Text>}


        <Text className={classes.description}>{saturday}</Text>
        <Text className={classes.description}>{saturdayTime}</Text>

        <Text className={classes.description}>{closed}</Text>
      </div>
    </div>
  );
}


export function ContactIconsList() {
  const items = MOCKDATA.map((item, index) => <ContactIcon key={index} {...item} />);
  return <Stack>{items}</Stack>;
}