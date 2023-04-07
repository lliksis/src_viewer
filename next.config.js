/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ["img.youtube.com", "www.speedrun.com"],
  },
  experimental: {
    runtime: "edge",
  },
};

module.exports = nextConfig;
