const { ApolloServer } = require('apollo-server-lambda');
const { schema } = require('./schema');
const { resolvers } = require('./resolvers');

const server = new ApolloServer({
  typeDefs: schema,
  resolvers
});

exports.handler = server.createHandler();

exports.server = server;
