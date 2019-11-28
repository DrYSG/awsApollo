const { ApolloServer } =  require('apollo-server-azure-functions')
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
  context: ({ context, req }) => (
    {
      req,
      context
    })
})

module.exports = server.createHandler()

