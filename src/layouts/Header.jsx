import {
  Container,
  Group,
  Button,
  Divider,
  Burger,
  Drawer,
  ScrollArea,
  rem,
  ActionIcon,
  useMantineColorScheme,
  Image,
  Flex,
  Space,
  Input,
  Box,
  CloseButton,
  Modal,
  TextInput,
  UnstyledButton,
} from "@mantine/core";
import {
  IconSun,
  IconMoonStars,
  IconUserSquareRounded,
  IconSearch,
  IconFilter,
} from "@tabler/icons-react";
import classes from "@/styles/Header.module.css";
import { HeaderNavList } from "@/constants/data";
import { useDebouncedState, useDisclosure, useMediaQuery } from "@mantine/hooks";
import { useCarSelector } from "@/redux/carsSlice";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import AdvanceSearch from "@/components/Home/advanceSearch";

export default function Header({ defaultButtonLabel }) {
  const router = useRouter();
  const [opened, { open, close }] = useDisclosure(false);
  const [drawerOpened, { toggle: toggleDrawer, close: closeDrawer }] =
    useDisclosure(false);
  const { colorScheme, toggleColorScheme } = useMantineColorScheme();
  const [dark, setDark] = useState(true);
  const [searchValue, setSearchValue] = useDebouncedState('', 1000);
  const [demoList, setDemoList] = useState([]);
  const cars = useCarSelector();
  useEffect(() => {
    setDark(colorScheme === "dark");
  }, [colorScheme]);
  useEffect(() => {
    setDemoList(cars?.filtered);
  }, [cars?.filtered?.length]);
  useEffect(() => {
    closeDrawer();
  }, [router?.pathname, router?.asPath]);
  // useEffect(() => {
  //   //actuion?searchCarName=searchValue
  //   router.push({
  //     pathname: 'auction',
  //     query: { ...router.query, searchCarName: searchValue },
  //   });
  // }, [searchValue])
  const isSmallScreen = useMediaQuery("(max-width: 768px)");
  const imageSrc = isSmallScreen
    ? "/cex-simple-logo.png"
    : dark
      ? "/cex-simple-logo.png"
      : "/cex-simple-logo.png";
  // (dark ? "/cex-simple-logo.png" : "/cex-simple-logo.png")
  const searchRef = useRef(null); // Reference to the input element
   const searchData=()=>{
	  if(searchValue.length>0){
		    router.push({
      pathname: 'auction',
      query: { ...router.query, searchCarName: searchValue },
    });
	  }
   }
  const clearSearch = () => {
    if (searchRef.current) {
      searchRef.current.value = ''; // Clear the input value directly
    }
    setSearchValue('');
  };
  return (
    <>
      <Modal
        opened={opened}
        onClose={close}
        size="975"
        centered
        className="search_modal"
        radius={'xl'}
      >
        <AdvanceSearch carMakes="" carModel="" demoList={demoList} close={close} searchValue={searchValue} />
      </Modal>
      <header className={classes.header}>
        <Container
          px={{ base: "xs", md: "lg" }}
          size="xl"
          className={classes.navContainer}
        >

          <Group justify="space-between" h="100%" wrap="nowrap">
            <Link href="/">
              <Image
                src={imageSrc}
                alt="logo"
                w={{ base: "40px", sm: "45px" }}
                h={{ base: "55px", sm: "60px" }}
              />
            </Link>
            <Box pos="relative" className="header-search" visibleFrom="md">
              <form action="">
                {/* Debounced value: {searchValue} */}
                <TextInput
                  ref={searchRef}
                  defaultValue={searchValue}
                  // value={searchValue}
                  onChange={(event) => setSearchValue(event.currentTarget.value)}
                  rightSectionPointerEvents="all"
                  // width={'100%'}
                  placeholder="Search"
                  leftSection={<UnstyledButton onClick={searchData}><IconSearch size={16} /></UnstyledButton>}
                  rightSection={
                    <CloseButton
                      aria-label="Clear input"
                      onClick={clearSearch}
                      // onClick={() => setSearchValue("")}
                      style={{ display: searchRef.current?.value ? undefined : "none" }}
                      // me={62}
                      c={"#3CDFCD"}
                    />
                  }
                  styles={(theme) => ({
                    input: {
                      paddingRight: "65px",
                      width: "100%",
                      fontSize: "25px",
                    },
                  })}
                />
                <Button
                  onClick={() => {
                    open();
                  }}
                  c={"#040509"}
                  w={35}
                  pos={"absolute"}
                  top={0}
                  right={0}
                  p="5px 8px"
                  radius="5px"
                >
                  <Image src="/assets/ic_filter.svg" alt="filter icon" />
                </Button>
              </form>
            </Box>
            <Group gap={0} wrap="nowrap" h="100%">
              <Burger
                p={0}
                w={20}
                size={"sm"}
                opened={drawerOpened}
                onClick={() => toggleDrawer()}
                hiddenFrom="md"
              />
              <Space w={{ base: "xs", xs: "md" }} hiddenFrom="md" />
              <Group justify="center" gap={0} hiddenFrom="md" wrap="nowrap">
                <Button
                  variant="outline"
                  color={"#3CDFCD"}
                  c={dark ? "#fff": '#01D1B9'}
                  px={12}
                  radius="xl"
                  onClick={() => {
                    router.push("/signin");
                    closeDrawer();
                  }}
                >
                  Sign in
                </Button>
                <Space w={{ base: "xs", xs: "md" }} />
                <Button
                  size="sm"
                  c={"#000"}
                  px={12}
                  radius="xl"
                  onClick={() => {
                    router.push("/signup");
                    closeDrawer();
                  }}
                >
                  Sell
                </Button>
              </Group>
              <Space w={{ base: "xs", xs: "md", md: 0 }} />
              <Flex h="100%" gap={0} visibleFrom="md" align="center">
                {HeaderNavList.public.map((nav, i) => (
                  <Link
                    href={nav.link}
                    className={classes.link}
                    key={`mdlink${i}`}
                  >
                    {nav.title}
                  </Link>
                ))}
                <Group visibleFrom="md" ml={10} wrap="nowrap">
                  <Button
                    component={Link}
                    href="/create-advert#advertising_Price"
                    variant="outline"
                    color="#3CDFCD"
                    c={dark ? "#fff" : "#3CDFCD"}
                    radius="xl"
                  >
                    Sell Your Car
                  </Button>
                  <Button
                    c={"#000"}
                    radius="xl"
                    onClick={() => {
                      router.push(
                        `/${defaultButtonLabel.toLowerCase().replace(" ", "")}`
                      );
                    }}
                    leftSection={<IconUserSquareRounded size={16} />}
                  >
                    {defaultButtonLabel}
                  </Button>
                  <ActionIcon
										variant="outline"
										color={dark ? 'yellow' : 'ocean-blue'}
										onClick={() => toggleColorScheme()}
										title="Toggle color scheme"
									>
										{dark ? <IconSun size={16} /> : <IconMoonStars size={16} />}
									</ActionIcon>
                </Group>
              </Flex>

              <ActionIcon
								variant="outline"
								color={dark ? 'yellow' : 'ocean-blue'}
								onClick={() => toggleColorScheme()}
								title="Toggle color scheme"
								hiddenFrom="md"
							>
								{dark ? <IconSun size={16} /> : <IconMoonStars size={16} />}
							</ActionIcon>
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
        <Link
          href="/"
          style={{
            position: "absolute",
            top: "10px",
            left: "10px",
            zIndex: "9999",
          }}
        >
          <Image
            src={dark ? "/cex-simple-logo.png" : "/cex-simple-logo.png"}
            alt="logo"
            style={{ width: "140px", height: "60px", objectFit: "contain" }}
          />
        </Link>
        <ScrollArea h={`calc(100vh - ${rem(80)})`} mx="-md">
          <Divider my="md" />

          {HeaderNavList.public.map((nav, i) => (
            <Link
              href={nav.link}
              className={classes.link}
              key={`smlink${i}`}
              onClick={() => closeDrawer()}
            >
              {nav.title}
            </Link>
          ))}

          <Divider my="md" />

          <Group justify="center" grow pb="xl" px="md">
            <Button
              variant="default"
              onClick={() => {
                router.push("/signin");
                closeDrawer();
              }}
            >
              Sign in
            </Button>
            <Button
              onClick={() => {
                router.push("/signup");
                closeDrawer();
              }}
            >
              Sell
            </Button>
          </Group>
        </ScrollArea>
      </Drawer>
    </>
  );
}