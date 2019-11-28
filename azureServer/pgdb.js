
const { Client } = require('pg')

const azure = {
    user: "postgres@postdb",
    host: "postdb.postgres.database.azure.com",
    database: "postgres",
    password: "Yechezkal1",
    port: 5432,
    ssl: true
}

const handler = async (context, req) => {
    const c = azure // switch to local for localDB
    context.log(`azure credentials: ${JSON.stringify(c)}`)
    const client = new Client({
        user: c.user,
        host: c.host,
        database: c.database,
        password: c.password,
        port: c.port
    })
    try {
        context.log("Awaiting for DB connection")
        await client.connect();
        context.log(`DB connected`)
    } catch (err) {
        context.error(`DB Connect Failed: ${JSON.stringify(err)}`)
        context.res = {
            status: 400,
            body: err
        }
        return context.res
    }
    const rest = {}
    try {
        res = await client.query('SELECT NOW()')
    } catch (err) {
        context.log('Database ' + err)
        context.res = {
            status: 400,
            body: err
        }
        return context.res
    }
    return {
        body: res.rows[0].now
    }
}

module.exports = handler