import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  output: 'standalone',
  // Configurar root do Turbopack para evitar warning de múltiplos lockfiles
  turbopack: {
    root: path.resolve(__dirname),
  },
  // Melhor compatibilidade com browsers antigos
  compiler: {
    // Remover console.log em produção (opcional)
    removeConsole: process.env.NODE_ENV === 'production' ? {
      exclude: ['error', 'warn'],
    } : false,
  },
  // Configurações de headers para melhor compatibilidade
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block',
          },
        ],
      },
    ];
  },
};

export default nextConfig;
