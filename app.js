const express = require("express");
const bodyParser = require("body-parser");
const graphqlHttp = require("express-graphql");

const mongoose = require('mongoose');

const schemaDefinition = require('./graphql/schema/index');
const resolvers = require('./graphql/resolvers/index');
const isAuth = require('./middleware/is-auth');

const app = express();

app.use(bodyParser.json());

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST,GET,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  if (req.method === 'OPTIONS') {
    res.setHeader('Access-Control-Max-Age', '600');
    return res.sendStatus(200);
  }
  next();
});

app.use(isAuth);

app.use((req, res, next) => {
    const start = Date.now();
    res.on('finish', () => {
      const duration = Date.now() - start;
      console.log(`${duration} ms`);
    });
    next();
  })
  .use(
    "/api",
    graphqlHttp({
      schema: schemaDefinition,
      rootValue: resolvers,
      graphiql: true
    })
  );

mongoose.connect(`mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@cluster0-w90yh.mongodb.net/${process.env.MONGO_DB}?retryWrites=true`)
  .then(() => {
    app.listen(8000);
  }).catch(err => {
    console.log(err);
  })