import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Konfigurasi yang sudah ada
  experimental: {
    serverComponentsExternalPackages: ['sequelize', 'mysql2']
  },

  // Tambahkan fungsi redirects di sini
  async redirects() {
    return [
      {
        source: '/',
        destination: '/frontend/landing',
        permanent: true,
      },
    ]
  },
};

export default nextConfig;