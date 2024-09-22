import { fetchCarsAsync, updateFilter, useCarDispatch, useCarSelector } from '@/redux/carsSlice';
import { Container, Button, Title, Input } from '@mantine/core';
import AuctionSteps from '@/components/Progress/AuctionSteps';
import { FaqWithHeader } from '@/components/FaqWithHeader';
import { FeaturesCards } from '@/components/FeaturesCards';
import MetaDecorator from '@/components/Meta/metaDecor';
import CookieConsent from '@/components/CookieConsent';
import { trackFCP } from '../components/fcp.tracker';
import { HowItWork } from '@/components/HowItWork';
import { useRef, useEffect, useState } from 'react';
import { IconSearch, } from "@tabler/icons-react";
import MainContent from '@/components/Home/Main';
import Comment from '@/components/Home/comment';
import { comments } from '@/constants/data';
import isAuth from '@/components/Auth/auth';
import Cars from '@/components/Home/Cars';
import { userService } from '@/services';
import { useRouter } from 'next/router';
import Section from '@/layouts/Section';
import Head from 'next/head';
import getConfig from 'next/config';

function Home() {

  const { publicRuntimeConfig } = getConfig();
  const SiteURL = publicRuntimeConfig.SiteURL;
  const router = useRouter();
  const cars = useCarSelector();
  const searchInput = useRef(null);
  const dispatch = useCarDispatch();

  const [demoList, setDemoList] = useState([]);
  const [showForm, setShowForm] = useState(false);

  const onSearchClicked = (e) => {
    e.preventDefault()
    if (searchInput.current.value)
      router.push(`/marketplace?search=${searchInput.current.value}`);
  }

  useEffect(() => {
    if (cars?.filtered && cars?.filtered?.length > 0) {
      const sixCars = cars.filtered?.filter((car) => car.status === 'LIVE')
        .sort(() => 0.5 - Math.random()).slice(0, 9)
      setDemoList(sixCars);
    }
  }, [cars?.filtered?.length]);

  useEffect(() => {
    setShowForm(!!!userService?.userValue);
    if (!userService?.userValue) {
      dispatch(fetchCarsAsync({ referal: "ALL" }))
    }
  }, [userService?.userValue]);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (user) {
      userService.getById(user?.id).then(() => {
        if (userService.userValue?.role === "ADMIN" || userService.userValue?.role === "SUBADMIN") {
        } else if (userService.userValue?.inPurchase) {
          router.push("/progress");
        }
      });
    } else {
      router.push("/");
    }
    dispatch(updateFilter({ search: "" }))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    trackFCP();
  }, []);
  return (
    <>

      <MetaDecorator
        title="Used Car Auctions Online | Online Car Auctions for Public | Trade Dept"
        description="Discover the best deals at Trade Dept, your trusted destination for online car auctions. Bid on quality used cars today!"
        imageUrl={`${SiteURL}/HomeCar.webp`}
      />
      <Head>
        <meta name="keywords" content="used car auctions online, online car auctions for public, online car auction, live car auctions, used cars for sale auction" />
        <meta name="description" content="Discover the best deals at Trade Dept, your trusted destination for online car auctions. Bid on quality used cars today!" />
      </Head>
      <CookieConsent />
      <section id="home">
        <MainContent showForm={showForm} demoList={demoList} />
      </section>
      <Section title="Search Vehicle Stock" isGradient={true} id="findAVehicles">
        <Container className="search-container" >
          <Title order={3} fw={400} align="center" style={{ color: 'white' }} py="lg" pt={0}>We have wide variety of brand new vehicles for export</Title>
          <form onSubmit={(e) => onSearchClicked(e)}>
            <Input
              ref={searchInput}
              leftSection={<IconSearch size={24} />}
              rightSectionPointerEvents="all"
              rightSection={
                <Button radius="md" c='#000' size="lg" px="10" w="80" mr='-2' onClick={(e) => onSearchClicked(e)}>Search</Button>
              }
              size="lg"
              placeholder="Search Vehicles..."
              radius="md"
            />
          </form>
        </Container>
      </Section>
      <Cars userValue={userService.userValue} demoList={demoList} router={ router} />
      <Section className="howItWorks howItWorksContainer" title="How it works?" my="xl" isGradient={false} id="howItWorks">
        <AuctionSteps />
      </Section>
      <Section>
        <HowItWork />
      </Section>
      <Section title="Why choose Trade Dept?" isGradient={true} id="whyChoose">
        <FeaturesCards />
      </Section>
      <FaqWithHeader />
      <Section title="Trusted by 10,000+ Customers Worldwide" isGradient={true} >
        <Comment comments={comments} />
      </Section>
    </>
  )
}
export default isAuth(Home)