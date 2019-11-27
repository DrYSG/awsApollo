const { gql } = require('apollo-server')
const { GraphQLDateTime } = require('graphql-iso-date')
const { DB } = require('./db.js/index.js.js')

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
    hello: (_, { reply }, context, info) => {
      console.log(`hello with reply ${reply}`)
      console.log(`context : ${JSON.stringify(context)}`)
      console.log(`info : ${JSON.stringify(info)}`)
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

exports.connect = async (where, setup) => {
  console.log(`value of DB: ${JSON.stringify(DB)}`)
  //await DB.dbSetup(where)             //BUG these lines cause Lambda to fail
  //await DB.populate()                 //BUG these lines cause Lambda to fail
  //let users = await DB.findAll()      //BUG these lines cause Lambda to fail
  //console.log(users)                  //BUG these lines cause Lambda to fail
  await setup(where)
}
