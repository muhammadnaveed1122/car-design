
import MetaDecorator from '@/components/Meta/metaDecor'
import { SignUpForm } from '@/components/SellerAuthenticationForm';
import { BackgroundImage, Card } from '@mantine/core'
import { useSearchParams } from 'next/navigation'

const SellerSignUp = () => {
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

export default SellerSignUp