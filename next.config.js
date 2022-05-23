/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ["https://res.cloudinary.com/", "res.cloudinary.com", 'localhost'],
  },
}

module.exports = nextConfig
