/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['dpewvagbzhhrpplvphui.supabase.co'],
  },
  env: {
    NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
    NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  },
  async redirects() {
    return [
      {
        source: '/home',
        destination: '/',
        permanent: true,
      },
    ]
  },
  typescript: {
    ignoreBuildErrors: true, // Temporarily set to true to debug deployment
  },
  eslint: {
    ignoreDuringBuilds: true, // Temporarily set to true to debug deployment
  },
  poweredByHeader: false,
  generateEtags: true,
  compress: true,
  productionBrowserSourceMaps: false,
}

module.exports = nextConfig