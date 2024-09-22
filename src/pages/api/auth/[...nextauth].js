import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import FacebookProvider from "next-auth/providers/facebook"
import getConfig from 'next/config';
const { publicRuntimeConfig } = getConfig();
export const authOptions = {
  providers: [
    GoogleProvider({
      clientId:publicRuntimeConfig.googleClient,
      clientSecret:publicRuntimeConfig.googleSecret,
    }),
    FacebookProvider({
      clientId:
        "853721510153365",
      clientSecret: "658ca9cc4bee32a36216de8a39a9cbbc",
    })
  ],
  secret: "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",
  callbacks: {
    async signIn({ account, profile, email, credentials }) {
      return true;
    },
    async session({ session,token }) {
      session.provider=token?.provider
      return session;
    },
    async jwt({ token, account }) {
      // Save the provider in the token for access in the session callback
      if (account) {
        token.provider = account.provider;
      }
      return token;
    }
  },
};
export default NextAuth(authOptions);
