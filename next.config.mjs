/** @type {import('next').NextConfig} */
const nextConfig = {
  // turbo: false,
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: "https://serverrsdecor.vercel.app/api/:path*",
      },
    ];
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;
