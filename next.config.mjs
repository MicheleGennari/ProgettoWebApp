/** @type {import('next').NextConfig} */
const nextConfig = {
  //output: "standalone",
  compiler: {
    relay: {
      // This should match relay.config.js
      src: "./",
      artifactDirectory: "./__generated__",
      language: "typescript",
      eagerEsModules: false,
    },
  },
  experimental: {
    serverComponentsExternalPackages: ["graphql"],
  },
};

export default nextConfig;
