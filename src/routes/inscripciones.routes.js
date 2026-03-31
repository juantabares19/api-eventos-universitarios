const express = require('express');
const router = express.Router();
const { createInscripcion, getInscripcionesByUsuario, cancelarInscripcion } = require('../controllers/inscripciones.controller');

router.post('/', createInscripcion);
router.get('/:usuario_id', getInscripcionesByUsuario);
router.delete('/:evento_id/:usuario_id', cancelarInscripcion);

module.exports = router;