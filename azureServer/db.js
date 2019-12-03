const { Sequelize } = require('sequelize')
const { userData } = require('./userData')

const localHost = {
    db: 'm3_db',
    user: 'postgres',
    host: 'localhost',
    pass: 'yechezkal'
}
const awsHost = {
    db: 'apollodb',
    user: 'postgres',
    host: 'apollodb.cxeokcheapqj.us-east-2.rds.amazonaws.com',
    pass: 'yechezkal'
}

const azureHost = {
    db: 'postgres',
    user: 'postgres@postdb',
    host: 'postdb.postgres.database.azure.com',
    pass: 'Yechezkal1'
}

class DB {
    constructor(where) {
        this.conn = null
        this.db = null
        this.log = () => { }
        switch (where) {
            case 'local':
                this.conn = localHost; break;
            case 'aws':
                this.conn = awsHost; break;
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
        this.db = new Sequelize(host.db, host.user, host.pass, {
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
            this.log.info('Connected to DB')
        } catch (err) {
            this.log.error('Unable to connect to DB', err)
        }
    }

    async select(id, logger) {
        await this.connect(logger)
        let who = await this.User.findAll({ where: { id: id } })
        await this.close()
        return who.get({ plain: true })
    }

    async findFirst(name, logger) {
        await this.connect(logger)
        let me = await this.User.findAll({ where: { firstName: name } })
        this.log.info(`findFirst: ${name}`)
        await this.close()
        return me[0].get({ plain: true })
    }

    async addUser(user, logger) {
        await this.connect(logger)
        let me = await this.User.create(user)
        await this.close()
        return me.get({ plain: true })
    }

    async  populate(logger) {
        await this.connect(logger)
        await this.db.sync({ force: true })
        try {
            await this.User.bulkCreate(userData, { validate: true })
            this.log.info('users created')
        } catch (err) {
            this.log.error(`failed to create users, err: ${err}`)
        } finally {
            await this.close()
        }
    }

    async findAll(logger) {
        await this.connect(logger)
        let users = await this.User.findAll({ raw: true })
        await this.close()
        return users
    }

    async close() {
        await this.db.close()
        this.db = null
    }
}

exports.DB = new DB('azure')
