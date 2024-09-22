import { GoogleSignUpForm } from "@/components/GoogleSignup/GoogleSignUp";
import MetaDecorator from "@/components/Meta/metaDecor";
import { Card, BackgroundImage } from "@mantine/core";
import { useSearchParams } from "next/navigation";

export default function GoogleSignUp() {
  const searchParams = useSearchParams();

  const email = searchParams.get("email");
  const fullName = searchParams.get("fullName");

  return (
    <BackgroundImage src="/siteHome.webp" radius="sm">
      <MetaDecorator title="Trade Dept | Sign up" />
      <Card radius="0" p="0" w="100%">
        {email ? <GoogleSignUpForm email={email} fullName={fullName} /> : ""}
      </Card>
    </BackgroundImage>
  );
}
