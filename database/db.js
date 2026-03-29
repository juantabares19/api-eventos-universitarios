const Database = require('better-sqlite3');
const path = require('path');

const db = new Database(path.join(__dirname, 'eventos.db'));

// Crear tablas si no existen
db.exec(`
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
    FOREIGN KEY (evento_id) REFERENCES eventos(id)
  );

  CREATE TABLE IF NOT EXISTS favoritos (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    evento_id INTEGER NOT NULL,
    usuario_id TEXT NOT NULL,
    created_at TEXT DEFAULT (datetime('now')),
    UNIQUE(evento_id, usuario_id)
  );
`);

// Insertar eventos de prueba si la tabla está vacía
const count = db.prepare('SELECT COUNT(*) as total FROM eventos').get();
if (count.total === 0) {
  const insert = db.prepare(`
    INSERT INTO eventos (titulo, descripcion, fecha, hora, lugar, categoria, cupos_totales, cupos_disponibles, organizador)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  insert.run('Hackathon IA 2025', 'Competencia de inteligencia artificial para estudiantes', '2025-03-15', '08:00', 'Bloque A - Sala Ingeniería', 'Académico', 120, 120, 'Semillero de Innovación');
  insert.run('Feria de Emprendimiento', 'Muestra de proyectos emprendedores universitarios', '2025-03-18', '10:00', 'Auditorio Principal', 'Académico', 200, 200, 'Facultad de Negocios');
  insert.run('Semana Cultural 2025', 'Eventos culturales y artísticos de la universidad', '2025-03-22', '09:00', 'Plaza Central', 'Cultural', 500, 500, 'Bienestar Universitario');
  insert.run('Torneo de Fútbol', 'Campeonato interfacultades de fútbol', '2025-03-25', '14:00', 'Cancha Deportiva', 'Deportes', 100, 100, 'Deportes');
}

module.exports = db;