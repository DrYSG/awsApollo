import { gql } from 'apollo-server'
import DB from './db'
import { GraphQLDateTime } from 'graphql-iso-date'

export const typeDefs = gql`
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
  }

  type Subscription {
    newUser: User!
  }
`

export const resolvers = {
  Query: {
    // users: async () => {
    //   let users = await DB.findAll()
    //   return users
    // },
    users: () => DB.findAll(),
    findUser: async (_, { firstName }) => {
      let who = await DB.findFirst(firstName)
      return who
    },
    hello: (_, {reply}) => {
      return reply
    }
  },
  Mutation: {
    addUser: async (_, args) => {
      let who = await DB.addUser(args.user)
      return who
    }
  }
}

export async function connect() {
  await DB.dbSetup()
  await DB.populate()
  let users = await DB.findAll()
  console.log(users)
}
