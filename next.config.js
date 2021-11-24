const withSass = require("@zeit/next-sass");
module.exports = withSass();

module.exports = {
  reactStrictMode: true,
  images: {
    domains: ["mosaic.scdn.co"],
  },
};
