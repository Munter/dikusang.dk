const { ApolloServer } = require('apollo-server-lambda');
const { schema } = require('./schema');
const { resolvers } = require('./resolvers');

const server = new ApolloServer({
  typeDefs: schema,
  resolvers
});

console.log('server', Object.keys(server));

exports.handler = server.createHandler();


