// routes/index.js
const express = require('express');
const fs = require('fs');
const path = require('path');
const router = express.Router();

const routesDir = path.join(__dirname);

// Ruta principal
router.get('/', (req, res) => {
  res.send('API de Estudiantes y Personas - Bienvenido');
});

// Leer todos los archivos de rutas en el directorio
fs.readdirSync(routesDir)
  .filter(file => {
    return (
      file.endsWith('.js') &&
      file !== 'index.js' // No nos importamos a nosotros mismos
    );
  })
  .forEach(file => {
    const route = require(path.join(routesDir, file));
    const routeName = '/' + file.replace('.js', '');
    router.use(routeName, route);
  });

module.exports = router;
