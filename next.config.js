/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  compress: true,
  images: {
    formats: ['image/avif', 'image/webp'],
  },
};

module.exports = nextConfig;

import('@opennextjs/cloudflare').then(m => m.initOpenNextCloudflareForDev());
