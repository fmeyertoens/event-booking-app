const express = require("express");
const bodyParser = require("body-parser");
const graphqlHttp = require("express-graphql");

const mongoose = require('mongoose');

const schemaDefinition = require('./graphql/schema/index');
const resolvers = require('./graphql/resolvers/index');

const app = express();

app.use(bodyParser.json());


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
    app.listen(3000);
  }).catch(err => {
    console.log(err);
  })