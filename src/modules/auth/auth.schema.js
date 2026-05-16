const { z } = require('zod')

const loginSchema = z.object({
  email:    z.string().email('Correo inválido'),
  password: z.string().min(6, 'Mínimo 6 caracteres'),
})

const registerSchema = z.object({
  name:     z.string().min(2, 'El nombre es requerido'),
  email:    z.string().email('Correo inválido'),
  password: z.string()
              .min(8, 'Mínimo 8 caracteres')
              .regex(/(?=.*[A-Z])/, 'Necesita al menos una mayúscula')
              .regex(/(?=.*[0-9])/, 'Necesita al menos un número'),
})

module.exports = { loginSchema, registerSchema }