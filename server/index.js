const express = require('express');
const graphqlServer = require('./graphql');

const app = express();

graphqlServer.applyMiddleware({app});

app.listen({ port: 4000 }, () =>
  console.log(`🚀 Server ready at http://localhost:4000${graphqlServer.graphqlPath}`)
);
