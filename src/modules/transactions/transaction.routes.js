const express = require('express')
const router  = express.Router()
const authMiddleware = require('../../middlewares/auth.middleware')

router.get('/', authMiddleware, (req, res) => {
  res.json({ success: true, message: 'Transacciones - próximamente', data: [] })
})

module.exports = router