import type { NextConfig } from "next";

const isGithubActions = process.env.GITHUB_ACTIONS === 'true' || process.env.NODE_ENV === 'production';

const nextConfig: NextConfig = {
  output: 'export',
  basePath: isGithubActions ? '/ByteForce-odoo-hackathon' : '',
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
