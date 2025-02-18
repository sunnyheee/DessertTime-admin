const { createProxyMiddleware } = require("http-proxy-middleware");

module.exports = function (app) {
  app.use(
    createProxyMiddleware("/admin-review", {
      target: "http://138.2.122.18:3000",
      changeOrigin: true,
    })
  );

  app.use(
    createProxyMiddleware("/reviewImg", {
      target: "http://138.2.122.18:3000",
      changeOrigin: true,
    })
  );
};
