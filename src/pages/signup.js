import { SignUpForm } from '@/components/AuthenticationForm';
import MetaDecorator from '@/components/Meta/metaDecor';
import { Card, BackgroundImage } from '@mantine/core';
import { useSearchParams } from 'next/navigation';

export default function SignUp() {

  const searchParams = useSearchParams();

  const referal = searchParams.get('referal');
  const email = searchParams.get('email');
  const fullName = searchParams.get('fullName');

  return (
    <BackgroundImage
      src="/siteHome.webp"
      radius="sm"
    >
      <MetaDecorator
        title='Trade Dept | Sign up'
      />
      <Card radius="0" p="0" w="100%">
        <SignUpForm referalCode={referal} email={email} fullName={fullName} />
      </Card>
    </BackgroundImage>
  )
}

