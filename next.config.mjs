/** @type {import('next').NextConfig} */
const nextConfig = {
  // turbo: false,
    images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
        pathname: '/**',
      },
    ],
  },
};

export default nextConfig;
