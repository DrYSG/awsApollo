const { ApolloServer } = require('apollo-server-lambda')
const { typeDefs, resolvers } = require('./schema.js')

const server = new ApolloServer({
  typeDefs,
  resolvers,
  playground: true,
  introspection: true,
  cors: {
    origin: '*',
    credentials: true,
  },
  context: ({ event, context }) => (
    {
      headers: event.headers,
      functionName: context.functionName,
      event,
      context
    })
})
exports.handler = server.createHandler()


