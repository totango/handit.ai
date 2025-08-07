/** @type {import('next').NextConfig} */
const config = {
  output: 'standalone',
  assetPrefix: process.env.NODE_ENV === 'production' ? undefined : '',
  publicRuntimeConfig: {
    apiUrl: process.env.NEXT_PUBLIC_API_URL
  }
};

export default config;
