const { gql } = require('apollo-server')
const { GraphQLDateTime } = require('graphql-iso-date')
//const { DB } = require('./db.js')
const { Sequelize } = require('sequelize')
const { userData } = require('./userData')

const localHost = {
    db: 'm3_db',
    host: 'localhost',
    pass: 'yechezkal'
}
const awsHost = {
    db: 'apollodb',
    host: 'apollodb.cxeokcheapqj.us-east-2.rds.amazonaws.com',
    pass: 'yechezkal'
}

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

class PG {

    async dbSetup(where) {
        let host = (where == "local") ? localHost : awsHost
        console.log(`Host: ${JSON.stringify(host)}`)
        this.db = new Sequelize(host.db, 'postgres', host.pass, {
            host: host.host,
            dialect: 'postgres',
            logging: false,
            pool: {
                max: 5,
                min: 0,
                idle: 20000,
                handleDisconnects: true
            },
            dialectOptions: {
                requestTimeout: 100000
            },
            define: {
                freezeTableName: true
            }
        })
        this.User = this.db.define('users', {
            firstName: Sequelize.STRING,
            lastName: Sequelize.STRING,
            addressNumber: Sequelize.INTEGER,
            streetName: Sequelize.STRING,
            city: Sequelize.STRING,
            email: Sequelize.STRING,
        })
        try {
            await this.db.authenticate()
            console.log('Connected to DB')
        } catch (err) {
            console.error('Unable to connect to DB', err)
        }
    }

    async select(id) {
        let who = await this.User.findAll({ where: { id: id } })
        return who.get({ plain: true })
    }

    async findFirst(name) {
        let me = await this.User.findAll({ where: { firstName: name } })
        return me[0].get({ plain: true })
    }

    async addUser(user) {
        let me = await this.User.create(user)
        return me.get({ plain: true })
    }

    async  populate() {
        await this.db.sync({ force: true })
        try {
            await this.User.bulkCreate(userData, { validate: true })
            console.log('users created');
        } catch (err) {
            console.error('failed to create users')
            console.error(err)
        } finally {
        }
    }

    async findAll() {
        let users = await this.User.findAll({ raw: true })
        return users
    }

    async close() {
        this.db.close()
    }
}

const DB = new PG()

exports.connect = async (where, setup) => {
  console.log(`value of DB: ${JSON.stringify(DB)}`)
  await DB.dbSetup(where)             //BUG these lines cause Lambda to fail
  await DB.populate()                 //BUG these lines cause Lambda to fail
  let users = await DB.findAll()      //BUG these lines cause Lambda to fail
  console.log(users)                  //BUG these lines cause Lambda to fail
  await setup(where)
}