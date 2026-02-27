/** @type {import("next").NextConfig} */
module.exports = {
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
