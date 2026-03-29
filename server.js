const express = require('express');
const cors = require('cors');
require('dotenv').config();

const eventosRoutes = require('./src/routes/eventos.routes');
const inscripcionesRoutes = require('./src/routes/inscripciones.routes');
const favoritosRoutes = require('./src/routes/favoritos.routes');

const app = express();
const PORT = process.env.PORT || 3000;

// Middlewares
app.use(cors());
app.use(express.json());

// Rutas
app.use('/api/eventos', eventosRoutes);
app.use('/api/inscripciones', inscripcionesRoutes);
app.use('/api/favoritos', favoritosRoutes);

// Ruta de prueba
app.get('/', (req, res) => {
  res.json({ ok: true, message: 'API Eventos Universitarios funcionando' });
});

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});