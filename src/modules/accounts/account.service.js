const pool = require('../../config/db')

const accountService = {

  async getOrCreateCliente(userId) {
    const emp = await pool.query(
      'SELECT * FROM empleado WHERE id_empleado = $1', [userId]
    )
    const user = emp.rows[0]

    const existing = await pool.query(
      'SELECT id_cliente FROM cliente WHERE nombre = $1 AND apellido = $2',
      [user.nombre, user.apellido]
    )

    if (existing.rows.length > 0) {
      return existing.rows[0].id_cliente
    }

    const newCliente = await pool.query(
      `INSERT INTO cliente (nombre, apellido, documento, direccion, telefono)
       VALUES ($1, $2, 0, 'Sin dirección', 0)
       RETURNING id_cliente`,
      [user.nombre, user.apellido]
    )
    return newCliente.rows[0].id_cliente
  },

  async getByUser(userId) {
    const id_cliente = await this.getOrCreateCliente(userId)
    const result = await pool.query(
      `SELECT * FROM cuenta WHERE id_cliente = $1 ORDER BY fecha_apertura DESC`,
      [id_cliente]
    )
    return result.rows
  },

  async create(userId, { tipo_cuenta }) {
    const id_cliente = await this.getOrCreateCliente(userId)

    // Verificar si ya tiene cuenta
    const existing = await pool.query(
      `SELECT id_cuenta FROM cuenta WHERE id_cliente = $1`,
      [id_cliente]
    )
    if (existing.rows.length > 0) {
      const err = new Error('Ya tienes una cuenta bancaria activa')
      err.status = 409
      throw err
    }

    const numero_cuenta = 'NF' + Date.now().toString().slice(-10)
    const result = await pool.query(
      `INSERT INTO cuenta (id_cliente, numero_cuenta, tipo_cuenta, saldo, estado)
       VALUES ($1, $2, $3, 0.00, 'activa')
       RETURNING *`,
      [id_cliente, numero_cuenta, tipo_cuenta || 'ahorros']
    )
    return result.rows[0]
  },

  async getById(id) {
    const result = await pool.query(
      `SELECT * FROM cuenta WHERE id_cuenta = $1`,
      [id]
    )
    return result.rows[0]
  },

  async getTotalBalance(userId) {
    const id_cliente = await this.getOrCreateCliente(userId)
    const result = await pool.query(
      `SELECT COALESCE(SUM(saldo), 0) as total FROM cuenta WHERE id_cliente = $1 AND estado = 'activa'`,
      [id_cliente]
    )
    return result.rows[0].total
  }
}

module.exports = accountService