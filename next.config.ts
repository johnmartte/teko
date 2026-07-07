import type { NextConfig } from "next";

// El backend en Railway no incluye teko.do en su lista de CORS, así que
// el navegador bloquea las llamadas directas. Para no tocar el backend,
// proxeamos /api/v1/* desde el mismo origen (Next.js reenvía del lado del
// servidor, donde no aplica CORS).
const BACKEND_ORIGIN = "https://teko-production.up.railway.app";

const nextConfig: NextConfig = {
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
