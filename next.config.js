const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
})

module.exports = withBundleAnalyzer({
    webpackDevMiddleware(config) {
      // Solve compiling problem via vagrant
      config.watchOptions = {
        poll: 1000,   // Check for changes every second
        aggregateTimeout: 300,   // delay before rebuilding
      };
      return config;
    },
    webpack(config) {
      config.module.rules.push({
        test: /\.svg$/,
        use: ["@svgr/webpack"]
      });
  
      return config
    }
  })
  