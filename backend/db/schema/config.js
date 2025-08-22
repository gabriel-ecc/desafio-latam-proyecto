import pg from 'pg'
process.loadEnvFile()

const { DB_HOST, DB_USER, DB_PASSWORD, DB_DATABASE, DB_PORT } = process.env
const isProduction = process.env.NODE_ENV === 'production'

// Detect if running in Azure Functions and configure SSL accordingly
const isAzure = !!process.env.WEBSITE_SITE_NAME;
const sslConfig = isAzure ? { rejectUnauthorized: false } : false;

/*
console.log('DEBUG: DB_HOST: ', DB_HOST)
console.log('DEBUG: DB_USER: ', DB_USER)
console.log('DEBUG: DB_PASSWORD: ', DB_PASSWORD)
console.log('DEBUG: DB_DATABASE: ', DB_DATABASE)
console.log('DEBUG: DB_PORT: ', DB_PORT)
console.log('DEBUG: isAzure: ', isAzure)
*/

const pool = new pg.Pool({
  host: DB_HOST,
  user: DB_USER,
  password: DB_PASSWORD,
  database: DB_DATABASE,
  port: DB_PORT,
  ssl: sslConfig,
  allowExitOnIdle: true,
  // Configuración para UTF-8
  client_encoding: 'UTF8'
})

pool.query('SELECT NOW()', (err, res) => {
  if (err) {
    console.log('Error connecting to DB', err)
  } else {
    console.log('DB Connected', res.rows[0])
  }
})

export default pool