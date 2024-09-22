import { Title, SimpleGrid, Text, Button, ThemeIcon, Grid, rem } from '@mantine/core';
import classes from '@/styles/FeaturesTitle.module.css';
import { features } from '@/constants/data';
import { userService } from "@/services";
import { useRouter } from "next/router";


export function HowItWork() {
  const router = useRouter();
  const items = features.map((feature) => (
    <div key={feature.title}>
      <ThemeIcon
        size={44}
        radius="md"
      >
        <feature.icon style={{ width: rem(26), height: rem(26) }} stroke={1.5} />
      </ThemeIcon>
      <Text fz="lg" mt="sm" fw={500}>
        {feature.title}
      </Text>
      <Text c="dimmed" fz="sm">
        {feature.description}
      </Text>
    </div>
  ));

  return (
    <div className={classes.wrapper}>
      <Grid gutter={{ base: '40px', xs: '80px' }}>
        <Grid.Col span={{ base: 12, md: 5 }}>
          <Title className={classes.title} order={2}>
            Your Road to Hassle-Free Car Ownership
          </Title>
          <Text c="dimmed">
            At Trade Dept, we've streamlined the car-buying process to make it as easy as possible for you. Here's how it all comes together:
          </Text>

          {
            userService && userService.userValue ?
              ''
              :
              <Button
                variant="gradient"
                gradient={{ deg: 270, from: '#3cdfcd', to: '#1acab7' }}
                size="lg"
                radius="md"
                mt="xl"
                c='#000'
                onClick={() => {
                  router.push("/signup");
                }}
              >
                Get started
              </Button>
          }

        </Grid.Col>
        <Grid.Col span={{ base: 12, md: 7 }}>
          <SimpleGrid cols={{ base: 1, xs: 2 }} spacing={30}>
            {items}
          </SimpleGrid>
        </Grid.Col>
      </Grid>
    </div>
  );
}