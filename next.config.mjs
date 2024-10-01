/** @type {import('next').NextConfig} */
const nextConfig = {
    async redirects() {
        return [
            {
                source: '/',      // When the root URL is visited
                destination: '/readers', // Redirect to this URL
                permanent: false, // Set to true for permanent 301 redirects
            },
            ]
        },
};

export default nextConfig;
// next.config.mjs