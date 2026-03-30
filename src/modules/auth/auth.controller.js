const authService = require('./auth.service')

const authController = {
  async register(req, res, next) {
    try {
      const user = await authService.register(req.body)
      res.status(201).json({
        success: true,
        message: 'Cuenta creada exitosamente',
        data: user
      })
    } catch (err) { next(err) }
  },

  async login(req, res, next) {
    try {
      const { token, user } = await authService.login(req.body)
      res.json({
        success: true,
        message: 'Inicio de sesión exitoso',
        data: { token, user }
      })
    } catch (err) { next(err) }
  },

  async me(req, res, next) {
    try {
      const user = await authService.me(req.user.id)
      res.json({ success: true, data: user })
    } catch (err) { next(err) }
  },

  async logout(req, res) {
    res.json({ success: true, message: 'Sesión cerrada' })
  }
}

module.exports = authController