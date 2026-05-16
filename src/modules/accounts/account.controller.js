const accountService = require('./account.service')

const accountController = {
  async getMyAccounts(req, res, next) {
    try {
      const accounts = await accountService.getByUser(req.user.id)
      const total    = await accountService.getTotalBalance(req.user.id)
      res.json({ success: true, data: { accounts, total } })
    } catch (err) { next(err) }
  },

  async createAccount(req, res, next) {
    try {
      const account = await accountService.create(req.user.id, req.body)
      res.status(201).json({ success: true, message: 'Cuenta creada exitosamente', data: account })
    } catch (err) { next(err) }
  },
}

module.exports = accountController