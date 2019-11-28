const { gql } = require('apollo-server-azure-functions')
const { GraphQLDateTime } = require('graphql-iso-date')
const { DB } = require('./db.js')

exports.typeDefs = gql`
  scalar DateTime

  type User {
    id: Int
    "English First Name"
    firstName: String
    lastName: String
    addressNumber: Int
    streetName: String
    city: String
    email: String
    createdAt: DateTime
    updatedAt: DateTime
  }

  input UserType {
    "Hebrew First Name"
    firstName: String
    lastName: String
    addressNumber: Int
    streetName: String
    city: String
    email: String
  }

  type Query {
    users: [User]
    findUser(firstName: String): User
    hello(reply: String): String
  }

  type Mutation {
    addUser(user: UserType): User!
    populate: String
  }

  type Subscription {
    newUser: User!
  }
`

exports.resolvers = {
  Query: {
    users: () => DB.findAll(),
    findUser: async (_, { firstName }) => {
      let who = await DB.findFirst(firstName)
      return who
    },
    hello: (_, { reply }, conText, info) => {
      conText.context.log(`hello with reply ${reply}`)
      conText.context.log(`context : ${JSON.stringify(conText.context)}`)
      conText.context.log(`info : ${JSON.stringify(info)}`)
      return reply
    }
  },
  Mutation: {
    addUser: async (_, args) => {
      let who = await DB.addUser(args.user)
      return who
    },
    populate: async () => {
      await DB.populate()
      return 'done'
    }
  }
}
