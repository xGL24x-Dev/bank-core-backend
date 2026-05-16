const express           = require('express')
const router            = express.Router()
const accountController = require('./account.controller')
const authMiddleware    = require('../../middlewares/auth.middleware')
const roleMiddleware    = require('../../middlewares/role.middleware')
const pool              = require('../../config/db')

router.get('/',  authMiddleware, accountController.getMyAccounts)
router.post('/', authMiddleware, accountController.createAccount)

// Admin — ver todas las cuentas
router.get('/all', authMiddleware, roleMiddleware('admin'), async (req, res, next) => {
  try {
    const result = await pool.query(
      `SELECT c.*, cl.nombre, cl.apellido
       FROM cuenta c
       JOIN cliente cl ON c.id_cliente = cl.id_cliente
       ORDER BY c.fecha_apertura DESC`
    )
    res.json({ success: true, data: result.rows })
  } catch (err) { next(err) }
})

// Admin — agregar saldo
router.post('/add-saldo', authMiddleware, roleMiddleware('admin'), async (req, res, next) => {
  try {
    const { id_cuenta, monto, descripcion } = req.body
    if (!id_cuenta || !monto || monto <= 0) {
      return res.status(400).json({ success: false, message: 'Datos inválidos' })
    }
    await pool.query(`UPDATE cuenta SET saldo = saldo + $1 WHERE id_cuenta = $2`, [monto, id_cuenta])
    await pool.query(
      `INSERT INTO transaccion (id_cuenta, tipo, monto, descripcion) VALUES ($1, 'deposito', $2, $3)`,
      [id_cuenta, monto, descripcion || 'Depósito administrativo']
    )
    res.json({ success: true, message: 'Saldo acreditado correctamente' })
  } catch (err) { next(err) }
})

module.exports = router