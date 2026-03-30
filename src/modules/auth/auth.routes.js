const express = require('express')
const router  = express.Router()
const authController = require('./auth.controller')
const validate       = require('../../middlewares/validate.middleware')
const authMiddleware = require('../../middlewares/auth.middleware')
const { loginSchema, registerSchema } = require('./auth.schema')

router.post('/register', validate(registerSchema), authController.register)
router.post('/login',    validate(loginSchema),    authController.login)
router.post('/logout',   authMiddleware,            authController.logout)
router.get('/me',        authMiddleware,            authController.me)

module.exports = router