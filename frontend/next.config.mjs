/** @type {import('next').NextConfig} */
const nextConfig = {
    webpack: (config) => {
        config.experiments = {
            ...config.experiments,
            asyncWebAssembly: true,
            layers: true,
        };

        // Provide fallbacks for Node.js modules used by fhevmjs
        config.resolve.fallback = {
            ...config.resolve.fallback,
            fs: false,
            path: false,
            crypto: false,
        };

        return config;
    },
};

export default nextConfig;
