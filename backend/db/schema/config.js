import 'dotenv/config'
import pg from 'pg'


const { Pool } = pg

const config = {
  connectionString: process.env.DB_URL
}

const pool = new Pool(config)
console.log(config)

export default pool