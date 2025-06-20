/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    // Не прерывать билд при ошибках ESLint
    ignoreDuringBuilds: true,
  },
  typescript: {
    // Не прерывать билд при ошибках TypeScript
    ignoreBuildErrors: true,
  },
};

module.exports = nextConfig;
