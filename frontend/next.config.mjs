/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    runtime: "nodejs", // OBLIGATOIRE pour crypto / FHE
  },

  webpack: (config, { isServer }) => {
    // ⚠️ NE PAS désactiver crypto
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        net: false,
        tls: false,
        os: false,
        path: false,
        stream: false,
      };
    }

    // WASM OK mais contrôlé
    config.experiments = {
      asyncWebAssembly: true,
    };

    return config;
  },
};

export default nextConfig;
