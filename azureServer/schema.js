const { gql } = require('apollo-server-azure-functions')
const { GraphQLDateTime } = require('graphql-iso-date')
//const { DB } = require('./cosmosDB.js')
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
    users: (_, __, context) => DB.findAll(context.context.log),
    findUser: async (_, { firstName }, context) => {
      let who = await DB.findFirst(firstName, context.context.log)
      return who
    },
    hello: (_, { reply }, context, info) => {
      const logger = context.context.log
      logger.info(`hello with reply ${reply}`)
      logger.info(`context : ${JSON.stringify(context)}`)
      logger.info(`info : ${JSON.stringify(info)}`)
      return reply
    }
  },
  Mutation: {
    addUser: async (_, args, context) => {
      let who = await DB.addUser(args.user, context.context.log)
      return who
    },
    populate: async (_, __, context) => {
      await DB.populate(context.context.log)
      return 'done'
    }
  }
}
