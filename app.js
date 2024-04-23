// Importar los módulos necesarios
const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const bodyParser = require('body-parser');

// Inicializar la aplicación Express
const app = express();

// Middleware para parsear el cuerpo de las solicitudes como JSON
app.use(bodyParser.json());

// Conexión a la base de datos SQLite3
const db = new sqlite3.Database('./database.sqlite3', (err) => {
  if (err) {
    console.error('Error al abrir la base de datos', err.message);
  } else {
    console.log('Conexión exitosa a la base de datos SQLite3');
  }
});

// Crear tabla de usuarios si no existe
db.serialize(() => {
  db.run("CREATE TABLE IF NOT EXISTS users (id INTEGER PRIMARY KEY AUTOINCREMENT, username TEXT, password TEXT)");
});

// Ruta raíz
app.get('/', (req, res) => {
  res.send('¡Bienvenido a la API de registro e inicio de sesión!');
});

// Ruta para registro de usuario
app.post('/register', async (req, res) => {
  const { username, password } = req.body;

  // Verificar si el usuario ya existe en la base de datos
  db.get('SELECT * FROM users WHERE username = ?', [username], async (err, row) => {
    if (err) {
      return res.status(500).json({ error: 'Error interno del servidor' });
    }
    if (row) {
      return res.status(400).json({ error: 'El nombre de usuario ya está en uso' });
    }

    // Encriptar la contraseña antes de guardarla en la base de datos
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insertar el nuevo usuario en la base de datos
    db.run('INSERT INTO users (username, password) VALUES (?, ?)', [username, hashedPassword], (err) => {
      if (err) {
        return res.status(500).json({ error: 'Error interno del servidor' });
      }
      return res.status(201).json({ message: 'Usuario registrado exitosamente' });
    });
  });
});

// Ruta para inicio de sesión
app.post('/login', async (req, res) => {
  const { username, password } = req.body;

  // Buscar al usuario en la base de datos
  db.get('SELECT * FROM users WHERE username = ?', [username], async (err, row) => {
    if (err) {
      return res.status(500).json({ error: 'Error interno del servidor' });
    }
    if (!row) {
      return res.status(401).json({ error: 'Credenciales inválidas' });
    }

    // Verificar la contraseña
    const passwordMatch = await bcrypt.compare(password, row.password);
    if (!passwordMatch) {
      return res.status(401).json({ error: 'Credenciales inválidas' });
    }

    // Generar token JWT
    const token = jwt.sign({ id: row.id, username: row.username }, 'secreto', { expiresIn: '1h' });

    return res.status(200).json({ token });
  });
});

// Iniciar servidor
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en el puerto ${PORT}`);
});






