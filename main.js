require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const webhookMiddleware = require('x-hub-signature').middleware;
const exec = require('child_process').exec;

const NAME = "personal-website-hook";
const PORT = 3000;
const SECRET = process.env.SECRET;

const app = express();

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
  const payload = request.body;
  response.status(200).send('OK');
});

app.listen(PORT, () => {
  console.log(NAME + " started! Listening on port: " + PORT);
});