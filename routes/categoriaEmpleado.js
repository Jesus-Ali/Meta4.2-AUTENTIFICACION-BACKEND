const express = require('express');
const router = express.Router();
const { CategoriaEmpleado } = require('../models');
const { asegurarAutenticacion } = require('../middleware/auth');

router.use(asegurarAutenticacion);

// GET /categoriaempleado - Obtener todas las categorías
router.get('/', async (req, res) => {
  try {
    const categorias = await CategoriaEmpleado.findAll();
    res.json(categorias);
  } catch (err) {
    res.status(500).json({ error: 'Error al obtener categorías' });
  }
});

// GET /categoriaempleado/:id - Obtener una categoría por su ID
router.get('/:id', async (req, res) => {
  try {
    const categoria = await CategoriaEmpleado.findByPk(req.params.id);
    if (categoria) {
      res.json(categoria);
    } else {
      res.status(404).json({ error: 'Categoria no encontrada'});
    }
  } catch (err) {
    res.status(500).json({ error: 'Error al buscar categoría' });
  }
});

// POST /categoriaempleado - Crear una nueva categoría
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

// PUT /categoriaempleado/:id - Actualizar totalmente una categoría
router.put('/:id', async (req, res) => {
  const { clave, nombre } = req.body;
  if( !clave || !nombre){
    return res.status(400).json({ error: 'Clave y nombre son obligatorios'});
  }

  try {
    const categoria = await CategoriaEmpleado.findByPk(req.params.id);
    if (!categoria) {
      return res.status(404).json({ error: 'Categoría no encontrada' });
    }

    await categoria.update({ clave, nombre });
    res.json(categoria);
  } catch (err) {
    res.status(500).json({ error: 'Error al actualizar categoría' });
  }
});

// PATCH /categoriaempleado/:id - Actualizar parcialmente una categoria
router.patch('/:id', async (req, res) => {
  try{
    const categoria = await CategoriaEmpleado.findByPk(req.params.id);
    if (!categoria) {
      return res.status(404).json({ error: 'Categoria no encontrada'});
    }

    await categoria.update(req.body);
    res.json(categoria);
  } catch (err) {
    res.status(500).json({ error: 'Error al actualizar categoria'});
  }
});

// DELETE /categoriaempleado/:id - Eliminar una categoría
router.delete('/:id', async (req, res) => {
  try {
    const categoria = await CategoriaEmpleado.findByPk(req.params.id);
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
