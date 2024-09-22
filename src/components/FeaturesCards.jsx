import { Badge, Group, Text, Card, SimpleGrid, Container, rem } from '@mantine/core';
import classes from '@/styles/FeaturesCards.module.css';
import { mockdata } from '@/constants/data';

export function FeaturesCards() {
  const features = mockdata.map((feature) => (
    <Card key={feature.title} shadow="md" radius="md" className={classes.card} padding="xl">
      <feature.icon
        style={{ width: rem(50), height: rem(50) }}
        stroke={2}
        color="#3CDFCD"
      />
      <Text fz="lg" fw={500} className={classes.cardTitle} mt="md">
        {feature.title}
      </Text>
      <Text fz="sm" mt="sm">
        {feature.description}
      </Text>
    </Card>
  ));

  return (
    <Container size="lg" py="xl">
      <Group justify="center">
        <Badge variant="filled" size="lg">
          Best company ever
        </Badge>
      </Group>

      <Text className={classes.description} ta="center" mt="md">
        At Trade Dept, we take immense pride in being more than just a car dealership; we're your trusted automotive partner. Our commitment to excellence and unwavering dedication to customer satisfaction have earned us the reputation of being the best in the business.
      </Text>

      <SimpleGrid cols={{ base: 1, md: 3 }} spacing="xl" mt={50}>
        {features}
      </SimpleGrid>
    </Container>
  );
}