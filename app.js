const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const bodyParser = require('body-parser');

const app = express();
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
  // Tu código de registro aquí
});

// Ruta para inicio de sesión
app.post('/login', async (req, res) => {
  // Tu código de inicio de sesión aquí
});

// Iniciar servidor
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en el puerto ${PORT}`);
});





