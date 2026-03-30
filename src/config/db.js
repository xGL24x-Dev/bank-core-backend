const { Pool } = require('pg')
const env = require('./env')

const pool = new Pool({
  host:     env.DB_HOST,
  port:     env.DB_PORT,
  database: env.DB_NAME,
  user:     env.DB_USER,
  password: env.DB_PASSWORD,
})

pool.on('connect', () => console.log('✅ Conectado a PostgreSQL'))
pool.on('error', (err) => console.error('❌ Error PostgreSQL:', err.message))

module.exports = pool