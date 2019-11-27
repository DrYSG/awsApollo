const { ApolloServer, gql } = require('apollo-server-azure-functions')

// Construct a schema, using GraphQL schema language
const typeDefs = gql`
  type Query {
    hello(who: String): String
  }
`

// Provide resolver functions for your schema fields
const resolvers = {
  Query: {
    hello: (parent, { who }, context, info) => {
      return (`Azure welcomes: ${who}`)
    },
  }
}

const server = new ApolloServer({ typeDefs, resolvers })

module.exports = server.createHandler()