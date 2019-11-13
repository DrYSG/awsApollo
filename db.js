const { Sequelize } = require('sequelize')
const { userData } = require('./userData')

class DB {
    constructor() {
        this.db = new Sequelize('m3_db', 'postgres', 'yechezkal', { dialect: 'postgres', logging: false })
        this.User = this.db.define('users', {
            firstName: Sequelize.STRING,
            lastName: Sequelize.STRING,
            addressNumber: Sequelize.INTEGER,
            streetName: Sequelize.STRING,
            city: Sequelize.STRING,
            email: Sequelize.STRING,
        })
    }

    async dbSetup() {
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

exports.DB = new DB()
