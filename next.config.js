/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  rewrites: async () => {
    return [
      {
        source: "/api/:path*",
        destination:
          process.env.NODE_ENV === "development"
            ? "http://127.0.0.1:8000/:path*"
            : "http://127.0.0.1:8000/:path*", // Update this with your production API URL
      },
    ];
  },
  env: {
    API_URL: process.env.API_URL || 'http://localhost:8000'
  }
};

module.exports = nextConfig;
