const express = require('express')
const router  = express.Router()
const authMiddleware = require('../../middlewares/auth.middleware')
const roleMiddleware = require('../../middlewares/role.middleware')

router.get('/', authMiddleware, roleMiddleware('admin'), (req, res) => {
  res.json({ success: true, message: 'Auditoría - próximamente', data: [] })
})

module.exports = router