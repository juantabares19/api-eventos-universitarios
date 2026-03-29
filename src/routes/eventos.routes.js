const express = require('express');
const router = express.Router();
const { getEventos, getEventoById, createEvento } = require('../controllers/eventos.controller');

router.get('/', getEventos);
router.get('/:id', getEventoById);
router.post('/', createEvento);

module.exports = router;