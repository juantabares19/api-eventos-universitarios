const Database = require('better-sqlite3');
const path = require('path');

// Conexión a la base de datos
const db = new Database(path.join(__dirname, 'eventos.db'));

// Configuración para habilitar llaves foráneas en SQLite
db.pragma('foreign_keys = ON');

// Crear tablas si no existen
db.exec(`
  CREATE TABLE IF NOT EXISTS usuarios (
    id TEXT PRIMARY KEY,
    nombre TEXT NOT NULL,
    correo TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    created_at TEXT DEFAULT (datetime('now'))
  );

  CREATE TABLE IF NOT EXISTS eventos (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    titulo TEXT NOT NULL,
    descripcion TEXT,
    fecha TEXT NOT NULL,
    hora TEXT NOT NULL,
    lugar TEXT NOT NULL,
    categoria TEXT NOT NULL,
    cupos_totales INTEGER NOT NULL,
    cupos_disponibles INTEGER NOT NULL,
    imagen_url TEXT,
    organizador TEXT,
    created_at TEXT DEFAULT (datetime('now'))
  );

  CREATE TABLE IF NOT EXISTS inscripciones (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    evento_id INTEGER NOT NULL,
    usuario_id TEXT NOT NULL,
    usuario_nombre TEXT NOT NULL,
    usuario_correo TEXT NOT NULL,
    fecha_inscripcion TEXT DEFAULT (datetime('now')),
    FOREIGN KEY (evento_id) REFERENCES eventos(id) ON DELETE CASCADE,
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE
  );

  CREATE TABLE IF NOT EXISTS favoritos (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    evento_id INTEGER NOT NULL,
    usuario_id TEXT NOT NULL,
    created_at TEXT DEFAULT (datetime('now')),
    UNIQUE(evento_id, usuario_id),
    FOREIGN KEY (evento_id) REFERENCES eventos(id) ON DELETE CASCADE,
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE
  );
`);

// Insertar eventos de prueba si la tabla está vacía
const count = db.prepare('SELECT COUNT(*) as total FROM eventos').get();
if (count.total === 0) {
  const insert = db.prepare(`
    INSERT INTO eventos (titulo, descripcion, fecha, hora, lugar, categoria, cupos_totales, cupos_disponibles, organizador)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  insert.run('Hackathon IA 2026', 'Competencia de inteligencia artificial para estudiantes', '2026-04-15', '08:00', 'Bloque A - Sala Ingeniería', 'Académico', 120, 120, 'Semillero de Innovación');
  insert.run('Feria de Emprendimiento', 'Muestra de proyectos emprendedores universitarios', '2026-04-18', '10:00', 'Auditorio Principal', 'Académico', 200, 200, 'Facultad de Negocios');
  insert.run('Semana Cultural 2026', 'Eventos culturales y artísticos de la universidad', '2026-04-22', '09:00', 'Plaza Central', 'Cultural', 500, 500, 'Bienestar Universitario');
  insert.run('Torneo de Fútbol', 'Campeonato interfacultades de fútbol', '2026-04-25', '14:00', 'Cancha Deportiva', 'Deportes', 100, 100, 'Deportes');
  
  console.log("Datos de prueba insertados correctamente.");
}

module.exports = db;