const { ApolloServer } = require('apollo-server')
const { DB } = require('./db.js')
const { ApolloServer: ApolloServerLambda } = require('apollo-server-lambda')
const { typeDefs, resolvers } = require('./schema.js')

// The ApolloServer constructor requires two parameters: your schema
// definition and your set of resolvers.

async function setup(where) {
  if (where == 'local') {
    const server = new ApolloServer({ typeDefs, resolvers })
    let { url } = await server.listen()
    console.log(`Server ready at ${url}`)
  } else {
    let users = await DB.findAll()
    console.log(users)
    const server = new ApolloServerLambda({ typeDefs, resolvers })
    exports.graphqlHandler = server.createHandler({
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
  }
}

async function connect(where) {
  await DB.dbSetup(where)
  await DB.populate()
  let users = await DB.findAll()
  console.log(users)
  setup(where)
}

global.DB = DB
let location = (process.env.USERNAME == 'ysg4206') ? 'local' : 'aws'
connect(location)

