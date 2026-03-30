const express = require('express')
const router  = express.Router()
const authMiddleware = require('../../middlewares/auth.middleware')

router.get('/', authMiddleware, (req, res) => {
  res.json({ success: true, message: 'Cuentas - próximamente', data: [] })
})

module.exports = router