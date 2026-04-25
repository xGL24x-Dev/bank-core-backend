require('dotenv').config()

module.exports = {
  PORT:        process.env.PORT || 3000,
  JWT_SECRET:  process.env.JWT_SECRET || 'nexofin_secret_key',
  DB_HOST:     process.env.DB_HOST || 'localhost',
  DB_PORT:     process.env.DB_PORT || 5432,
  DB_NAME:     process.env.DB_NAME || 'bank_core',
  DB_USER:     process.env.DB_USER || 'postgres',
  DB_PASSWORD: process.env.DB_PASSWORD || '',
}