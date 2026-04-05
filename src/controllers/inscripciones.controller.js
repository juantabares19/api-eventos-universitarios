const pool = require('../../database/db');

const createInscripcion = async (req, res) => {
  try {
    const { evento_id, usuario_id, usuario_nombre, usuario_correo } = req.body;

    if (!evento_id || !usuario_id || !usuario_nombre || !usuario_correo) {
      return res.status(400).json({ ok: false, message: 'Faltan campos obligatorios' });
    }

    const evento = await pool.query('SELECT * FROM eventos WHERE id = $1', [evento_id]);
    if (evento.rows.length === 0) {
      return res.status(404).json({ ok: false, message: 'Evento no encontrado' });
    }

    if (evento.rows[0].cupos_disponibles <= 0) {
      return res.status(400).json({ ok: false, message: 'No hay cupos disponibles' });
    }

    const yaInscrito = await pool.query(
      'SELECT * FROM inscripciones WHERE evento_id = $1 AND usuario_id = $2',
      [evento_id, usuario_id]
    );
    if (yaInscrito.rows.length > 0) {
      return res.status(400).json({ ok: false, message: 'Ya estás inscrito en este evento' });
    }

    await pool.query(
      'INSERT INTO inscripciones (evento_id, usuario_id, usuario_nombre, usuario_correo) VALUES ($1, $2, $3, $4)',
      [evento_id, usuario_id, usuario_nombre, usuario_correo]
    );

    await pool.query(
      'UPDATE eventos SET cupos_disponibles = cupos_disponibles - 1 WHERE id = $1',
      [evento_id]
    );

    res.status(201).json({ ok: true, message: 'Inscripción exitosa' });
  } catch (error) {
    res.status(500).json({ ok: false, message: 'Error al inscribirse' });
  }
};

const getInscripcionesByUsuario = async (req, res) => {
  try {
    const { usuario_id } = req.params;

    const result = await pool.query(
      `SELECT i.*, e.titulo, e.fecha, e.hora, e.lugar, e.categoria
       FROM inscripciones i
       JOIN eventos e ON i.evento_id = e.id
       WHERE i.usuario_id = $1
       ORDER BY i.fecha_inscripcion DESC`,
      [usuario_id]
    );

    res.json({ ok: true, data: result.rows });
  } catch (error) {
    res.status(500).json({ ok: false, message: 'Error al obtener inscripciones' });
  }
};

const cancelarInscripcion = async (req, res) => {
  try {
    const { evento_id, usuario_id } = req.params;

    const inscripcion = await pool.query(
      'SELECT * FROM inscripciones WHERE evento_id = $1 AND usuario_id = $2',
      [evento_id, usuario_id]
    );
    if (inscripcion.rows.length === 0) {
      return res.status(404).json({ ok: false, message: 'Inscripción no encontrada' });
    }

    await pool.query(
      'DELETE FROM inscripciones WHERE evento_id = $1 AND usuario_id = $2',
      [evento_id, usuario_id]
    );

    await pool.query(
      'UPDATE eventos SET cupos_disponibles = cupos_disponibles + 1 WHERE id = $1',
      [evento_id]
    );

    res.json({ ok: true, message: 'Inscripción cancelada exitosamente' });
  } catch (error) {
    res.status(500).json({ ok: false, message: 'Error al cancelar inscripción' });
  }
};

module.exports = { createInscripcion, getInscripcionesByUsuario, cancelarInscripcion };