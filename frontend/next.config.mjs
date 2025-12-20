js
/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    runtime: "nodejs",
  },

  webpack: (config, { isServer }) => {
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

    config.experiments = {
      asyncWebAssembly: true,
    };

    return config;
  },
};

export default nextConfig;

