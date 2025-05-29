const express = require('express');
const router = express.Router();
const { Usuarios } = require('../models');
const { asegurarAutenticacion } = require('../middleware/auth');

// Todas las rutas requieren autenticación
router.use(asegurarAutenticacion);

// GET /usuarios - Obtener todos los usuarios (solo admin debería acceder)
router.get('/', async (req, res) => {
  try {
    const usuarios = await Usuarios.findAll({
      attributes: ['id', 'email', 'createdAt'] // No devolver contraseñas
    });
    res.json(usuarios);
  } catch (err) {
    res.status(500).json({ error: 'Error al obtener usuarios' });
  }
});

// GET /usuarios/:id - Obtener un usuario por ID
router.get('/:id', async (req, res) => {
  try {
    const usuario = await Usuarios.findByPk(req.params.id, {
      attributes: ['id', 'email', 'createdAt']
    });

    if (!usuario) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }

    res.json(usuario);
  } catch (err) {
    res.status(500).json({ error: 'Error al buscar usuario' });
  }
});

// Resto de tus rutas PUT, PATCH, DELETE permanecen igual
// pero ahora están protegidas por el middleware

// POST /usuarios - Crear un nuevo docente
router.post('/', async (req, res) => {
  const { email, contraseña } = req.body;

  if (!email || !contraseña) {
    return res.status(400).json({ error: 'Faltan campos obligatorios' });
  }

  try {
    const nuevo = await Usuarios.create({ email, contraseña });
    res.status(201).json(nuevo);
  } catch (err) {
    res.status(500).json({ error: 'Error al crear usuario' });
  }
});

// PUT /usuarios/:id - Reemplazar completamente un usuario
router.put('/:id', async (req, res) => {
  const { email, contraseña } = req.body;

  if ( !email || !contraseña) {
    return res.status(400).json({ error: 'Faltan campos obligatorios'});
  }

  try {
    const usuario = await Usuarios.findByPk(req.params.id);
    if(!usuario){
      return res.status(404).json({ error: 'Usuario no encontrado'});
    }

    await usuario.update({ email, contraseña });
    res.json(usuario);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al actualizar usuario'});
  }
});

// PATCH /usuarios/:id - Actualizar parcialmente un usuario
router.patch('/:id', async (req, res) => {
  try {
    const usuario = await Usuarios.findByPk(req.params.id);
    if (!usuario) return res.status(404).json({ error: 'Usuario no encontrada' });

    await usuario.update(req.body);
    res.json(usuario);
  } catch (err) {
    res.status(500).json({ error: 'Error al actualizar parcialmente' });
  }
});

// DELETE /usuarios/:id - Eliminar un usuario
router.delete('/:id', async (req, res) => {
  try {
    const usuario = await Usuarios.findByPk(req.params.id);

    if (!usuario) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }

    await usuario.destroy();
    res.status(204).end();
  } catch (err) {
    res.status(500).json({ error: 'Error al eliminar usuario' });
  }
});

module.exports = router;
