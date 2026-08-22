import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'export',
  basePath: '/ByteForce-odoo-hackathon',
  images: {
    unoptimized: true,
  },
};

export default nextConfig;

