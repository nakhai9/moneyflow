/** @type {import('next').NextConfig} */

const BLOCK_ROUTES = [
  { source: '/auth', destination: '/auth/login', permanent: false },
  { source: '/wallet', destination: '/', permanent: false }
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
    domain: ["https://scontent.fvca1-3.fna.fbcdn.net"]
  }
}

module.exports = nextConfig
