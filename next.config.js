/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ["img.youtube.com", "www.speedrun.com"],
  },
};

module.exports = nextConfig;
