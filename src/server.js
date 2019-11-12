import { ApolloServer, gql } from 'apollo-server-lambda'
import { ApolloServer as ApolloLocal } from 'apollo-server'

// Construct a schema, using GraphQL schema language
const typeDefs = gql`
  type Query {
    hello: String
  }
`;

// Provide resolver functions for your schema fields
const resolvers = {
  Query: {
    hello: () => 'Hello world!',
  },
};

const server = new ApolloServer({ typeDefs, resolvers });

const localServer = new ApolloLocal({ typeDefs, resolvers });
async function setup() {
  let { url } = await localServer.listen()
  console.log(`🚀  Server ready at ${url}`)
  await connect()
}

setup()

exports.graphqlHandler = server.createHandler()