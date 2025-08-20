import pg from 'pg'
import 'dotenv/config'

const { Pool } = pg

const { DB_URL } = process.env

const config = {
  connectionString: DB_URL
}

const pool = new Pool(config)
console.log(config)

const db = (query, values) => pool
  .query(query, values)
  .then(({ rows }) => rows)
  .catch(({ code, message }) => {
    const error = { status: false, code, message }
    throw error
  })

export default pool
