import pg from 'pg'

const {Client, Pool} = pg

const hostname = process.env["NODE_ENV"] == 'test' ? 'localhost' : process.env["POSTGRES_HOSTNAME"]

const clientConfig = {
    user: process.env["POSTGRES_USER"],
    password:process.env["POSTGRES_PASSWORD"],
    host: hostname,
    port:process.env["POSTGRES_PORT"],
    database:process.env["POSTGRES_DATABASE"],
}

const poolConfig = {
    user:process.env["POSTGRES_USER"],
    password:process.env["POSTGRES_PASSWORD"],
    host: hostname,
    port:process.env["POSTGRES_PORT"],
    database:process.env["POSTGRESDATABASER"],
}

//@ts-ignore
const pool = new Pool(poolConfig)
//@ts-ignore
const client = new Client(clientConfig)

export {pool,client}