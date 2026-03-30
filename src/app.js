const express = require('express')
const cors    = require('cors')
const errorHandler = require('./middlewares/errorHandler')

const authRoutes        = require('./modules/auth/auth.routes')
const userRoutes        = require('./modules/users/user.routes')
const accountRoutes     = require('./modules/accounts/account.routes')
const transactionRoutes = require('./modules/transactions/transaction.routes')
const loanRoutes        = require('./modules/loans/loan.routes')
const auditRoutes       = require('./modules/audit/audit.routes')

const app = express()

app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:3001'],
  credentials: true,
}))
app.use(express.json())

app.use('/api/v1/auth',         authRoutes)
app.use('/api/v1/users',        userRoutes)
app.use('/api/v1/accounts',     accountRoutes)
app.use('/api/v1/transactions', transactionRoutes)
app.use('/api/v1/loans',        loanRoutes)
app.use('/api/v1/audit',        auditRoutes)

app.get('/api/v1/health', (req, res) => {
  res.json({ status: 'ok', message: 'NexoFin API funcionando' })
})

app.use(errorHandler)

module.exports = app