/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ["https://res.cloudinary.com/", "res.cloudinary.com", 'localhost'],
  },
  'fontawesome-svg-core': {
    'license': 'free'
  }
}

module.exports = nextConfig
