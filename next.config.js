/** @type {import('next').NextConfig} */

const BLOCK_ROUTES = [
  { source: '/', destination: '/dashboard', permanent: false },
  { source: '/auth', destination: '/auth/login', permanent: false },
  { source: '/wallet', destination: '/dashboard', permanent: false },
]

const nextConfig = {
  reactStrictMode: true,
  env: {
    URL: 'http://localhost:3000/',
    SERVER: "http://localhost:3200"
  },
  async redirects() {
    return BLOCK_ROUTES;
  },
  images: {
    domain: ["https://scontent.fvca1-3.fna.fbcdn.net", "https://www.google.com"]
  },
  transpilePackages: ['@mui/x-charts'],
}

module.exports = nextConfig
