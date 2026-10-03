import type { NextConfig } from "next";
const nextConfig: NextConfig = {
  async redirects() {
    return [
      { source: "/home", destination: "/", permanent: true },
      { source: "/about", destination: "/#about", permanent: true },
      { source: "/contact", destination: "/#contact", permanent: true },
      {
        source: "/letsworktogether",
        destination: "/#contact",
        permanent: true,
      },
      { source: "/privacypolicy", destination: "/privacy", permanent: true },
      { source: "/bookkeeping", destination: "/#services", permanent: true },
      {
        source: "/financial-advisory",
        destination: "/#services",
        permanent: true,
      },
      { source: "/fractional-cfo", destination: "/#services", permanent: true },
      {
        source: "/services-store/:path*",
        destination: "/#services",
        permanent: true,
      },
      { source: "/cart", destination: "/#contact", permanent: true },
    ];
  },
  async headers() {
    return [
      {
        source: "/media/:path*",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=86400, stale-while-revalidate=604800",
          },
        ],
      },
      {
        source: "/fonts/:path*",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
    ];
  },
};
export default nextConfig;
