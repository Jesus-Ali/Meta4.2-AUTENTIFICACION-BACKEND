const express = require('express');
const fs = require('fs');
const path = require('path');
const router = express.Router();

const routesDir = path.join(__dirname);

// Ruta principal
router.get('/', (req, res) => {
  res.json({ 
    message: 'API - Bienvenido',
    autenticado: req.isAuthenticated(),
    usuario: req.user || null
  });
});

// Cargar authRoutes primero
router.use('/auth', require('./authRoutes'));

router.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK' });
});

// Cargar otras rutas dinámicamente
fs.readdirSync(routesDir)
  .filter(file => {
    return (
      file.endsWith('.js') &&
      file !== 'index.js' &&
      file !== 'authRoutes.js'
    );
  })
  .forEach(file => {
    const route = require(path.join(routesDir, file));
    const routeName = '/' + file.replace('.js', '');
    router.use(routeName, route);
  });

module.exports = router;