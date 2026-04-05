const pool = require('../../database/db');

const addFavorito = async (req, res) => {
  try {
    const { evento_id, usuario_id } = req.body;

    if (!evento_id || !usuario_id) {
      return res.status(400).json({ ok: false, message: 'Faltan campos obligatorios' });
    }

    const evento = await pool.query('SELECT * FROM eventos WHERE id = $1', [evento_id]);
    if (evento.rows.length === 0) {
      return res.status(404).json({ ok: false, message: 'Evento no encontrado' });
    }

    await pool.query(
      'INSERT INTO favoritos (evento_id, usuario_id) VALUES ($1, $2) ON CONFLICT (evento_id, usuario_id) DO NOTHING',
      [evento_id, usuario_id]
    );

    res.status(201).json({ ok: true, message: 'Agregado a favoritos' });
  } catch (error) {
    res.status(500).json({ ok: false, message: 'Error al agregar favorito' });
  }
};

const removeFavorito = async (req, res) => {
  try {
    const { evento_id, usuario_id } = req.params;

    await pool.query(
      'DELETE FROM favoritos WHERE evento_id = $1 AND usuario_id = $2',
      [evento_id, usuario_id]
    );

    res.json({ ok: true, message: 'Eliminado de favoritos' });
  } catch (error) {
    res.status(500).json({ ok: false, message: 'Error al eliminar favorito' });
  }
};

const getFavoritosByUsuario = async (req, res) => {
  try {
    const { usuario_id } = req.params;

    const result = await pool.query(
      `SELECT f.*, e.titulo, e.fecha, e.hora, e.lugar, e.categoria, e.imagen_url
       FROM favoritos f
       JOIN eventos e ON f.evento_id = e.id
       WHERE f.usuario_id = $1
       ORDER BY f.created_at DESC`,
      [usuario_id]
    );

    res.json({ ok: true, data: result.rows });
  } catch (error) {
    res.status(500).json({ ok: false, message: 'Error al obtener favoritos' });
  }
};

module.exports = { addFavorito, removeFavorito, getFavoritosByUsuario };