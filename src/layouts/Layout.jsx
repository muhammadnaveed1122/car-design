import { ProfileForm, AddressForm } from "@/components/AuthenticationForm"
import { useCarDispatch, fetchCarsAsync } from '@/redux/carsSlice';
import { AuthFormProvider } from "@/providers/AuthFormProvider";
import { ActionIcon,Modal,ScrollArea} from "@mantine/core";
import { useState, useEffect, useRef } from 'react';
import { IconArrowUp } from "@tabler/icons-react";
import { HeaderNavList } from "@/constants/data";
import { useDisclosure } from '@mantine/hooks';
import { userService } from "@/services";
import { useRouter } from "next/router";
import Header from "@/layouts/Header";
import AuthHeader from "./AuthHeader";
import Footer from "@/layouts/Footer";

export default function Layout({ children }) {

  const router = useRouter();
  const { pathname } = router;

  const [opened, { open, close }] = useDisclosure(false);

  const dispatch = useCarDispatch();

  const [showProfile, setShowProfile] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    if (userService?.userValue?.role != "ADMIN")
      HeaderNavList.admin.forEach(({ link }) => {
        if (pathname?.startsWith(link))
          router.push('/');
      })
    else if (userService?.userValue?.role != "ADMIN")
      HeaderNavList.user.forEach(({ link }) => {
        if (pathname?.startsWith(link))
          router.push('/');
      })
    if (userService?.userValue) {
      setIsLoggedIn(true);
    } else {
      setIsLoggedIn(false);
    }
  }, [userService?.userValue?.role]);


  useEffect(() => {
    if(userService?.userValue) {
      dispatch(fetchCarsAsync({
        id: userService?.userValue?.id,
        referal: userService?.userValue?.referal
      }));
    }
  }, [userService?.userValue?.id]);

  const viewport = useRef(null);
  const scrollttBtn = useRef(null);
  const scrollToTop = () => viewport.current.scrollTo({ top: 0, behavior: 'smooth' });

  useEffect(() => {
    if (!router?.asPath?.includes('#')) {
      scrollToTop();
    }
  }, [router?.pathname]);

  return (
    <AuthFormProvider
      openProfile={() => { open(); setShowProfile(true); }}
      openAddress={() => { open(); setShowProfile(false); }}
    >
      {isLoggedIn ?
        <>
          <AuthHeader
            openProfile={() => { open(); setShowProfile(true); }}
            openAddress={() => { open(); setShowProfile(false); }}
          />
          <Modal
            opened={opened}
            onClose={close}
            overlayProps={{
              backgroundOpacity: 0.55,
              blur: 3,
            }}
            centered
          >
            {showProfile ? <ProfileForm onSubmitEnd={close} /> : <AddressForm onSubmitEnd={close} />}
          </Modal>
        </>
        :
        <>
          <Header defaultButtonLabel={pathname?.startsWith("/") || pathname == "/" ? "Sign up" : "Sign in"} />
        </>
      }

      <ScrollArea h="calc(100vh - 80px)" style={{ marginTop: 80 }} viewportRef={viewport}
        onScrollPositionChange={(pos) => {
          if (pos.y < 200)
            scrollttBtn.current.classList.add('alpha-0');
          else
            scrollttBtn.current.classList.remove('alpha-0');
        }}>
        {children}
        <Footer />
      </ScrollArea>

      <ActionIcon
        size="lg"
        radius="lg"
        onClick={scrollToTop}
        title="Scroll to Top"
        style={{
          position: "fixed", right: 20, bottom: 20, zIndex: 300,
          boxShadow: "0 1px 5px 1px #2e3e80", transition: "1s ease-in",
        }}
        ref={scrollttBtn}
        className="alpha-0"
      >
        <IconArrowUp size={20} stroke={4} />
      </ActionIcon>
    </AuthFormProvider>
  )
}