/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ["img.youtube.com", "www.speedrun.com"],
    loader: "custom",
    loaderFile: "./imgeLoader.js",
  },
  experimental: {
    runtime: "experimental-edge",
  },
};

module.exports = nextConfig;
