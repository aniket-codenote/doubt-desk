/** @type {import("next").NextConfig} */
module.exports = {
  output: "standalone",
  serverExternalPackages: ["@prisma/client", "pg"],
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com",
      },
    ],
  },
}
