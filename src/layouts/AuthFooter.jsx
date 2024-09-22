import { IconBrandTwitter, IconBrandYoutube, IconBrandInstagram } from '@tabler/icons-react';
import { Text, Container, ActionIcon, Group, rem, Flex } from '@mantine/core';
import classes from '@/styles/Footer.module.css';

export default function AuthFooter() {

  return (
    <footer className={classes.footer}>
      <Container>
        <Flex
          justify="space-between"
          align="center"
          direction={{ base: 'column', md: 'row' }}
        >
          <Text c="dimmed" size="sm">
            ©2024 Copyright Trade Dept. All rights reserved.
          </Text>

          <Group gap={0} className={classes.social} justify="flex-end" wrap="nowrap">
            <ActionIcon size="lg" color="gray" variant="subtle">
              <IconBrandTwitter style={{ width: rem(18), height: rem(18) }} stroke={1.5} />
            </ActionIcon>
            <ActionIcon size="lg" color="gray" variant="subtle">
              <IconBrandYoutube style={{ width: rem(18), height: rem(18) }} stroke={1.5} />
            </ActionIcon>
            <ActionIcon size="lg" color="gray" variant="subtle">
              <IconBrandInstagram style={{ width: rem(18), height: rem(18) }} stroke={1.5} />
            </ActionIcon>
          </Group>
        </Flex>
      </Container>
    </footer>
  );
}