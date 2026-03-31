const db = require('../../database/db');

// Inscribir usuario a un evento
const createInscripcion = (req, res) => {
  try {
    const { evento_id, usuario_id, usuario_nombre, usuario_correo } = req.body;

    if (!evento_id || !usuario_id || !usuario_nombre || !usuario_correo) {
      return res.status(400).json({ ok: false, message: 'Faltan campos obligatorios' });
    }

    // Verificar que el evento existe
    const evento = db.prepare('SELECT * FROM eventos WHERE id = ?').get(evento_id);
    if (!evento) {
      return res.status(404).json({ ok: false, message: 'Evento no encontrado' });
    }

    // Verificar que hay cupos disponibles
    if (evento.cupos_disponibles <= 0) {
      return res.status(400).json({ ok: false, message: 'No hay cupos disponibles' });
    }

    // Verificar que el usuario no esté ya inscrito
    const yaInscrito = db.prepare(
      'SELECT * FROM inscripciones WHERE evento_id = ? AND usuario_id = ?'
    ).get(evento_id, usuario_id);

    if (yaInscrito) {
      return res.status(400).json({ ok: false, message: 'Ya estás inscrito en este evento' });
    }

    // Crear inscripción y reducir cupo
    db.prepare(`
      INSERT INTO inscripciones (evento_id, usuario_id, usuario_nombre, usuario_correo)
      VALUES (?, ?, ?, ?)
    `).run(evento_id, usuario_id, usuario_nombre, usuario_correo);

    db.prepare(
      'UPDATE eventos SET cupos_disponibles = cupos_disponibles - 1 WHERE id = ?'
    ).run(evento_id);

    res.status(201).json({ ok: true, message: 'Inscripción exitosa' });
  } catch (error) {
    res.status(500).json({ ok: false, message: 'Error al inscribirse' });
  }
};

// Obtener inscripciones de un usuario
const getInscripcionesByUsuario = (req, res) => {
  try {
    const { usuario_id } = req.params;

    const inscripciones = db.prepare(`
      SELECT i.*, e.titulo, e.fecha, e.hora, e.lugar, e.categoria
      FROM inscripciones i
      JOIN eventos e ON i.evento_id = e.id
      WHERE i.usuario_id = ?
      ORDER BY i.fecha_inscripcion DESC
    `).all(usuario_id);

    res.json({ ok: true, data: inscripciones });
  } catch (error) {
    res.status(500).json({ ok: false, message: 'Error al obtener inscripciones' });
  }
};

const cancelarInscripcion = (req, res) => {
  try {
    const { evento_id, usuario_id } = req.params;

    const inscripcion = db.prepare(
      'SELECT * FROM inscripciones WHERE evento_id = ? AND usuario_id = ?'
    ).get(evento_id, usuario_id);

    if (!inscripcion) {
      return res.status(404).json({ ok: false, message: 'Inscripción no encontrada' });
    }

    db.prepare(
      'DELETE FROM inscripciones WHERE evento_id = ? AND usuario_id = ?'
    ).run(evento_id, usuario_id);

    db.prepare(
      'UPDATE eventos SET cupos_disponibles = cupos_disponibles + 1 WHERE id = ?'
    ).run(evento_id);

    res.json({ ok: true, message: 'Inscripción cancelada exitosamente' });
  } catch (error) {
    res.status(500).json({ ok: false, message: 'Error al cancelar inscripción' });
  }
};

module.exports = { createInscripcion, getInscripcionesByUsuario, cancelarInscripcion };