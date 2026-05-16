const bcrypt = require('bcrypt')
const jwt    = require('jsonwebtoken')
const pool   = require('../../config/db')
const { JWT_SECRET } = require('../../config/env')

const authService = {
  async register({ name, email, password }) {
    // Verificar si el correo ya existe
    const existing = await pool.query(
      'SELECT id_empleado FROM empleado WHERE correo = $1',
      [email]
    )
    if (existing.rows.length > 0) {
      const err = new Error('El correo ya está registrado')
      err.status = 409
      throw err
    }

    const hashedPassword = await bcrypt.hash(password, 10)

    // Separar nombre y apellido
    const parts    = name.trim().split(' ')
    const nombre   = parts[0] || name
    const apellido = parts.slice(1).join(' ') || ''

    const result = await pool.query(
      `INSERT INTO empleado (nombre, apellido, usuario, pass, correo, cargo)
       VALUES ($1, $2, $3, $4, $5, 'client')
       RETURNING id_empleado, nombre, apellido, correo, cargo`,
      [nombre, apellido, email, hashedPassword, email]
    )

    return {
      id:    result.rows[0].id_empleado,
      name:  `${result.rows[0].nombre} ${result.rows[0].apellido}`,
      email: result.rows[0].correo,
      role:  result.rows[0].cargo,
    }
  },

  async login({ email, password }) {
    const result = await pool.query(
      'SELECT * FROM empleado WHERE correo = $1',
      [email]
    )
    if (result.rows.length === 0) {
      const err = new Error('Credenciales incorrectas')
      err.status = 401
      throw err
    }

    const user = result.rows[0]

    const validPassword = await bcrypt.compare(password, user.pass)
    if (!validPassword) {
      const err = new Error('Credenciales incorrectas')
      err.status = 401
      throw err
    }

    const token = jwt.sign(
      {
        id:    user.id_empleado,
        email: user.correo,
        role:  user.cargo,
        name:  `${user.nombre} ${user.apellido}`
      },
      JWT_SECRET,
      { expiresIn: '24h' }
    )

    return {
      token,
      user: {
        id:    user.id_empleado,
        name:  `${user.nombre} ${user.apellido}`,
        email: user.correo,
        role:  user.cargo,
      }
    }
  },

  async me(userId) {
    const result = await pool.query(
      `SELECT id_empleado, nombre, apellido, correo, cargo
       FROM empleado WHERE id_empleado = $1`,
      [userId]
    )
    if (result.rows.length === 0) {
      const err = new Error('Usuario no encontrado')
      err.status = 404
      throw err
    }
    const u = result.rows[0]
    return {
      id:    u.id_empleado,
      name:  `${u.nombre} ${u.apellido}`,
      email: u.correo,
      role:  u.cargo,
    }
  }
}

module.exports = authService