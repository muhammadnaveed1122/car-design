import Head from 'next/head';

const defaultImage = "https://spaces1234.nyc3.cdn.digitaloceanspaces.com/cars/1708566181281_dMBnPLM7854-w4zj2UF9aBwjF2c.jpg";
const defaultDescription = "Experience the timeless appeal of quality and craftsmanship.";
const carURL = "https://cexauto.ro/";
const twitterSummary = "summary_large_image";

const MetaDecorator = ({ title, description, imageUrl }) => (
  <Head>
    <meta charSet="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>{title}</title>
    <link rel="canonical" href={carURL} key="canonical" />
    
    {/* Open Graph Meta Tags */}
    <meta property="og:title" content={title} />
    <meta property="og:description" content={description || defaultDescription} />
    <meta property="og:image" content={imageUrl || defaultImage} />
    <meta property="og:image:width" content="1200" />
    <meta property="og:image:height" content="630" />
    <meta property="og:url" content={carURL} />
    <meta property="og:type" content="website" />

    {/* Twitter Card Meta Tags */}
    <meta name="twitter:card" content={twitterSummary} />
    <meta name="twitter:title" content={title} />
    <meta name="twitter:description" content={description || defaultDescription} />
    <meta name="twitter:image" content={imageUrl || defaultImage} />
    <meta name="twitter:image:width" content="1200" />
    <meta name="twitter:image:height" content="630" />
  </Head>
);

export default MetaDecorator;