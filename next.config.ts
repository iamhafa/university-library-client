import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  async redirects() {
    return [
      {
        source: "/",
        destination: "/dashboard",
        permanent: true, // true = mã 308, tốt cho SEO nếu bạn không đổi lại
      },
    ];
  },
};

export default nextConfig;
