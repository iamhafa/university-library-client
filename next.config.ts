import type { NextConfig } from "next";

const nextConfig: NextConfig = {
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
        protocol: "https",
        hostname: "tiki.vn",
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;
