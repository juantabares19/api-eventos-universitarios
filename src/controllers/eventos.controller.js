const db = require('../../database/db');

// Obtener todos los eventos
const getEventos = (req, res) => {
  try {
    const { categoria } = req.query;
    let eventos;

    if (categoria) {
      eventos = db.prepare('SELECT * FROM eventos WHERE categoria = ? ORDER BY fecha ASC').all(categoria);
    } else {
      eventos = db.prepare('SELECT * FROM eventos ORDER BY fecha ASC').all();
    }

    res.json({ ok: true, data: eventos });
  } catch (error) {
    res.status(500).json({ ok: false, message: 'Error al obtener eventos' });
  }
};

// Obtener un evento por ID
const getEventoById = (req, res) => {
  try {
    const { id } = req.params;
    const evento = db.prepare('SELECT * FROM eventos WHERE id = ?').get(id);

    if (!evento) {
      return res.status(404).json({ ok: false, message: 'Evento no encontrado' });
    }

    res.json({ ok: true, data: evento });
  } catch (error) {
    res.status(500).json({ ok: false, message: 'Error al obtener el evento' });
  }
};

// Crear un evento
const createEvento = (req, res) => {
  try {
    const { titulo, descripcion, fecha, hora, lugar, categoria, cupos_totales, organizador, imagen_url } = req.body;

    if (!titulo || !fecha || !hora || !lugar || !categoria || !cupos_totales) {
      return res.status(400).json({ ok: false, message: 'Faltan campos obligatorios' });
    }

    const result = db.prepare(`
      INSERT INTO eventos (titulo, descripcion, fecha, hora, lugar, categoria, cupos_totales, cupos_disponibles, organizador, imagen_url)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(titulo, descripcion, fecha, hora, lugar, categoria, cupos_totales, cupos_totales, organizador, imagen_url);

    res.status(201).json({ ok: true, message: 'Evento creado', id: result.lastInsertRowid });
  } catch (error) {
    res.status(500).json({ ok: false, message: 'Error al crear el evento' });
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

module.exports = { getEventos, getEventoById, createEvento };