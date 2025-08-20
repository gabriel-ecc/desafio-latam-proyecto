import pg from 'pg'
import 'dotenv/config'

const { Pool } = pg

const { DATABASE_URL } = process.env

const config = {
  connectionString: DATABASE_URL,
  allowExitOnIdle: true
}

const pool = new Pool(config)

pool.query('SELECT NOW()')
  .then(res => {
    console.log('DB Connected', res.rows[0])
  })
  .catch(err => {
    console.log('Error connecting to DB', err)
  })

export default pool
