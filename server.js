const { ApolloServer } = require('apollo-server')
const { ApolloServer: ApolloServerLambda } = require('apollo-server-lambda')
const { typeDefs, resolvers, connect } = require('./schema.js')

// The ApolloServer constructor requires two parameters: your schema
// definition and your set of resolvers.

async function setup(server) {
  let { url } = await server.listen()
  console.log(`🚀  Server ready at ${url}`)
  await connect("local")
}

async function awsSetup() {
  await connect("aws")
}

if (process.env.USERNAME == 'ysg4206') {
  const server = new ApolloServer({ typeDefs, resolvers })
  setup(server)
} else {
  const server = new ApolloServerLambda({ typeDefs, resolvers })
  awsSetup()
  exports.graphqlHandler = server.createHandler()
}
