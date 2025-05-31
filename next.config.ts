import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  cleanDistDir: true,
  async redirects() {
    return [
      {
        source: "/",
        destination: "/dashboard",
        permanent: true, // true = mã 308, tốt cho SEO nếu bạn không đổi lại
      },
    ];
  },
  images: {
    remotePatterns: [
      {
        protocol: "https", // allows both http and https
        hostname: "**", // allows any domain
      },
    ],
  },
};

export default nextConfig;
