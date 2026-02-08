import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  serverExternalPackages: ["@prisma/client", ".prisma"],
  reactStrictMode: false,
};

export default nextConfig;
