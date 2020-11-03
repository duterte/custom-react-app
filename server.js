const https = require('https');
const http = require('http');
const fs = require('fs');
const path = require('path');
const express = require('express');

const app = express();
const PORT = process.env.PORT || 3000;

const colors = require('colors');

colors.setTheme({
  info: 'yellow',
  success: 'green',
  error: 'red',
});

const webpack = require('webpack');
const webpackDevMiddleware = require('webpack-dev-middleware');
const config = require('./webpack.config');
const compiler = webpack(config);

app.use(
  webpackDevMiddleware(compiler, {
    publicPath: config.output.publicPath,
  })
);

const credentialsPath = path.join(__dirname, 'credentials');

const options = {
  key: fs.readFileSync('./credentials/key.pem'),
  cert: fs.readFileSync('./credentials/cert.pem'),
};

// https
//   .createServer(options, app)
//   .listen(PORT, () => console.log(`server running on port ${PORT}`.info));

app.get('/', (req, res) => {
  return res.send('Heelo World');
});

const httpServer = http.createServer(app);

httpServer.listen(3000, () =>
  console.log(`server running at  http://localhost:${3000}`.info)
);

const httpsServer = https.createServer(options, app);
httpsServer.listen(5000, () =>
  console.log(`server running at  https://localhost:${5000}`.info)
);

// openssl req -newkey rsa:2048 -new -nodes -x509 -days 3650 -keyout key.pem -out cert.pem
// openssl pkcs12 -export -out certificate.pfx -inkey privateKey.key -in certificate.crt -certfile more.crt
