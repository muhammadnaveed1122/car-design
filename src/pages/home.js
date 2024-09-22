
import CarCardGridDesktop from '@/components/CarManage/CarCardGridDesktop';
import { UserCardImage } from '@/components/UserCards/UserCardImage';
import { useAuthFormContext } from '@/providers/AuthFormProvider';
import CarCardGrid from '@/components/CarManage/CarCardGrid';
import { ActionsGrid } from '@/components/Stats/ActionsGrid';
import { Grid, Card, Title, Divider } from '@mantine/core';
import MetaDecorator from "@/components/Meta/metaDecor";
import { useCarSelector } from '@/redux/carsSlice';
import PieChart from '@/components/Chart/PieChart';
import { useMediaQuery } from 'react-responsive';
import { useState, useEffect } from 'react';
import isAuth from '@/components/Auth/auth';
import { userService } from '@/services';
import Section from '@/layouts/Section';
import { useRouter } from 'next/router';

function UserHome() {

  const router = useRouter()
  const cars = useCarSelector();
  const authFormContext = useAuthFormContext();
  const isMobile = useMediaQuery({ query: '(max-width: 587px)' })

  const [myInfo, setMyInfo] = useState({});

  useEffect(() => {
    setMyInfo(userService?.userValue);
  }, [userService?.userValue]);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (user) {
      userService.getById(user?.id).then(() => {
        if (userService.userValue?.role === "ADMIN" || userService.userValue?.role === "SUBADMIN") {
          router.push("/admin/users");
        } else if (userService.userValue?.inPurchase) {
          router.push("/progress");
        }
      });
    } else {
      router.push("/");
    }
  }, []);

  return (
    <div style={{ minHeight: 700 }}>
      <MetaDecorator title='Trade Dept | Home' />
      <Section size="xl">
        <Grid>
          <Grid.Col span={{ base: 12, md: 3 }} px={{ base: 'md', lg: 'none' }}>
            <UserCardImage userInfo={myInfo} onEdit={() => authFormContext.openProfile()} />
            <Divider my="xl" />
            <Card withBorder radius="md" shadow="sm" h={375} visibleFrom="sm">
              <PieChart />
            </Card>
          </Grid.Col>
          <Grid.Col span={{ base: 12, md: 9 }}>
            <ActionsGrid />
            <Title align="center" py="lg">Recommended Cars</Title>
            <CarCardGridDesktop
              carCount={cars?.filtered?.length}
              cList={cars?.filtered} />
          </Grid.Col>
          <Grid.Col span={{ base: 12, sm: 4 }} hiddenFrom="sm" >
            <Card withBorder radius="md" shadow="sm" h={375} p='0' mx={{ base: 'sm', lg: 'none' }}>
              <PieChart />
            </Card>
          </Grid.Col>
        </Grid>
      </Section>
    </div>
  )
}
export default isAuth(UserHome)