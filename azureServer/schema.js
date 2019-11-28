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
    findUser: async (_, { firstName }, conText) => {
      let who = await DB.findFirst(firstName, conText.context)
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
    addUser: async (_, args, conText) => {
      let who = await DB.addUser(args.user)
      return who
    },
    populate: async (_, __, conText) => {
      await DB.populate(conText.context)
      return 'done'
    }
  }
}
