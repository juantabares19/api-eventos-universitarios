const express = require('express');
const router = express.Router();
const { createInscripcion, getInscripcionesByUsuario } = require('../controllers/inscripciones.controller');

router.post('/', createInscripcion);
router.get('/:usuario_id', getInscripcionesByUsuario);

module.exports = router;