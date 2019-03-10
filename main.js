require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const webhookMiddleware = require('x-hub-signature').middleware;
const spawn = require('child_process').spawn;

const https = require('https');
const fs = require('fs');
const privateKey  = fs.readFileSync(process.env.PRIVATE_KEY, 'utf8');
const certificate = fs.readFileSync(process.env.CERTIFICATE, 'utf8');
const ca = fs.readFileSync(process.env.CA, 'utf8');
const credentials = { key: privateKey, cert: certificate, ca: ca };

const NAME = "personal-website-hook";
const PORT = 3000;
const SECRET = process.env.SECRET;

const app = express();
const httpsServer = https.createServer(credentials, app);

app.use(bodyParser.json({
  verify: webhookMiddleware.extractRawBody
}));
app.use(webhookMiddleware({
  algorithm: 'sha1',
  secret: SECRET,
  require: true
}));
app.use(function (err, req, res, next) {
  console.log("ERROR: " + err);
  res.status(500).send('Something went wrong!!');
});

app.post('/push', function(request, response){
  const updateProcess = spawn("./update.sh", { stdio: 'inherit' });
  response.status(200).send('OK');
});

httpsServer.listen(PORT, () => {
  console.log(NAME + " started! Listening on port: " + PORT);
});