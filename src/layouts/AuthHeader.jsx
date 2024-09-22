import { Container, Menu, Group, Button, UnstyledButton, Text, Divider, Burger, Drawer, ScrollArea, rem, ActionIcon, useMantineColorScheme, Image, Space, } from '@mantine/core';
import { IconChevronDown, IconSun, IconMoonStars, IconSettings, IconSwitchHorizontal, IconLogout } from '@tabler/icons-react';
import { useCarDispatch } from '@/redux/carsSlice';
import { HeaderNavList } from '@/constants/data';
import classes from '@/styles/Header.module.css';
import { useDisclosure, useMediaQuery } from '@mantine/hooks';
import { useState, useEffect } from 'react';
import { userService } from '@/services';
import { useRouter } from 'next/router';
import Link from "next/link";
import cx from 'clsx';

export default function AuthHeader({ openProfile, openAddress }) {
  const router = useRouter();
  const isCustomer = userService.userValue?.role == 'USER';
  const isSeller = userService.userValue?.role == 'SELLER';
  const isTrader = userService.userValue?.role == 'TRADER';
  const isAdmin = userService.userValue?.role == "ADMIN"
  const [drawerOpened, { toggle: toggleDrawer, close: closeDrawer }] = useDisclosure(false);
  const { colorScheme, toggleColorScheme } = useMantineColorScheme();
  const [dark, setDark] = useState(true);
  const [fullName, setFullName] = useState('');
  const [navList, setNavList] = useState([]);
  const dispatch = useCarDispatch();

  useEffect(() => {
    setFullName(`${userService.userValue?.firstName} ${userService.userValue?.lastName}`);
    setNavList(isCustomer ? HeaderNavList.user : isAdmin ? HeaderNavList.admin : isSeller
      ? HeaderNavList.seller : isTrader
        ? HeaderNavList.trader : HeaderNavList.subAdmin);
  }, []);

  useEffect(() => {
    setDark(colorScheme === 'dark');
  }, [colorScheme]);

  const logoutUser = (e) => {
    e.preventDefault();
    userService.logout();
    router.push('/');
  }
  const [opened, { toggle }] = useDisclosure(false);
  const [userMenuOpened, setUserMenuOpened] = useState(false);

  useEffect(() => {
    closeDrawer();
  }, [router?.pathname, router?.asPath]);
  useEffect(() => {
    setFullName(`${userService.userValue?.firstName} ${userService.userValue?.lastName}`);
  }, [userService.userValue])
  const isSmallScreen = useMediaQuery('(max-width: 768px)');
  const imageSrc = isSmallScreen
    ? "/cex-simple-logo.png" :
    (dark ? "/cex-light-logo.png" : "/cex-dark-logo.png")
    // (dark ? "/cex-simple-logo.png" : "/cex-simple-logo.png")
    ;
  return (
    <>
      <header className={classes.header}>
        <Container size="xl" className={classes.navContainer}>
          <Group align="center" justify="space-between" h="100%" wrap="nowrap">


            <Link href="/">
              {/* <Group gap={0}> */}
              <Image src={imageSrc} alt="logo" w={{ base: '40px', sm: '150px' }} h={{ base: '55px', sm: '65px' }} />
              {/* <Image src={dark ? "/highway-18-light.png" : "/highway-18-dark.png"} alt="logo" w={{ base: '50px', sm: '210px' }} h={{ base: '45px', sm: '60px' }} /> */}
              {/* </Group> */}
            </Link>
            <Group gap={0} wrap='nowrap' h="100%">
              <Burger p={0} w={20} size={'sm'} opened={drawerOpened} onClick={toggleDrawer} hiddenFrom="md" />
              <Space w={{ base: 'xs', xs: "md" }} hiddenFrom="md" />
              <Group h="100%" gap={0} wrap="nowrap">
                <Group h="100%" gap={0} visibleFrom="md">
                  {navList.map((nav, i) => (
                    <Link href={nav.link} className={classes.link} key={`mdlink${i}`} width="auto">
                      {nav.title}
                    </Link>
                  ))}
                </Group>
                <Button visibleFrom="md" component={Link} href={userService?.userValue ? '/sell-car' : '/create-advert'} variant="outline" color='#3CDFCD' c={dark ? '#fff' : '#3CDFCD'} radius='xl'>Sell Your Car</Button>
                <Group wrap='nowarp'>
                  <Container size="md" p={0}>
                    <Group justify="space-between">
                      <Menu
                        width={260}
                        position="bottom-end"
                        transitionProps={{ transition: 'pop-top-right' }}
                        onClose={() => setUserMenuOpened(false)}
                        onOpen={() => setUserMenuOpened(true)}
                        withinPortal
                      >
                        <Menu.Target>
                          <UnstyledButton py={5} p={{base: '0', sm: 'md'}}
                            className={cx(classes.user, { [classes.userActive]: userMenuOpened })}
                          >
                            <Group gap={7} wrap='nowrap'>
                              <Text className={classes.userName} fw={500} size="sm" mr={3}>
                                {fullName.trim() || userService.userValue?.email}
                              </Text>
                              <IconChevronDown style={{ width: rem(12), height: rem(12) }} stroke={1.5} />
                            </Group>
                          </UnstyledButton>
                        </Menu.Target>
                        <Menu.Dropdown>
                          <Menu.Label>Settings</Menu.Label>
                          <Menu.Item
                            onClick={() => { openProfile() }}
                            leftSection={
                              <IconSettings style={{ width: rem(16), height: rem(16) }} stroke={1.5} />
                            }
                          >
                            Account settings
                          </Menu.Item>
                          <Menu.Item
                            onClick={() => { openAddress() }}
                            leftSection={
                              <IconSwitchHorizontal style={{ width: rem(16), height: rem(16) }} stroke={1.5} />
                            }
                          >
                            Change Address
                          </Menu.Item>
                          <Menu.Item
                            onClick={logoutUser}
                            leftSection={
                              <IconLogout style={{ width: rem(16), height: rem(16) }} stroke={1.5} />
                            }
                          >
                            Logout
                          </Menu.Item>
                        </Menu.Dropdown>
                      </Menu>
                    </Group>
                  </Container>
                  <ActionIcon
                    variant="outline"
                    color={dark ? 'yellow' : 'ocean-blue'}
                    onClick={() => toggleColorScheme()}
                    title="Toggle color scheme"
                  >
                    {dark ? <IconSun size={18} /> : <IconMoonStars size={18} />}
                  </ActionIcon>
                </Group>
              </Group>

              {/* <ActionIcon
                variant="outline"
                color={dark ? 'yellow' : 'ocean-blue'}
                onClick={() => toggleColorScheme()}
                title="Toggle color scheme"
                hiddenFrom="md"
              >
                {dark ? <IconSun size={18} /> : <IconMoonStars size={18} />}
              </ActionIcon> */}
            </Group>
          </Group>
        </Container>
      </header>

      <Drawer
        opened={drawerOpened}
        onClose={closeDrawer}
        size="100%"
        padding="md"
        hiddenFrom="md"
        zIndex={1000}
      >
        <Link href="/" style={{ position: 'absolute', top: '10px', left: '10px', zIndex: '9999' }}>
          <Image src={dark ? "/cex-light-logo.png" : "/cex-dark-logo.png"} alt="logo" style={{ width: "140px", height: "60px", objectFit: 'contain', }} />
        </Link>
        <ScrollArea h={`calc(100vh - ${rem(80)})`} mx="-md">
          <Divider my="md" />

          {navList.map((nav, i) => (
            <Link href={nav.link} className={classes.link} key={`smlink${i}`} onClick={() => closeDrawer()}>
              {nav.title}
            </Link>
          ))}

          <Divider my="md" />

          <Group justify="center" grow pb="xl" px="md" wrap='wrap'>
            <Button
              variant="default"
              onClick={() => { closeDrawer(); openProfile() }}
              leftSection={<IconSettings style={{ width: rem(16), height: rem(16) }} stroke={1.5} />}>
              Settings
            </Button>
            <Button onClick={(event) => { logoutUser(event); closeDrawer() }}>Log out</Button>
          </Group>
        </ScrollArea>
      </Drawer>
    </>
  );
}