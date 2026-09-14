/** @type {import('next').NextConfig} */
const nextConfig = {
  reactCompiler: true,
  async redirects() {
    return [
      // Old /admin panel was moved to /verre-admin
      {
        source: '/admin',
        destination: '/verre-admin',
        permanent: false,
      },
      {
        source: '/admin/:path*',
        destination: '/verre-admin/:path*',
        permanent: false,
      },
    ];
  },
};

export default nextConfig;
