import { Title, Container, Text, UnstyledButton, Overlay, SimpleGrid } from '@mantine/core';
import classes from '@/styles/FaqWithHeader.module.css';
import { ContactIconsList } from './ContactIcons';
import { categories } from '@/constants/data';

export function FaqWithHeader() {
  const items = categories.map((category) => (
    <UnstyledButton
      style={{ backgroundImage: `url(${category.image})` }}
      className={classes.categoryCard}
      key={category.label}
    >
      <Overlay color="#000" opacity={0.6} zIndex={1} />
      <Text size="xl" ta="center" fw={700} className={classes.categoryLabel}>
        {category.label}
      </Text>
    </UnstyledButton>
  ));

  return (
    <Container className={classes.wrapper} size="lg" mt="lg" pt="lg" id="contactUs">
      <div className={classes.header}>
        <div>
          <Title order={2} className={classes.title}>Frequently Asked Questions</Title>
          <Text className={classes.titleOverlay} role="presentation">
            FAQ
          </Text>
        </div>

        <div className={classes.contact}>
          <Text size="xl" fw={500} className={classes.contactTitle}>
            Contact us
          </Text>

          <ContactIconsList />
        </div>
      </div>

      <SimpleGrid cols={{ base: 1, sm: 3 }}>{items}</SimpleGrid>
    </Container>
  );
}