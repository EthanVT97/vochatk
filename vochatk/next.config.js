/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  output: 'standalone',
  images: {
    domains: ['dpewvagbzhhrpplvphui.supabase.co'],
  },
  env: {
    NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
    NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    SUPABASE_URL: process.env.SUPABASE_URL,
    POSTGRES_URL: process.env.POSTGRES_URL,
    POSTGRES_PRISMA_URL: process.env.POSTGRES_PRISMA_URL,
    POSTGRES_URL_NON_POOLING: process.env.POSTGRES_URL_NON_POOLING,
    SUPABASE_JWT_SECRET: process.env.SUPABASE_JWT_SECRET,
    POSTGRES_USER: process.env.POSTGRES_USER,
    POSTGRES_PASSWORD: process.env.POSTGRES_PASSWORD,
    POSTGRES_DATABASE: process.env.POSTGRES_DATABASE,
    POSTGRES_HOST: process.env.POSTGRES_HOST,
    SUPABASE_SERVICE_ROLE_KEY: process.env.SUPABASE_SERVICE_ROLE_KEY,
    SUPABASE_ANON_KEY: process.env.SUPABASE_ANON_KEY
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
    // Remove this if you want to enforce type checking during build
    ignoreBuildErrors: false
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