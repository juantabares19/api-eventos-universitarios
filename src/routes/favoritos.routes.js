const express = require('express');
const router = express.Router();
const { addFavorito, removeFavorito, getFavoritosByUsuario } = require('../controllers/favoritos.controller');

router.post('/', addFavorito);
router.delete('/:evento_id/:usuario_id', removeFavorito);
router.get('/:usuario_id', getFavoritosByUsuario);

module.exports = router;