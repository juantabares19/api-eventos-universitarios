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

module.exports = { getEventos, getEventoById, createEvento };