const process = require('process');
const withPWA = require('next-pwa');
const runtimeCaching = require('next-pwa/cache');

let config = {
  reactStrictMode: true,
};

if (process.env.NODE_ENV === 'production') {
  config = withPWA({
    ...config,
    pwa: {
      dest: 'public',
      runtimeCaching,
    },
  });
}

module.exports = config;
