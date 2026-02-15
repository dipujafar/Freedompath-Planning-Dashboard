/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "nazmulhasan.s3.us-east-1.amazonaws.com",
      },
      {
        protocol: "https",
        hostname: "freedom-path-planning-storage.sfo3.digitaloceanspaces.com",
      },
      {
        protocol: "https",
        hostname: "*.amazonaws.com",
      },
      {
        protocol: "http",
        hostname: "103.186.20.117",
      },
    ],
  },
};

export default nextConfig;
