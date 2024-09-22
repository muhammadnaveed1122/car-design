
import { fetchCarsAsync, useCarDispatch, useCarSelector } from '@/redux/carsSlice';
import CarCardEnded from '@/components/CarManage/CarCardEnded';
import CarCardGrid from '@/components/CarManage/CarCardGrid';
import { Group, SegmentedControl } from '@mantine/core';
import MetaDecorator from '@/components/Meta/metaDecor';
import { useState, useEffect } from 'react';
import isAuth from '@/components/Auth/auth';
import { userService } from '@/services';
import Section from '@/layouts/Section';
import { useRouter } from 'next/router';

function UserAuctions() {

  const router = useRouter();
  const cars = useCarSelector();
  const dispatch = useCarDispatch();

  const [filter, setFilter] = useState("Active Auctions");

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
    dispatch(fetchCarsAsync({
      id: userService?.userValue?.id,
      referal: userService?.userValue?.referal
    }))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div style={{ minHeight: 700 }}>
      <MetaDecorator title='Trade Dept | My Auctions' />
      <Section>
        <Group grow>
          <SegmentedControl
            fullWidth
            color='ocean-blue'
            data={["Active Auctions", "Won Auctions"]}
            value={filter}
            onChange={val => setFilter(val)} />
        </Group>
        {
          filter.startsWith("Active") ?
            <CarCardGrid
              carCount={cars.runlist.length}
              cList={cars.runlist} /> :
            <CarCardEnded
              carCount={cars.soldlist.length}
              cList={cars.soldlist} />
        }
      </Section>
    </div>
  )
}
export default isAuth(UserAuctions)