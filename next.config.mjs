/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: "https://api.coingecko.com/api/v3/:path*",
      },
    ];
  },
};

export default nextConfig;
