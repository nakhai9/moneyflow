/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  env: {
    URL: 'http://localhost:3000/',
    SERVER: "http://localhost:3200"
  },
  async redirects() {
    return [
      {
        source: '/auth',
        destination: '/auth/login',
        permanent: false
      }
    ]
  }
}

module.exports = nextConfig
