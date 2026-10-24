import type { NextConfig } from "next";

// El backend en Railway no incluye teko.do en su lista de CORS, así que
// el navegador bloquea las llamadas directas. Para no tocar el backend,
// proxeamos /api/v1/* desde el mismo origen (Next.js reenvía del lado del
// servidor, donde no aplica CORS).
const BACKEND_ORIGIN = "https://teko-production-9928.up.railway.app";

const nextConfig: NextConfig = {
  async headers() {
    return [
      {
        source: "/media/:path*",
        headers: [{ key: "Cache-Control", value: "public, max-age=604800, stale-while-revalidate=86400" }],
      },
    ];
  },
  async rewrites() {
    return [
      {
        source: "/api/v1/:path*",
        destination: `${BACKEND_ORIGIN}/api/v1/:path*`,
      },
    ];
  },
};

export default nextConfig;
