const express = require('express');
const router = express.Router();
const { CategoriaEmpleado } = require('../models');

// GET /categoria-empleado - Obtener todas las categorías
router.get('/', async (req, res) => {
  try {
    const categorias = await CategoriaEmpleado.findAll();
    res.json(categorias);
  } catch (err) {
    res.status(500).json({ error: 'Error al obtener categorías' });
  }
});

// GET /categoria-empleado/:clave - Obtener una categoría por su clave
router.get('/:clave', async (req, res) => {
  try {
    const categoria = await CategoriaEmpleado.findOne({ where: { clave: req.params.clave } });
    if (!categoria) {
      return res.status(404).json({ error: 'Categoría no encontrada' });
    }
    res.json(categoria);
  } catch (err) {
    res.status(500).json({ error: 'Error al buscar categoría' });
  }
});

// POST /categoria-empleado - Crear una nueva categoría
router.post('/', async (req, res) => {
  const { clave, nombre } = req.body;

  if (!clave || !nombre) {
    return res.status(400).json({ error: 'Clave y nombre son obligatorios' });
  }

  try {
    const existente = await CategoriaEmpleado.findOne({ where: { clave } });
    if (existente) {
      return res.status(409).json({ error: 'La categoría ya existe' });
    }

    const nueva = await CategoriaEmpleado.create({ clave, nombre });
    res.status(201).json(nueva);
  } catch (err) {
    res.status(500).json({ error: 'Error al crear categoría' });
  }
});

// PUT /categoria-empleado/:clave - Actualizar totalmente una categoría
router.put('/:clave', async (req, res) => {
  const { nombre } = req.body;

  try {
    const categoria = await CategoriaEmpleado.findOne({ where: { clave: req.params.clave } });
    if (!categoria) {
      return res.status(404).json({ error: 'Categoría no encontrada' });
    }

    await categoria.update({ nombre });
    res.json(categoria);
  } catch (err) {
    res.status(500).json({ error: 'Error al actualizar categoría' });
  }
});

// DELETE /categoria-empleado/:clave - Eliminar una categoría
router.delete('/:clave', async (req, res) => {
  try {
    const categoria = await CategoriaEmpleado.findOne({ where: { clave: req.params.clave } });
    if (!categoria) {
      return res.status(404).json({ error: 'Categoría no encontrada' });
    }

    await categoria.destroy();
    res.status(204).end();
  } catch (err) {
    res.status(500).json({ error: 'Error al eliminar categoría' });
  }
});

module.exports = router;
