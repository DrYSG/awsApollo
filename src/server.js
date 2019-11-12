import { ApolloServer } from 'apollo-server'
import { ApolloServer as ApolloServerLambda } from 'apollo-server-lambda'
import { typeDefs, resolvers, connect } from './schema.js'

// The ApolloServer constructor requires two parameters: your schema
// definition and your set of resolvers.

async function setup(server) {
  let { url } = await server.listen()
  console.log(`🚀  Server ready at ${url}`)
  await connect()
}

if (process.env.USERNAME == 'ysg4206') {
  const server = new ApolloServer({ typeDefs, resolvers })
  setup(server)
} else {
  const server = new ApolloServerLambda(clone(typeDefs, resolvers))
  exports.graphqlHandler = server.createHandler()
}
