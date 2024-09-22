import { createContext, useContext } from 'react';

const AuthFormContext = createContext();

export function AuthFormProvider({ children, openProfile, openAddress }) {

  return (
    <AuthFormContext.Provider value={{ openProfile, openAddress }}>
      {children}
    </AuthFormContext.Provider>
  );
}
export function useAuthFormContext() {
  return useContext(AuthFormContext);
}