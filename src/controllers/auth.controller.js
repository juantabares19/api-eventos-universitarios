const db = require('../../database/db'); // Ajusta la ruta a tu archivo de conexión

const registrarUsuario = (req, res) => {
  try {
    const { id, nombre, correo, password_hash } = req.body;

    // Verificar si el correo ya existe para dar un error claro
    const existe = db.prepare('SELECT id FROM usuarios WHERE correo = ?').get(correo);
    if (existe) {
      return res.status(400).json({ ok: false, message: 'El correo ya está registrado' });
    }

    const insert = db.prepare(`
      INSERT INTO usuarios (id, nombre, correo, password_hash, created_at)
      VALUES (?, ?, ?, ?, DATETIME('now'))
    `);

    insert.run(id, nombre, correo, password_hash);

    res.status(201).json({ ok: true, message: 'Usuario creado exitosamente' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ ok: false, message: 'Error interno al registrar usuario' });
  }
};

const loginUsuario = (req, res) => {
  try {
    const { correo, password_hash } = req.body;

    // Buscamos al usuario por correo y hash de contraseña
    const usuario = db.prepare('SELECT id, nombre, correo FROM usuarios WHERE correo = ? AND password_hash = ?').get(correo, password_hash);

    if (!usuario) {
      return res.status(401).json({ ok: false, message: 'Credenciales incorrectas' });
    }

    res.json({ 
      ok: true, 
      message: 'Login exitoso', 
      data: usuario // Enviamos los datos para que el Front los guarde en Storage
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ ok: false, message: 'Error interno en el login' });
  }
};

module.exports = { registrarUsuario, loginUsuario };