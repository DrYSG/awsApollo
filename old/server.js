const { ApolloServer } = require('apollo-server')
const { ApolloServer: ApolloServerLambda } = require('apollo-server-lambda')
const { typeDefs, resolvers, connect } = require('./schema.js.js')

// The ApolloServer constructor requires two parameters: your schema
// definition and your set of resolvers.

async function setup(where) {
  if (where == 'local') {
    const server = new ApolloServer({ typeDefs, resolvers })
    let { url } = await server.listen()
    console.log(`Server ready at ${url}`)
  } else {
    const server = new ApolloServerLambda({ 
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
    exports.graphqlHandler = server.createHandler()
  }
}

let location = (process.env.USERNAME == 'ysg4206') ? 'local' : 'aws'
connect(location, setup)

