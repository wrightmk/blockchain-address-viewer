/** @type {import('next').NextConfig} */
// const nextConfig = {}

// module.exports = nextConfig

module.exports = {
  async redirects() {
    return [
      {
        source: "/",
        destination: "/0xB999986a8b503dF80a46B24D06d8B29Ca7F9874b",
        permanent: true,
      },
    ];
  },
};
