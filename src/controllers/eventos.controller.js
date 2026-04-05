const pool = require('../../database/db');

const getEventos = async (req, res) => {
  try {
    const { categoria } = req.query;
    let result;

    if (categoria) {
      result = await pool.query(
        'SELECT * FROM eventos WHERE categoria = $1 ORDER BY fecha ASC', [categoria]
      );
    } else {
      result = await pool.query('SELECT * FROM eventos ORDER BY fecha ASC');
    }

    res.json({ ok: true, data: result.rows });
  } catch (error) {
    res.status(500).json({ ok: false, message: 'Error al obtener eventos' });
  }
};

const getEventoById = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query('SELECT * FROM eventos WHERE id = $1', [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ ok: false, message: 'Evento no encontrado' });
    }

    res.json({ ok: true, data: result.rows[0] });
  } catch (error) {
    res.status(500).json({ ok: false, message: 'Error al obtener el evento' });
  }
};

const createEvento = async (req, res) => {
  try {
    const { titulo, descripcion, fecha, hora, lugar, categoria, cupos_totales, organizador, imagen_url } = req.body;

    if (!titulo || !fecha || !hora || !lugar || !categoria || !cupos_totales) {
      return res.status(400).json({ ok: false, message: 'Faltan campos obligatorios' });
    }

    const result = await pool.query(
      `INSERT INTO eventos (titulo, descripcion, fecha, hora, lugar, categoria, cupos_totales, cupos_disponibles, organizador, imagen_url)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $7, $8, $9) RETURNING id`,
      [titulo, descripcion, fecha, hora, lugar, categoria, cupos_totales, organizador, imagen_url]
    );

    res.status(201).json({ ok: true, message: 'Evento creado', id: result.rows[0].id });
  } catch (error) {
    res.status(500).json({ ok: false, message: 'Error al crear el evento' });
  }
};

module.exports = { getEventos, getEventoById, createEvento };