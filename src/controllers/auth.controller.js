const pool = require('../../database/db');

const registrarUsuario = async (req, res) => {
  try {
    const { id, nombre, correo, password_hash } = req.body;

    const existe = await pool.query(
      'SELECT id FROM usuarios WHERE correo = $1', [correo]
    );
    if (existe.rows.length > 0) {
      return res.status(400).json({ ok: false, message: 'El correo ya está registrado' });
    }

    await pool.query(
      'INSERT INTO usuarios (id, nombre, correo, password_hash) VALUES ($1, $2, $3, $4)',
      [id, nombre, correo, password_hash]
    );

    res.status(201).json({ ok: true, message: 'Usuario creado exitosamente' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ ok: false, message: 'Error interno al registrar usuario' });
  }
};

const loginUsuario = async (req, res) => {
  try {
    const { correo, password_hash } = req.body;

    const result = await pool.query(
      'SELECT id, nombre, correo FROM usuarios WHERE correo = $1 AND password_hash = $2',
      [correo, password_hash]
    );

    if (result.rows.length === 0) {
      return res.status(401).json({ ok: false, message: 'Credenciales incorrectas' });
    }

    res.json({ ok: true, message: 'Login exitoso', data: result.rows[0] });
  } catch (error) {
    console.error(error);
    res.status(500).json({ ok: false, message: 'Error interno en el login' });
  }
};

module.exports = { registrarUsuario, loginUsuario };