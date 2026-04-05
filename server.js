const express = require('express');
const cors = require('cors');
require('dotenv').config();

const eventosRoutes = require('./src/routes/eventos.routes');
const inscripcionesRoutes = require('./src/routes/inscripciones.routes');
const favoritosRoutes = require('./src/routes/favoritos.routes');
const authRoutes = require('./src/routes/auth.routes');

const app = express();
const PORT = process.env.PORT || 3000;

// Middlewares
app.use(cors());
app.use(express.json());

// Rutas
app.use('/api/eventos', eventosRoutes);
app.use('/api/inscripciones', inscripcionesRoutes);
app.use('/api/favoritos', favoritosRoutes);
app.use('/api/auth', authRoutes);

// Ruta de prueba
app.get('/', (req, res) => {
  res.json({ ok: true, message: 'API Eventos Universitarios funcionando' });
});

// Iniciar servidor
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Servidor corriendo en http://192.168.1.10:${PORT}`);
});