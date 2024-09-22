import { ResetForm } from '@/components/AuthenticationForm';
import { Card, BackgroundImage, Box } from '@mantine/core';
import MetaDecorator from '@/components/Meta/metaDecor';

export default function SignIn() {

  return (
    <BackgroundImage
      src="/siteHome.webp"
      radius="sm" pt={150} h={900}
    >
      <MetaDecorator
        title='Trade Dept | Reset'
      />

      <Box px={20}>
        <Card radius="lg" shadow="xl" p="lg" w="100%" maw={400} mx="auto" style={{ transform: "scale(1.1)", zIndex: 500 }}>
          <ResetForm />
        </Card>
      </Box>
    </BackgroundImage>
  )
}
