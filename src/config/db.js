require('dotenv').config({ path: require('path').resolve(__dirname, '../../.env') });
const express = require('express');
const { Pool } = require('pg');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

// Configuración de la conexión a DigitalOcean
const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
  ssl: { rejectUnauthorized: false } // Esto es obligatorio para que DigitalOcean no te rebote
});

// Ruta de prueba
app.get('/test-db', async (req, res) => {
  try {
    const resDb = await pool.query('SELECT NOW()');
    res.json({ status: 'Conexión exitosa', serverTime: resDb.rows[0] });
  } catch (err) {
    res.status(500).json({ error: 'Error de conexión', detalle: err.message });
  }
});
app.get('/api/menu', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM productos WHERE activo = true');
        res.json(result.rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});