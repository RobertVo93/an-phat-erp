/** @type {import('next').NextConfig} */
const nextConfig = {
  assetPrefix: "/admin-static",
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
}

export default nextConfig