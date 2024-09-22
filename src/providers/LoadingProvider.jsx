import { createContext, useContext, useState, useEffect } from 'react';
import classes from "@/styles/LittleComponent.module.css"
import { LoadingOverlay } from "@mantine/core";
import Router from 'next/router';

const LoadingContext = createContext();

export function LoadingProvider({ children }) {

  const [loading, setLoading] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const startLoading = () => {
      setLoading(true);
    };

    const stopLoading = () => {
      setLoading(false);
    };

    Router.events.on('routeChangeStart', startLoading);
    Router.events.on('routeChangeComplete', stopLoading);
    Router.events.on('routeChangeError', stopLoading);

    return () => {
      Router.events.off('routeChangeStart', startLoading);
      Router.events.off('routeChangeComplete', stopLoading);
      Router.events.off('routeChangeError', stopLoading);
    };
  }, []);

  return (
    <LoadingContext.Provider value={{ isLoading, setIsLoading }}>
      <LoadingOverlay visible={isLoading || loading} className={classes.loadingOverlay} zIndex={2000} overlayProps={{ radius: "sm", blur: 2 }} />
      {children}
    </LoadingContext.Provider>
  );
}
export function useLoadingContext() {
  return useContext(LoadingContext);
}