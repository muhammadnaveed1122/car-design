import { Button, Paper, Text, Group, CloseButton, Container, Title, Flex, useMantineColorScheme } from '@mantine/core';
import { useMediaQuery } from '@mantine/hooks';
import { hasCookie, setCookie } from "cookies-next";
import React, { useEffect, useState } from "react";

const CookieConsent = () => {
  const [showConsent, setShowConsent] = React.useState(true);

  const [dark, setDark] = useState(true);
  const { colorScheme } = useMantineColorScheme();
  const isSmallScreen = useMediaQuery('(max-width: 56.25em)')
  useEffect(() => {
    setDark(colorScheme === "dark");
  }, [colorScheme]);

  useEffect(() => {
    setShowConsent(hasCookie("localConsent"));
  }, []);

  const acceptCookie = () => {
    setShowConsent(true);
    setCookie("localConsent", "true", {});
  };

  if (showConsent) {
    return null;
  }

  return (
    <Container w={{ base: 375, sm: 500, md: 900 }} c={dark ? '#fff' : '#06070A'} style={{
      position: "fixed", bottom: 20, zIndex: 300, left: "50%", transform: "translateX(-50%)"
    }}>
      <Paper withBorder p={{ base: 'sm', sm: "lg" }} radius="md" shadow="md">
        {/* <CloseButton mr={-9} mt={-9} onClick={() => setShowConsent(true)} /> */}
        <Flex wrap={{ base: 'wrap', md: 'nowrap' }}>
          <Group justify="space-between" gap={10}>
            <Title order={isSmallScreen ? 4 : 3} fw={600}>
              Allow cookies
            </Title>
            <Text fz={{ base: 'xs', sm: 'md' }}>
              By clicking "Accept all cookies", you agree stack exchange can store cookies on your device and disclose information in accordance with our Cookies Policy.
            </Text>
          </Group>
          <Flex align='center' justify={{base: 'space-between', sm: 'center'}} w={{ base: '100%', sm: '100%'}} mt={{ base: 'sm', sm: "md" }} wrap='nowrap' gap={isSmallScreen ? '5' : 'md'}>
            <Button variant="variant" c='#0D0101' size={isSmallScreen ? 'sm' : 'md'} px={{ base: 'sm', sm: 'lg' }} radius='xl' onClick={acceptCookie}>
              Accept all cookies
            </Button>
            <Button variant="outline" color={'#01D1B9'} c={dark ? '#FFFFFF' : '#0D0101'} size={isSmallScreen ? 'sm' : 'md'} px={{ base: 'sm', sm: 'lg' }} radius='xl' onClick={() => setShowConsent(true)}>
              Reject all cookies
            </Button>
          </Flex>
        </Flex>
      </Paper>
      {/* <Paper withBorder p="lg" radius="md" shadow="md">
        <Group justify="space-between" mb="xs">
          <Text fz="md" fw={500}>
            Allow cookies
          </Text>
          <CloseButton mr={-9} mt={-9} onClick={() => setShowConsent(true)} />
        </Group>
        <Text c="dimmed" fz="xs">
          Welcome to Trade Dept! We use cookies to enhance your experience and provide personalized services. 
          By using our website, you consent to all cookies in accordance with our Cookie Policy. To learn more or manage your preferences, please review our Cookie Policy.
        </Text>
        <Group justify="flex-end" mt="md">
          <Button variant="outline" size="xs" onClick={acceptCookie}>
            Accept all
          </Button>
        </Group>
      </Paper> */}
    </Container>
  );
};

export default CookieConsent;