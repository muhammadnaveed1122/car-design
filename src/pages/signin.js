import { LoginForm } from '@/components/AuthenticationForm';
import { Card, BackgroundImage, Box } from '@mantine/core';
import MetaDecorator from '@/components/Meta/metaDecor';

export default function SignIn() {
  return (
    <BackgroundImage
      src="/siteHome.webp"
      radius="sm" py={150}
    >
      <MetaDecorator
        title='Trade Dept | Sign in'
      />
      <Box px={20}>
        <Card radius="lg" shadow="xl" p="lg" w="100%" maw={400} mx="auto" style={{ transform: "scale(1.1)", zIndex: 500 }}>
          <LoginForm />
        </Card>
      </Box>
    </BackgroundImage>
  )
}
