/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: '*',
                port: '',
                pathname: '/**/**',
            },
        ],
    },
    async redirects() {
        return [
            {
                source: '/',
                destination: '/dashboard',
                permanent: true,
            },
        ]
    }
};

module.exports = nextConfig;
