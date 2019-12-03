const { userData } = require('./userData')
const mongoose = require('mongoose')

const localHost = {
    db: 'users',
    user: 'users',
    host: 'localhost',
    port: '8081',
    pass: 'C2y6yDjf5/R+ob0N8A7Cgv30VRDJIWEHLM+4QDU5DE2nQ9nDuVTqobD4b8mGGyPMbIZnqyMsEcaGQy67XIw/Jw==',
    string: 'mongodb://localhost:C2y6yDjf5%2FR%2Bob0N8A7Cgv30VRDJIWEHLM%2B4QDU5DE2nQ9nDuVTqobD4b8mGGyPMbIZnqyMsEcaGQy67XIw%2FJw%3D%3D@localhost:10255/admin?ssl=true'
}

const azureHost = {
    db: 'users',
    user: 'ysgcosmos',
    host: 'ysgcosmos.mongo.cosmos.azure.com',
    port: '10255',
    pass: '09CHsNBBRc3lzJD2lAQNK80tbaHCtKrzklbMgDR3eMsaN3l2sPVd5vOOBh7FEaykjd8oRelKq0ct21DniCzlPg==',
    string: 'mongodb://ysgcosmos:09CHsNBBRc3lzJD2lAQNK80tbaHCtKrzklbMgDR3eMsaN3l2sPVd5vOOBh7FEaykjd8oRelKq0ct21DniCzlPg==@ysgcosmos.mongo.cosmos.azure.com:10255/?ssl=true&replicaSet=globaldb&maxIdleTimeMS=120000&appName=@ysgcosmos@'
}

class Cosmos {
    constructor(where) {
        this.conn = null
        this.db = null
        this.log = () => { }
        switch (where) {
            case 'local':
                this.conn = localHost; break;
            case 'azure':
                this.conn = azureHost; break;
        }
    }

    async connect(logger) {
        this.log = logger
        if (this.db !== null) return this.db
        else {
            await this.open()
            return this.db
        }
    }

    async open() {
        let host = this.conn
        this.log.info(`Host: ${JSON.stringify(host)}`)
        const where = `mongodb://${host.host}:${host.port}/${host.db}?ssl=true&replicaSet=globaldb`
        const options = {
            auth: {
                user: host.user,
                password: host.password
            }
        }
        try {
            await mongoose.connect(where, options)
            this.log.info('Connected to Cosmsos DB')
            this.db = mongoose
        } catch (err) {
            this.log.error('Unable to connect to DB', err)
        }
        this.users = mongoose.model('users', new mongoose.Schema({
            firstName: String,
            lastName: String,
            addressNumber: Int,
            streetName: String,
            city: String,
            email: String
        }))
    }

    async select(id, logger) {
        await this.connect(logger)
        let who = await this.users.findOne({ id: id } )
        await this.db.connection.close()
        return who
    }

    async findFirst(name, logger) {
        await this.connect(logger)
        this.log.info(`findFirst: ${name}`)
        let me = await this.users.findOne({ firstName: name })
        await this.db.connection.close()
        return me
    }

    async addUser(user, logger) {
        await this.connect(logger)
        const me = this.users(user)
        let me = await me.save()
        await this.db.connection.close()
        return user
    }

    async populate(logger) {
        await this.connect(logger)
        const user = this.users(userData[0])
        try {
            const result = await user.save()
            this.log.info('users created')
        } catch (err) {
            this.log.error(`failed to create users, err: ${err}`)
        } finally {
            this.db.connection.close()
        }
    }

    async findAll(logger) {
        await this.connect(logger)
        let users = await this.users.find()
        this.db.connection.close()
        return users
    }

    async close() {
        await this.db.close()
        this.db = null
    }
}

exports.DB = new Cosmos('azureHost')
