/** @type {import('next').NextConfig} */
const nextConfig = {
  // reactDevOverlay: false,
  serverRuntimeConfig: {
    dbConfig: {
      host: process.env.DB_HOST,
      port: 3306,
      user: process.env.DB_USER,
      password: process.env.DB_PASS,
      database: process.env.DB_NAME,
    },
    secret: "CAR-LOGIN-CRENDENTIAL",
  },
  publicRuntimeConfig: {
    apiUrl:
      process.env.NODE_ENV === "development"
        ? process.env.DEVELOPMENT_URL// development api
        : process.env.PRODUCTION_URL,
    StripeSecretKey: process.env.STRIPE_SECRET_KEY,
    vinApiPrefix: process.env.VIN_API_PREFIX,
    vinApiKey: process.env.VIN_API_KEY,
    vinSecretKey: process.env.VIN_SECRET_KEY,
    SiteURL: process.env.SITE_URL,
    googleClient:process.env.GOOGLE_CLIENT_ID,
    googleSecret:process.env.GOOGLE_SECRET_ID,

  },
  // http://localhost:3000/
  eslint: {
    ignoreDuringBuilds: true,
  },
  reactStrictMode: false,
};

module.exports = nextConfig;
