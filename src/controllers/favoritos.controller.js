const db = require('../../database/db');

// Agregar evento a favoritos
const addFavorito = (req, res) => {
  try {
    const { evento_id, usuario_id } = req.body;

    if (!evento_id || !usuario_id) {
      return res.status(400).json({ ok: false, message: 'Faltan campos obligatorios' });
    }

    // Verificar que el evento existe
    const evento = db.prepare('SELECT * FROM eventos WHERE id = ?').get(evento_id);
    if (!evento) {
      return res.status(404).json({ ok: false, message: 'Evento no encontrado' });
    }

    db.prepare(`
      INSERT OR IGNORE INTO favoritos (evento_id, usuario_id)
      VALUES (?, ?)
    `).run(evento_id, usuario_id);

    res.status(201).json({ ok: true, message: 'Agregado a favoritos' });
  } catch (error) {
    res.status(500).json({ ok: false, message: 'Error al agregar favorito' });
  }
};

// Eliminar evento de favoritos
const removeFavorito = (req, res) => {
  try {
    const { evento_id, usuario_id } = req.params;

    db.prepare(
      'DELETE FROM favoritos WHERE evento_id = ? AND usuario_id = ?'
    ).run(evento_id, usuario_id);

    res.json({ ok: true, message: 'Eliminado de favoritos' });
  } catch (error) {
    res.status(500).json({ ok: false, message: 'Error al eliminar favorito' });
  }
};

// Obtener favoritos de un usuario
const getFavoritosByUsuario = (req, res) => {
  try {
    const { usuario_id } = req.params;

    const favoritos = db.prepare(`
      SELECT f.*, e.titulo, e.fecha, e.hora, e.lugar, e.categoria, e.imagen_url
      FROM favoritos f
      JOIN eventos e ON f.evento_id = e.id
      WHERE f.usuario_id = ?
      ORDER BY f.created_at DESC
    `).all(usuario_id);

    res.json({ ok: true, data: favoritos });
  } catch (error) {
    res.status(500).json({ ok: false, message: 'Error al obtener favoritos' });
  }
};

module.exports = { addFavorito, removeFavorito, getFavoritosByUsuario };